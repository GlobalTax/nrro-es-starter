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
    console.log('🚀 Starting news articles translation to Catalan...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      skipped: 0
    };

    console.log('📝 Fetching news articles...');
    const { data: articles, error: articlesError } = await supabase
      .from('news_articles')
      .select('*')
      .or('title_ca.is.null,slug_ca.is.null');

    if (articlesError) {
      console.error('Error fetching news articles:', articlesError);
      throw articlesError;
    }

    console.log(`Found ${articles?.length || 0} news articles to translate`);

    for (const article of articles || []) {
      try {
        console.log(`  Translating: ${article.title_es}`);

        if (article.title_ca && article.slug_ca && article.content_ca) {
          console.log(`  ⏭️  Skipped (already translated): ${article.title_es}`);
          results.skipped++;
          continue;
        }

        const { data: dataCa, error: errorCa } = await supabase.functions.invoke('translate-content', {
          body: { 
            text: {
              title: article.title_es,
              excerpt: article.excerpt_es || '',
              content: article.content_es,
            }, 
            targetLang: 'ca', 
            sourceLang: 'es' 
          }
        });

        if (errorCa) throw errorCa;

        const translatedCa = dataCa.translatedText;

        const { error: updateError } = await supabase
          .from('news_articles')
          .update({
            title_ca: translatedCa.title,
            slug_ca: generateSlug(translatedCa.title),
            excerpt_ca: translatedCa.excerpt,
            content_ca: translatedCa.content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', article.id);

        if (updateError) throw updateError;

        console.log(`  ✅ News article translated: ${article.title_es}`);
        results.success++;

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Error translating ${article.title_es}:`, error);
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`${article.title_es}: ${errorMsg}`);
      }
    }

    console.log('🎉 News articles translation to Catalan complete!');
    console.log('Results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'News articles translation completed',
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
