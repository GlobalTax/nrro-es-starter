import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Lista de frases genéricas a evitar/reescribir
const GENERIC_PHRASES = [
  "en el ámbito de",
  "cabe destacar",
  "es importante mencionar",
  "es importante señalar",
  "dicho lo anterior",
  "en este sentido",
  "es fundamental",
  "sin lugar a dudas",
  "de gran importancia",
  "en la actualidad",
  "hoy en día",
  "en el contexto actual",
  "es necesario subrayar",
  "vale la pena mencionar",
  "it is important to note",
  "it should be noted",
  "it is worth mentioning",
  "in the current context",
  "nowadays",
  "in today's world",
];

// Función para contar frases genéricas
function countGenericPhrases(content: string): number {
  const lowerContent = content.toLowerCase();
  return GENERIC_PHRASES.filter(phrase => lowerContent.includes(phrase.toLowerCase())).length;
}

// Función para calcular estadísticas de contenido
function analyzeContent(content: string): {
  wordCount: number;
  paragraphCount: number;
  avgWordsPerParagraph: number;
  headingCount: number;
  listCount: number;
  genericPhraseCount: number;
  hasExample: boolean;
  hasCTA: boolean;
} {
  const textContent = content.replace(/<[^>]*>/g, ' ');
  const words = textContent.split(/\s+/).filter(w => w.length > 0);
  const paragraphs = content.match(/<p[^>]*>/gi) || [];
  const headings = content.match(/<h[2-3][^>]*>/gi) || [];
  const lists = content.match(/<[uo]l[^>]*>/gi) || [];
  
  // Detectar ejemplos
  const hasExample = /ejemplo|case|caso práctico|por ejemplo|for example|such as|como por ejemplo/i.test(content);
  
  // Detectar CTA
  const hasCTA = /contacta|contáctanos|contact us|solicita|consúltanos|llámanos|call us|get in touch|habla con nosotros/i.test(content);

  return {
    wordCount: words.length,
    paragraphCount: paragraphs.length,
    avgWordsPerParagraph: paragraphs.length > 0 ? Math.round(words.length / paragraphs.length) : 0,
    headingCount: headings.length,
    listCount: lists.length,
    genericPhraseCount: countGenericPhrases(content),
    hasExample,
    hasCTA,
  };
}

