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
    console.log('🚀 Starting blog translation to English...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      skipped: 0
    };

    console.log('📝 Fetching blog posts...');
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*');

    if (postsError) {
      console.error('Error fetching blog posts:', postsError);
      throw postsError;
    }

    console.log(`Found ${posts?.length || 0} posts to translate`);

    for (const post of posts || []) {
      try {
        console.log(`  Translating: ${post.title_es}`);

        // Check if all English fields are present
        if (post.title_en && post.slug_en && post.content_en && post.excerpt_en && post.seo_title_en && post.seo_description_en) {
          console.log(`  ⏭️  Skipped (already translated): ${post.title_es}`);
          results.skipped++;
          continue;
        }

        // Translate all Spanish fields
        const { data: dataEn, error: errorEn } = await supabase.functions.invoke('translate-content', {
          body: { 
            text: {
              title: post.title_es,
              excerpt: post.excerpt_es,
              content: post.content_es,
              seo_title: post.seo_title_es || post.title_es,
              seo_description: post.seo_description_es || post.excerpt_es,
            }, 
            targetLang: 'en', 
            sourceLang: 'es' 
          }
        });

        if (errorEn) throw errorEn;

        const translatedEn = dataEn.translatedText;

        // Update with translated content
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            title_en: translatedEn.title,
            excerpt_en: translatedEn.excerpt,
            content_en: translatedEn.content,
            seo_title_en: translatedEn.seo_title,
            seo_description_en: translatedEn.seo_description,
            slug_en: generateSlug(translatedEn.title),
            updated_at: new Date().toISOString(),
          })
          .eq('id', post.id);

        if (updateError) throw updateError;

        console.log(`  ✅ Post translated: ${post.title_es}`);
        results.success++;

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Error translating ${post.title_es}:`, error);
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`${post.title_es}: ${errorMsg}`);
      }
    }

    console.log('🎉 Blog translation to English complete!');
    console.log('Results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog translation completed',
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
