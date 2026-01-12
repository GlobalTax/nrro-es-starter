import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key no configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analiza este artículo y genera los metadatos:\n\n${content_es}` }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_blog_content',
              description: 'Extrae metadatos optimizados de un artículo de blog',
              parameters: {
                type: 'object',
                properties: {
                  title_es: {
                    type: 'string',
                    description: 'Título atractivo en español (máx 60 caracteres)'
                  },
                  title_en: {
                    type: 'string',
                    description: 'Título atractivo en inglés (máx 60 caracteres)'
                  },
                  excerpt_es: {
                    type: 'string',
                    description: 'Extracto resumido en español (máx 160 caracteres)'
                  },
                  excerpt_en: {
                    type: 'string',
                    description: 'Extracto resumido en inglés (máx 160 caracteres)'
                  },
                  seo_title_es: {
                    type: 'string',
                    description: 'Título SEO en español (50-60 caracteres)'
                  },
                  seo_title_en: {
                    type: 'string',
                    description: 'Título SEO en inglés (50-60 caracteres)'
                  },
                  seo_description_es: {
                    type: 'string',
                    description: 'Meta descripción SEO en español (150-160 caracteres)'
                  },
                  seo_description_en: {
                    type: 'string',
                    description: 'Meta descripción SEO en inglés (150-160 caracteres)'
                  },
                  category: {
                    type: 'string',
                    enum: ['Fiscal', 'Mercantil', 'Laboral', 'Corporativo', 'Análisis'],
                    description: 'Categoría del artículo'
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array de 3-5 tags relevantes',
                    minItems: 3,
                    maxItems: 5
                  }
                },
                required: ['title_es', 'title_en', 'excerpt_es', 'excerpt_en', 'seo_title_es', 'seo_title_en', 'seo_description_es', 'seo_description_en', 'category', 'tags'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_blog_content' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Límite de solicitudes excedido. Por favor, intenta de nuevo más tarde.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos agotados. Por favor, recarga tu cuenta de Lovable AI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Error al procesar con IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in response');
      return new Response(
        JSON.stringify({ error: 'Respuesta inesperada de la IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

    // Calcular tiempo de lectura basado en palabras
    const wordsPerMinute = 200;
    const wordCount = content_es.split(/\s+/).length;
    const read_time = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    // Generar imagen destacada con IA
    let featured_image_url: string | null = null;
    
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
          messages: [
            { role: 'user', content: imagePrompt }
          ],
          modalities: ['image', 'text']
        })
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (base64Image) {
          console.log('[IMAGE] Imagen generada, subiendo a storage...');
          
          // Convertir base64 a buffer
          const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          
          // Crear cliente de Supabase
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
          const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
          
          // Subir a Supabase Storage
          const fileName = `generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
          const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('blog-media')
            .upload(fileName, buffer, {
              contentType: 'image/png',
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('[IMAGE] Error uploading image:', uploadError);
          } else {
            const { data: publicUrlData } = supabaseClient.storage
              .from('blog-media')
              .getPublicUrl(fileName);
            
            featured_image_url = publicUrlData.publicUrl;
            console.log('[IMAGE] Imagen subida exitosamente:', featured_image_url);
          }
        }
      } else {
        console.warn('[IMAGE] No se pudo generar la imagen, continuando sin ella');
      }
    } catch (imageError) {
      console.error('[IMAGE] Error en generación de imagen:', imageError);
      // No bloqueamos el proceso si falla la imagen
    }

    return new Response(
      JSON.stringify({ ...result, read_time, featured_image_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-blog-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
