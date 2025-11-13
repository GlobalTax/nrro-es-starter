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
    console.log('🚀 Starting services translation to Catalan...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      skipped: 0
    };

    console.log('📝 Fetching services...');
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .or('name_ca.is.null,slug_ca.is.null,metodologia_ca.is.null,servicios_transversales_ca.is.null');

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
      throw servicesError;
    }

    console.log(`Found ${services?.length || 0} services to translate`);

    for (const service of services || []) {
      try {
        console.log(`  Translating: ${service.name_es}`);

        if (service.name_ca && service.slug_ca && service.description_ca && 
            service.metodologia_ca && service.servicios_transversales_ca) {
          console.log(`  ⏭️  Skipped (already translated): ${service.name_es}`);
          results.skipped++;
          continue;
        }

        const textToTranslate: any = {
          name: service.name_es,
          description: service.description_es,
          area: service.area_es,
        };

        // Add metodologia if exists
        if (service.metodologia_es) {
          console.log(`    - metodologia (${Object.keys(service.metodologia_es).length} keys)`);
          textToTranslate.metodologia = service.metodologia_es;
        }

        // Add servicios_transversales if exists
        if (service.servicios_transversales_es) {
          console.log(`    - servicios_transversales (${service.servicios_transversales_es.length} items)`);
          textToTranslate.servicios_transversales = service.servicios_transversales_es;
        }

        // Add stats if exists
        if (service.stats_es) {
          console.log(`    - stats (${service.stats_es.length} items)`);
          textToTranslate.stats = service.stats_es;
        }

        const { data: dataCa, error: errorCa } = await supabase.functions.invoke('translate-content', {
          body: { 
            text: textToTranslate, 
            targetLang: 'ca', 
            sourceLang: 'es' 
          }
        });

        if (errorCa) throw errorCa;

        const translatedCa = dataCa.translatedText;

        const updateData: any = {
          name_ca: translatedCa.name,
          description_ca: translatedCa.description,
          area_ca: translatedCa.area,
          slug_ca: generateSlug(translatedCa.name),
          updated_at: new Date().toISOString(),
        };

        // Add translated metodologia if exists
        if (translatedCa.metodologia) {
          updateData.metodologia_ca = translatedCa.metodologia;
        }

        // Add translated servicios_transversales if exists
        if (translatedCa.servicios_transversales) {
          updateData.servicios_transversales_ca = translatedCa.servicios_transversales;
        }

        // Add translated stats if exists
        if (translatedCa.stats) {
          updateData.stats_ca = translatedCa.stats;
        }

        const { error: updateError } = await supabase
          .from('services')
          .update(updateData)
          .eq('id', service.id);

        if (updateError) throw updateError;

        console.log(`  ✅ Service translated: ${service.name_es}`);
        results.success++;

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Error translating ${service.name_es}:`, error);
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`${service.name_es}: ${errorMsg}`);
      }
    }

    console.log('🎉 Services translation to Catalan complete!');
    console.log('Results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Services translation completed',
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