// Función para validar contenido con checklist editorial
function validateContent(contentEs: string, contentEn: string | null): {
  score: number;
  checks: Record<string, { passed: boolean; score: number; details?: string }>;
  passed: boolean;
} {
  const statsEs = analyzeContent(contentEs);
  const statsEn = contentEn ? analyzeContent(contentEn) : null;
  
  const checks: Record<string, { passed: boolean; score: number; details?: string }> = {};
  let totalScore = 0;

  // 1. Ejemplo real (20 pts)
  const hasExample = statsEs.hasExample || (statsEn?.hasExample ?? false);
  checks.has_example = {
    passed: hasExample,
    score: hasExample ? 20 : 0,
    details: hasExample ? "Contiene al menos un ejemplo práctico" : "Falta incluir ejemplos prácticos"
  };
  totalScore += checks.has_example.score;

  // 2. Párrafos cortos (15 pts) - promedio < 100 palabras
  const avgWords = statsEs.avgWordsPerParagraph;
  const shortParagraphs = avgWords < 100;
  checks.short_paragraphs = {
    passed: shortParagraphs,
    score: shortParagraphs ? 15 : (avgWords < 150 ? 8 : 0),
    details: `Promedio: ${avgWords} palabras/párrafo`
  };
  totalScore += checks.short_paragraphs.score;

  // 3. Voz activa (15 pts) - menos de 20% pasiva (simplificado)
  const passiveIndicators = (contentEs.match(/es\s+\w+ado|es\s+\w+ido|son\s+\w+ados|son\s+\w+idos|fue\s+\w+ado|fueron\s+\w+ados/gi) || []).length;
  const sentences = contentEs.split(/[.!?]+/).length;
  const passiveRatio = sentences > 0 ? passiveIndicators / sentences : 0;
  const activeVoice = passiveRatio < 0.2;
  checks.active_voice = {
    passed: activeVoice,
    score: activeVoice ? 15 : (passiveRatio < 0.3 ? 8 : 0),
    details: `${Math.round(passiveRatio * 100)}% oraciones en pasiva detectadas`
  };
  totalScore += checks.active_voice.score;

  // 4. CTA presente (15 pts)
  const hasCTA = statsEs.hasCTA || (statsEn?.hasCTA ?? false);
  checks.has_cta = {
    passed: hasCTA,
    score: hasCTA ? 15 : 0,
    details: hasCTA ? "Incluye llamada a acción" : "Falta llamada a acción al final"
  };
  totalScore += checks.has_cta.score;

  // 5. Longitud óptima (15 pts) - 800-1500 palabras
  const optimalLength = statsEs.wordCount >= 800 && statsEs.wordCount <= 1500;
  checks.optimal_length = {
    passed: optimalLength,
    score: optimalLength ? 15 : (statsEs.wordCount >= 600 && statsEs.wordCount <= 2000 ? 8 : 0),
    details: `${statsEs.wordCount} palabras`
  };
  totalScore += checks.optimal_length.score;

  // 6. Subtítulos (10 pts) - al menos 3 secciones
  const hasSubtitles = statsEs.headingCount >= 3;
  checks.has_subtitles = {
    passed: hasSubtitles,
    score: hasSubtitles ? 10 : (statsEs.headingCount >= 2 ? 5 : 0),
    details: `${statsEs.headingCount} subtítulos encontrados`
  };
  totalScore += checks.has_subtitles.score;

  // 7. Sin clichés (10 pts)
  const noCliches = statsEs.genericPhraseCount === 0;
  checks.no_cliches = {
    passed: noCliches,
    score: noCliches ? 10 : (statsEs.genericPhraseCount <= 2 ? 5 : 0),
    details: noCliches ? "Sin frases genéricas detectadas" : `${statsEs.genericPhraseCount} frases genéricas encontradas`
  };
  totalScore += checks.no_cliches.score;

  return {
    score: totalScore,
    checks,
    passed: totalScore >= 70
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, tone = "professional", language = "both", skipRefinement = false } = await req.json();
    
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt es requerido");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY no configurada");
    }

    console.log("[GENERATE_BLOG] Iniciando generación:", { prompt, tone, language, skipRefinement });

    // ========== PASADA 1: Generación inicial ==========
    const systemPrompt = `Eres un redactor experto especializado en contenido legal, fiscal y corporativo para el despacho Navarro.

Genera artículos profesionales, informativos y optimizados para SEO sobre temas legales, fiscales, mercantiles y laborales.

Tono: ${tone === "technical" ? "Técnico y preciso con terminología especializada" : tone === "divulgative" ? "Divulgativo y accesible para público general" : "Profesional, claro y accesible para empresarios"}

Estructura del artículo:
- Título atractivo y claro (50-70 caracteres)
- Introducción que enganche (2-3 párrafos)
- Desarrollo con subtítulos bien estructurados (mínimo 3-4 secciones H2)
- Usa HTML semántico: <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em>
- Incluye al menos un ejemplo práctico o caso real
- Incluye listas cuando sea apropiado para mejorar la legibilidad
- Conclusión práctica con llamada a acción clara (contactar, consultar, etc.)
- Longitud: 800-1500 palabras

IMPORTANTE:
- Evita frases genéricas como "cabe destacar", "es importante mencionar", "en el ámbito de"
- Usa voz activa en lugar de pasiva
- Cada párrafo debe aportar valor concreto
- Incluye datos específicos o ejemplos reales cuando sea posible

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
    console.log("[GENERATE_BLOG] Pasada 1 completada");

    if (!data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
      throw new Error("Formato de respuesta inesperado de Lovable AI");
    }

    let articleData = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);

    // ========== PASADA 2: Refinamiento iterativo ==========
    if (!skipRefinement) {
      console.log("[GENERATE_BLOG] Iniciando pasada 2: Refinamiento...");

      // Analizar contenido inicial
      const initialAnalysis = analyzeContent(articleData.content_es);
      console.log("[GENERATE_BLOG] Análisis inicial:", initialAnalysis);

      // Solo refinar si hay problemas detectados
      const needsRefinement = 
        initialAnalysis.genericPhraseCount > 0 ||
        !initialAnalysis.hasExample ||
        !initialAnalysis.hasCTA ||
        initialAnalysis.avgWordsPerParagraph > 120;

      if (needsRefinement) {
        const refinementPrompt = `Eres un editor profesional. Mejora el siguiente artículo de blog siguiendo estas instrucciones específicas:

