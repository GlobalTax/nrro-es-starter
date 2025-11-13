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
    console.log('🚀 Starting case studies translation to Catalan...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      skipped: 0
    };

    console.log('📝 Fetching case studies...');
    const { data: caseStudies, error: caseStudiesError } = await supabase
      .from('case_studies')
      .select('*')
      .or('title_ca.is.null,slug_ca.is.null');

    if (caseStudiesError) {
      console.error('Error fetching case studies:', caseStudiesError);
      throw caseStudiesError;
    }

    console.log(`Found ${caseStudies?.length || 0} case studies to translate`);

    for (const caseStudy of caseStudies || []) {
      try {
        console.log(`  Translating: ${caseStudy.title_es || caseStudy.title}`);

        if (caseStudy.title_ca && caseStudy.slug_ca) {
          console.log(`  ⏭️  Skipped (already translated): ${caseStudy.title_es || caseStudy.title}`);
          results.skipped++;
          continue;
        }

        const { data: dataCa, error: errorCa } = await supabase.functions.invoke('translate-content', {
          body: { 
            text: {
              title: caseStudy.title_es || caseStudy.title,
              hero_title: caseStudy.hero_title_es || caseStudy.hero_title,
              hero_subtitle: caseStudy.hero_subtitle_es || caseStudy.hero_subtitle || '',
              challenge: caseStudy.challenge_es || caseStudy.challenge,
              solution: caseStudy.solution_es || caseStudy.solution,
              results_summary: caseStudy.results_summary_es || caseStudy.results_summary,
              detailed_content: caseStudy.detailed_content_es || caseStudy.detailed_content || '',
              testimonial_text: caseStudy.testimonial_text_es || caseStudy.testimonial_text || '',
              meta_title: caseStudy.meta_title_es || caseStudy.meta_title || '',
              meta_description: caseStudy.meta_description_es || caseStudy.meta_description || '',
            }, 
            targetLang: 'ca', 
            sourceLang: 'es' 
          }
        });

        if (errorCa) throw errorCa;

        const translatedCa = dataCa.translatedText;

        const { error: updateError } = await supabase
          .from('case_studies')
          .update({
            title_ca: translatedCa.title,
            slug_ca: generateSlug(translatedCa.title),
            hero_title_ca: translatedCa.hero_title,
            hero_subtitle_ca: translatedCa.hero_subtitle,
            challenge_ca: translatedCa.challenge,
            solution_ca: translatedCa.solution,
            results_summary_ca: translatedCa.results_summary,
            detailed_content_ca: translatedCa.detailed_content,
            testimonial_text_ca: translatedCa.testimonial_text,
            meta_title_ca: translatedCa.meta_title,
            meta_description_ca: translatedCa.meta_description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', caseStudy.id);

        if (updateError) throw updateError;

        console.log(`  ✅ Case study translated: ${caseStudy.title_es || caseStudy.title}`);
        results.success++;

        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`  ❌ Error translating ${caseStudy.title_es || caseStudy.title}:`, error);
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`${caseStudy.title_es || caseStudy.title}: ${errorMsg}`);
      }
    }

    console.log('🎉 Case studies translation to Catalan complete!');
    console.log('Results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Case studies translation completed',
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
