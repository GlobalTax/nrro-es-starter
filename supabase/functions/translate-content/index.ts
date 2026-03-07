import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const GOOGLE_TRANSLATE_API_KEY = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash using Web Crypto API
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLang, sourceLang = 'es' } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!['ca', 'en'].includes(targetLang)) {
      return new Response(JSON.stringify({ error: 'Target language must be ca or en' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let cacheHits = 0;
    let apiCalls = 0;

    // Check cache for a single string
    const getCached = async (value: string): Promise<string | null> => {
      const hash = await sha256(value);
      const { data } = await supabaseAdmin
        .from('translation_cache')
        .select('translated_text')
        .eq('source_hash', hash)
        .eq('source_lang', sourceLang)
        .eq('target_lang', targetLang)
        .maybeSingle();

      if (data) {
        // Update hit_count and last_used_at in background (increment hit_count manually)
        supabaseAdmin
          .from('translation_cache')
          .select('hit_count')
          .eq('source_hash', hash)
          .eq('source_lang', sourceLang)
          .eq('target_lang', targetLang)
          .maybeSingle()
          .then(({ data: row }) => {
            if (row) {
              supabaseAdmin
                .from('translation_cache')
                .update({ hit_count: (row.hit_count || 0) + 1, last_used_at: new Date().toISOString() })
                .eq('source_hash', hash)
                .eq('source_lang', sourceLang)
                .eq('target_lang', targetLang)
                .then(() => {});
            }
          });
        
        cacheHits++;
        return data.translated_text;
      }
      return null;
    };

    // Save to cache
    const saveToCache = async (sourceText: string, translatedText: string) => {
      const hash = await sha256(sourceText);
      await supabaseAdmin
        .from('translation_cache')
        .upsert({
          source_hash: hash,
          source_lang: sourceLang,
          target_lang: targetLang,
          source_text: sourceText,
          translated_text: translatedText,
          hit_count: 0,
          last_used_at: new Date().toISOString(),
        }, { onConflict: 'source_hash,source_lang,target_lang' });
    };

    // Recursive translate with cache
    const translateValue = async (value: any): Promise<any> => {
      if (typeof value === 'string' && value.trim()) {
        // Try cache first
        const cached = await getCached(value);
        if (cached) return cached;

        // Call Google Translate
        apiCalls++;
        const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: value,
              source: sourceLang,
              target: targetLang,
              format: 'text',
            }),
          }
        );

        if (!response.ok) {
          const error = await response.text();
          console.error('Google Translate API error:', error);
          throw new Error(`Translation API error: ${response.status}`);
        }

        const data = await response.json();
        const translated = data.data.translations[0].translatedText;

        // Save to cache (fire and forget)
        saveToCache(value, translated).catch(err => 
          console.error('Cache save error:', err)
        );

        return translated;
      } else if (Array.isArray(value)) {
        return Promise.all(value.map(item => translateValue(item)));
      } else if (typeof value === 'object' && value !== null) {
        const translated: any = {};
        for (const [key, val] of Object.entries(value)) {
          translated[key] = await translateValue(val);
        }
        return translated;
      }
      return value;
    };

    const translatedText = await translateValue(text);

    console.log(`Translation complete: ${cacheHits} cache hits, ${apiCalls} API calls`);

    return new Response(JSON.stringify({ translatedText, cacheHits, apiCalls }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in translate-content function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
