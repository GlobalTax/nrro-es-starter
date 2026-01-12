import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, tone = "professional", language = "both" } = await req.json();
    
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt es requerido");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY no configurada");
    }

    console.log("[GENERATE_BLOG] Iniciando generación:", { prompt, tone, language });

    const systemPrompt = `Eres un redactor experto especializado en contenido legal, fiscal y corporativo para el despacho Navarro.

Genera artículos profesionales, informativos y optimizados para SEO sobre temas legales, fiscales, mercantiles y laborales.

Tono: ${tone === "technical" ? "Técnico y preciso con terminología especializada" : tone === "divulgative" ? "Divulgativo y accesible para público general" : "Profesional, claro y accesible para empresarios"}

Estructura del artículo:
- Título atractivo y claro (50-70 caracteres)
- Introducción que enganche (2-3 párrafos)
- Desarrollo con subtítulos bien estructurados
- Usa HTML semántico: <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em>
- Incluye listas cuando sea apropiado para mejorar la legibilidad
- Conclusión práctica con llamada a acción
- Longitud: 800-1500 palabras

Categorías disponibles: Fiscal, Mercantil, Laboral, Corporativo, Análisis

Idiomas: ${language === "es" ? "Solo español" : language === "en" ? "Solo inglés" : "Ambos (español e inglés)"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_blog_article",
              description: "Genera un artículo completo de blog bilingüe con metadata SEO",
              parameters: {
                type: "object",
                properties: {
                  title_es: { 
                    type: "string", 
                    description: "Título en español (50-70 caracteres)" 
                  },
                  title_en: { 
                    type: "string", 
                    description: "Title in English (50-70 characters)" 
                  },
                  excerpt_es: { 
                    type: "string", 
                    description: "Resumen breve en español (150-200 caracteres)" 
                  },
                  excerpt_en: { 
                    type: "string", 
                    description: "Brief summary in English (150-200 characters)" 
                  },
                  content_es: { 
                    type: "string", 
                    description: "Contenido HTML completo en español (800-1500 palabras). Usa <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em>" 
                  },
                  content_en: { 
                    type: "string", 
                    description: "Full HTML content in English (800-1500 words). Use <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em>" 
                  },
                  category: {
                    type: "string",
                    enum: ["Fiscal", "Mercantil", "Laboral", "Corporativo", "Análisis"],
                    description: "Categoría más apropiada para el artículo"
                  },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "4-6 tags relevantes para SEO y categorización"
                  },
                  seo_title_es: { 
                    type: "string", 
                    description: "Título SEO optimizado en español (50-60 caracteres)" 
                  },
                  seo_title_en: { 
                    type: "string", 
                    description: "SEO optimized title in English (50-60 characters)" 
                  },
                  seo_description_es: { 
                    type: "string", 
                    description: "Meta descripción SEO en español (150-160 caracteres)" 
                  },
                  seo_description_en: { 
                    type: "string", 
                    description: "SEO meta description in English (150-160 characters)" 
                  }
                },
                required: ["title_es", "title_en", "content_es", "content_en", "category", "tags"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_blog_article" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GENERATE_BLOG] Error de Lovable AI:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Límite de solicitudes excedido. Por favor, intenta de nuevo en unos minutos." 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Sin créditos de IA disponibles. Contacta con soporte para añadir más créditos." 
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Error de Lovable AI: ${response.status}`);
    }

    const data = await response.json();
    console.log("[GENERATE_BLOG] Respuesta recibida:", data);

    if (!data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
      throw new Error("Formato de respuesta inesperado de Lovable AI");
    }

    const articleData = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
    
    // Calcular tiempo de lectura
    const wordCount = articleData.content_es.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    
    // Generar imagen destacada con IA
    let featured_image_url: string | null = null;
    
    try {
      console.log('[IMAGE] Generando imagen para el artículo...');
      
      const imagePrompt = `Create a professional, modern blog header image for an article titled "${articleData.title_es}". 
The article is about: ${articleData.excerpt_es || articleData.title_es}
Category: ${articleData.category}
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

    const result = {
      ...articleData,
      read_time: readTime,
      generated_with_ai: true,
      featured_image_url
    };

    console.log("[GENERATE_BLOG] Artículo generado exitosamente:", {
      category: result.category,
      tags: result.tags,
      readTime: result.read_time,
      hasImage: !!featured_image_url
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[GENERATE_BLOG] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Error desconocido" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
