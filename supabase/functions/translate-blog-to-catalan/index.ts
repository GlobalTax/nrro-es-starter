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
    console.log('🚀 Starting blog translation to Catalan...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      skipped: 0
    };

    // Fetch all blog posts
    console.log('📝 Fetching blog posts...');
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .or('title_ca.is.null,slug_ca.is.null'); // Only posts without Catalan translation

    if (postsError) {
      console.error('Error fetching blog posts:', postsError);
      throw postsError;
    }

    console.log(`Found ${posts?.length || 0} posts to translate`);

    for (const post of posts || []) {
      try {
        console.log(`  Translating: ${post.title_es}`);

        // Check if already translated
        if (post.title_ca && post.slug_ca) {
          console.log(`  ⏭️  Skipped (already translated): ${post.title_es}`);
          results.skipped++;
          continue;
        }

        // Translate to Catalan
        const { data: dataCa, error: errorCa } = await supabase.functions.invoke('translate-content', {
          body: { 
            text: {
              title: post.title_es,
              excerpt: post.excerpt_es,
              content: post.content_es,
              seo_title: post.seo_title_es || post.title_es,
              seo_description: post.seo_description_es || post.excerpt_es,
            }, 
            targetLang: 'ca', 
            sourceLang: 'es' 
          }
        });

        if (errorCa) throw errorCa;

        const translatedCa = dataCa.translatedText;

        // Update blog post with Catalan content
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            title_ca: translatedCa.title,
            excerpt_ca: translatedCa.excerpt,
            content_ca: translatedCa.content,
            seo_title_ca: translatedCa.seo_title,
            seo_description_ca: translatedCa.seo_description,
            slug_ca: generateSlug(translatedCa.title),
            updated_at: new Date().toISOString(),
          })
          .eq('id', post.id);

        if (updateError) throw updateError;

        console.log(`  ✅ Post translated: ${post.title_es}`);
        results.success++;

        // Delay to avoid rate limits (1 second between translations)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Error translating ${post.title_es}:`, error);
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`${post.title_es}: ${errorMsg}`);
      }
    }

    console.log('🎉 Blog translation to Catalan complete!');
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