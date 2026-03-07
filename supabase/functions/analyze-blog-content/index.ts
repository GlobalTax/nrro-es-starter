import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper para fetch con timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 25000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// ========== CLAUDE + FALLBACK HELPER ==========
async function callClaudeWithFallback(params: {
  systemPrompt: string;
  userPrompt: string;
  toolName: string;
  toolDescription: string;
  toolParameters: Record<string, unknown>;
  requiredFields: string[];
  timeoutMs?: number;
}): Promise<Record<string, unknown>> {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const timeoutMs = params.timeoutMs || 30000;

  if (ANTHROPIC_API_KEY) {
    try {
      console.log(`[AI] Calling Claude for ${params.toolName}...`);
      const resp = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: params.systemPrompt,
          messages: [{ role: "user", content: params.userPrompt }],
          tools: [{
            name: params.toolName,
            description: params.toolDescription,
            input_schema: {
              type: "object",
              properties: params.toolParameters,
              required: params.requiredFields,
            }
          }],
          tool_choice: { type: "tool", name: params.toolName },
        }),
      }, timeoutMs);

      if (resp.ok) {
        const data = await resp.json();
        const toolUse = data.content?.find((b: { type: string }) => b.type === "tool_use");
        if (toolUse?.input) {
          console.log(`[AI] ✅ Claude OK for ${params.toolName}`);
          return toolUse.input;
        }
      } else {
        console.warn(`[AI] Claude ${resp.status}, falling back...`);
      }
    } catch (err) {
      console.warn(`[AI] Claude failed: ${err instanceof Error ? err.message : 'unknown'}, falling back...`);
    }
  }

  if (!LOVABLE_API_KEY) throw new Error("No AI keys configured");

  console.log(`[AI] Using Lovable Gateway for ${params.toolName}...`);
  const resp = await fetchWithTimeout("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: params.systemPrompt },
        { role: "user", content: params.userPrompt },
      ],
      tools: [{
        type: "function",
        function: {
          name: params.toolName,
          description: params.toolDescription,
          parameters: { type: "object", properties: params.toolParameters, required: params.requiredFields, additionalProperties: false }
        }
      }],
      tool_choice: { type: "function", function: { name: params.toolName } },
    }),
  }, timeoutMs);

  if (!resp.ok) {
    if (resp.status === 429) throw Object.assign(new Error("Rate limit"), { status: 429 });
    if (resp.status === 402) throw Object.assign(new Error("Payment required"), { status: 402 });
    throw new Error(`Gateway error ${resp.status}`);
  }

  const data = await resp.json();
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("No tool call in response");
  console.log(`[AI] ✅ Gateway OK for ${params.toolName}`);
  return JSON.parse(args);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content_es, content_en } = await req.json();

    if (!content_es || content_es.trim().length < 100) {
      return new Response(
        JSON.stringify({ error: 'El contenido debe tener al menos 100 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Eres un asistente especializado en analizar artículos de blog sobre fiscalidad, contabilidad y derecho empresarial.

Analiza el contenido proporcionado y extrae:
1. Título atractivo y claro en español e inglés (máx 60 caracteres cada uno)
2. Extracto resumido que capte la esencia en español e inglés (máx 160 caracteres cada uno)
3. Título SEO optimizado en español e inglés (50-60 caracteres, incluye palabras clave)
4. Meta descripción SEO en español e inglés (150-160 caracteres, incluye palabras clave y CTA)
5. Categoría apropiada (una de: "Fiscal", "Mercantil", "Laboral", "Corporativo", "Análisis")
6. Tags relevantes (3-5 palabras clave específicas del contenido)

Asegúrate de que:
- Los títulos sean atractivos, informativos y reflejen el contenido
- Los extractos capturen la idea principal del artículo
- Las meta descripciones sean persuasivas e incluyan llamadas a la acción
- Los tags sean específicos y relevantes al tema del artículo
- Todo el contenido esté optimizado para SEO sin perder naturalidad`;

    const toolParameters = {
      title_es: { type: 'string', description: 'Título atractivo en español (máx 60 caracteres)' },
      title_en: { type: 'string', description: 'Título atractivo en inglés (máx 60 caracteres)' },
      excerpt_es: { type: 'string', description: 'Extracto resumido en español (máx 160 caracteres)' },
      excerpt_en: { type: 'string', description: 'Extracto resumido en inglés (máx 160 caracteres)' },
      seo_title_es: { type: 'string', description: 'Título SEO en español (50-60 caracteres)' },
      seo_title_en: { type: 'string', description: 'Título SEO en inglés (50-60 caracteres)' },
      seo_description_es: { type: 'string', description: 'Meta descripción SEO en español (150-160 caracteres)' },
      seo_description_en: { type: 'string', description: 'Meta descripción SEO en inglés (150-160 caracteres)' },
      category: { type: 'string', enum: ['Fiscal', 'Mercantil', 'Laboral', 'Corporativo', 'Análisis'], description: 'Categoría del artículo' },
      tags: { type: 'array', items: { type: 'string' }, description: 'Array de 3-5 tags relevantes' },
    };

    let result: Record<string, unknown>;
    try {
      result = await callClaudeWithFallback({
        systemPrompt,
        userPrompt: `Analiza este artículo y genera los metadatos:\n\n${content_es}`,
        toolName: 'analyze_blog_content',
        toolDescription: 'Extrae metadatos optimizados de un artículo de blog',
        toolParameters,
        requiredFields: ['title_es', 'title_en', 'excerpt_es', 'excerpt_en', 'seo_title_es', 'seo_title_en', 'seo_description_es', 'seo_description_en', 'category', 'tags'],
      });
    } catch (err: unknown) {
      const error = err as { status?: number };
      if (error.status === 429) {
        return new Response(JSON.stringify({ error: 'Límite de solicitudes excedido.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (error.status === 402) {
        return new Response(JSON.stringify({ error: 'Créditos agotados.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw err;
    }

    // Calcular tiempo de lectura
    const wordsPerMinute = 200;
    const wordCount = content_es.split(/\s+/).length;
    const read_time = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    // Generar imagen destacada con IA (sigue con Gemini)
    let featured_image_url: string | null = null;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (LOVABLE_API_KEY) {
      try {
        console.log('[IMAGE] Generando imagen para el artículo...');
        
        const imagePrompt = `Create a professional, modern blog header image for an article titled "${result.title_es}". 
The article is about: ${result.excerpt_es}
Category: ${result.category}
Style: Clean, corporate, professional suitable for a law and business consulting firm website. 
Use abstract shapes, gradients, or symbolic imagery related to law, finance, or business. 
No text in the image.
Aspect ratio: 16:9 (1200x675px)
Ultra high resolution, professional photography style`;

        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [{ role: 'user', content: imagePrompt }],
            modalities: ['image', 'text']
          })
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (base64Image) {
            console.log('[IMAGE] Imagen generada, subiendo a storage...');
            const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
            const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
            const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
            
            const fileName = `generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
            const { error: uploadError } = await supabaseClient.storage
              .from('blog-media')
              .upload(fileName, buffer, { contentType: 'image/png', cacheControl: '3600', upsert: false });

            if (uploadError) {
              console.error('[IMAGE] Error uploading image:', uploadError);
            } else {
              const { data: publicUrlData } = supabaseClient.storage.from('blog-media').getPublicUrl(fileName);
              featured_image_url = publicUrlData.publicUrl;
              console.log('[IMAGE] Imagen subida exitosamente:', featured_image_url);
            }
          }
        }
      } catch (imageError) {
        console.error('[IMAGE] Error en generación de imagen:', imageError);
      }
    }

    return new Response(
      JSON.stringify({ ...result, read_time, featured_image_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-blog-content:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar el contenido. Inténtalo de nuevo.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