1. ELIMINA estas frases genéricas si las encuentras: ${GENERIC_PHRASES.slice(0, 10).join(", ")}
2. ${!initialAnalysis.hasExample ? "AÑADE al menos un ejemplo práctico o caso real concreto" : "Mantén los ejemplos existentes"}
3. ${!initialAnalysis.hasCTA ? "AÑADE una llamada a acción clara al final (ej: 'Contacta con nosotros para...', 'Solicita una consulta...')" : "Mantén la llamada a acción"}
4. ${initialAnalysis.avgWordsPerParagraph > 120 ? "DIVIDE los párrafos largos en secciones más cortas (máximo 80-100 palabras por párrafo)" : "Mantén la estructura de párrafos"}
5. Mantén la estructura HTML exacta (<h2>, <h3>, <p>, <ul>, etc.)
6. NO cambies el tema ni la información principal
7. Mejora las transiciones entre secciones si es necesario
8. Usa voz activa en lugar de pasiva cuando sea posible

CONTENIDO ESPAÑOL A MEJORAR:
${articleData.content_es}

${articleData.content_en ? `CONTENIDO INGLÉS A MEJORAR:
${articleData.content_en}` : ''}

Responde SOLO con el contenido mejorado en el mismo formato HTML.`;

        try {
          const refinementResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-5-nano",
              messages: [
                { role: "user", content: refinementPrompt }
              ],
              tools: [
                {
                  type: "function",
                  function: {
                    name: "refined_content",
                    description: "Contenido refinado del artículo",
                    parameters: {
                      type: "object",
                      properties: {
                        content_es: { 
                          type: "string", 
                          description: "Contenido HTML refinado en español" 
                        },
                        content_en: { 
                          type: "string", 
                          description: "Contenido HTML refinado en inglés (si aplica)" 
                        }
                      },
                      required: ["content_es"]
                    }
                  }
                }
              ],
              tool_choice: { type: "function", function: { name: "refined_content" } }
            }),
          });

          if (refinementResponse.ok) {
            const refinedData = await refinementResponse.json();
            
            if (refinedData.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
              const refinedContent = JSON.parse(refinedData.choices[0].message.tool_calls[0].function.arguments);
              
              // Actualizar contenido con la versión refinada
              if (refinedContent.content_es) {
                articleData.content_es = refinedContent.content_es;
                console.log("[GENERATE_BLOG] Contenido ES refinado");
              }
              if (refinedContent.content_en && articleData.content_en) {
                articleData.content_en = refinedContent.content_en;
                console.log("[GENERATE_BLOG] Contenido EN refinado");
              }
            }
          } else {
            console.warn("[GENERATE_BLOG] Refinamiento falló, usando contenido original");
          }
        } catch (refineError) {
          console.error("[GENERATE_BLOG] Error en refinamiento:", refineError);
          // Continuar con el contenido original si falla el refinamiento
        }
      } else {
        console.log("[GENERATE_BLOG] Contenido inicial es de buena calidad, saltando refinamiento");
      }
    }

    // ========== VALIDACIÓN DE CONTENIDO ==========
    const validation = validateContent(articleData.content_es, articleData.content_en);
    console.log("[GENERATE_BLOG] Validación:", { score: validation.score, passed: validation.passed });
    
    // Calcular tiempo de lectura
    const wordCount = articleData.content_es.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    
    // ========== GENERAR IMAGEN DESTACADA ==========
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
      featured_image_url,
      // Añadir datos de validación
      quality_score: validation.score,
      quality_checks: validation.checks,
      passed_validation: validation.passed,
    };

    console.log("[GENERATE_BLOG] Artículo generado exitosamente:", {
      category: result.category,
      tags: result.tags,
      readTime: result.read_time,
      hasImage: !!featured_image_url,
      qualityScore: result.quality_score,
      passedValidation: result.passed_validation
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
