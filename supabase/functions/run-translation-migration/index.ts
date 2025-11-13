import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting translation migration...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
      services: { success: 0, failed: 0, errors: [] as string[] },
      pageContent: { success: 0, failed: 0, errors: [] as string[] }
    };

    // Translate services
    console.log('📝 Translating services...');
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true);

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
      throw servicesError;
    }

    for (const service of services || []) {
      try {
        console.log(`  Translating: ${service.name_es}`);

        // Translate to Catalan
        const { data: dataCa, error: errorCa } = await supabase.functions.invoke('translate-content', {
          body: { 
            text: {
              name: service.name_es,
              description: service.description_es,
              area: service.area_es
            }, 
            targetLang: 'ca', 
            sourceLang: 'es' 
          }
        });

        if (errorCa) throw errorCa;

        // Translate to English
        const { data: dataEn, error: errorEn } = await supabase.functions.invoke('translate-content', {
          body: { 
            text: {
              name: service.name_es,
              description: service.description_es,
              area: service.area_es
            }, 
            targetLang: 'en', 
            sourceLang: 'es' 
          }
        });

        if (errorEn) throw errorEn;

        const translatedCa = dataCa.translatedText;
        const translatedEn = dataEn.translatedText;

        // Update service
        const { error: updateError } = await supabase
          .from('services')
          .update({
            name_ca: translatedCa.name,
            name_en: translatedEn.name,
            description_ca: translatedCa.description,
            description_en: translatedEn.description,
            area_ca: translatedCa.area,
            area_en: translatedEn.area,
            slug_ca: generateSlug(translatedCa.name),
            slug_en: generateSlug(translatedEn.name),
            updated_at: new Date().toISOString(),
          })
          .eq('id', service.id);

        if (updateError) throw updateError;

        console.log(`  ✅ Service translated: ${service.name_es}`);
        results.services.success++;

        // Delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Error translating ${service.name_es}:`, error);
        results.services.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.services.errors.push(`${service.name_es}: ${errorMsg}`);
      }
    }

    // Translate page_content
    console.log('📄 Translating page_content...');
    const { data: contentES, error: contentError } = await supabase
      .from('page_content')
      .select('*')
      .eq('language', 'es')
      .eq('is_active', true);

    if (contentError) {
      console.error('Error fetching page content:', contentError);
      throw contentError;
    }

    for (const content of contentES || []) {
      try {
        console.log(`  Translating: ${content.page_key} - ${content.section_key}`);

        for (const targetLang of ['ca', 'en'] as const) {
          try {
            const { data: translated, error: translateError } = await supabase.functions.invoke('translate-content', {
              body: { text: content.content, targetLang, sourceLang: 'es' }
            });

            if (translateError) throw translateError;

            // Try to update first, if not exists then insert
            const { data: existing } = await supabase
              .from('page_content')
              .select('id')
              .eq('page_key', content.page_key)
              .eq('section_key', content.section_key)
              .eq('language', targetLang)
              .single();

            if (existing) {
              // Update existing record
              const { error: updateError } = await supabase
                .from('page_content')
                .update({
                  content: translated.translatedText,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id);

              if (updateError) throw updateError;
              console.log(`    ✅ Updated version in ${targetLang}`);
            } else {
              // Insert new record
              const { error: insertError } = await supabase
                .from('page_content')
                .insert({
                  page_key: content.page_key,
                  section_key: content.section_key,
                  content: translated.translatedText,
                  is_active: content.is_active,
                  display_order: content.display_order,
                  language: targetLang,
                });

              if (insertError) throw insertError;
              console.log(`    ✅ Created version in ${targetLang}`);
            }
          } catch (langError) {
            console.error(`    ❌ Error translating to ${targetLang}:`, langError);
            results.pageContent.failed++;
            const langErrorMsg = langError instanceof Error ? langError.message : String(langError);
            results.pageContent.errors.push(`${content.page_key}-${content.section_key} (${targetLang}): ${langErrorMsg}`);
          }

          // Delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        results.pageContent.success++;
      } catch (error) {
        console.error(`  ❌ Error processing ${content.page_key} - ${content.section_key}:`, error);
        results.pageContent.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.pageContent.errors.push(`${content.page_key}-${content.section_key}: ${errorMsg}`);
      }
    }

    console.log('🎉 Translation migration complete!');
    console.log('Results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Translation migration completed',
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('💥 Fatal error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMsg 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
