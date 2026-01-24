import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-trigger-type",
};

const NEWS_SOURCES = {
  BOE: "Boletín Oficial del Estado",
  AEAT: "Agencia Tributaria", 
  CGPJ: "Consejo General del Poder Judicial",
  EUROPEAN: "Normativa Europea",
  MARKET: "Actualidad Empresarial",
};

const NEWS_CATEGORIES = ["Fiscal", "Mercantil", "Laboral", "Internacional", "M&A"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const triggerType = req.headers.get("x-trigger-type") || "cron";
  
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  let runRecordId: string | null = null;
  let articlesToGenerate = 0;
  let settingsSnapshot: Record<string, unknown> | null = null;

  try {
    console.log("Starting auto-generate-news function");

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get automation settings
    const { data: settings, error: settingsError } = await supabase
      .from("news_automation_settings")
      .select("*")
      .single();

    if (settingsError) {
      console.error("Error fetching settings:", settingsError);
      throw new Error("Could not fetch automation settings");
    }

    // Prepare settings snapshot for logging
    settingsSnapshot = {
      is_enabled: settings.is_enabled,
      articles_per_run: settings.articles_per_run,
      auto_publish: settings.auto_publish,
      default_sources: settings.default_sources,
      default_categories: settings.default_categories,
    };
    
    articlesToGenerate = settings.articles_per_run || 3;

    // Create initial run record
    const { data: runRecord, error: runError } = await supabase
      .from("news_automation_runs")
      .insert({
        status: settings.is_enabled ? "running" : "skipped",
        articles_requested: articlesToGenerate,
        trigger_type: triggerType,
        settings_snapshot: settingsSnapshot,
        ...(settings.is_enabled ? {} : {
          completed_at: new Date().toISOString(),
          error_message: "Automatización deshabilitada",
          execution_time_ms: Date.now() - startTime,
        }),
      })
      .select("id")
      .single();

    if (runError) {
      console.error("Error creating run record:", runError);
    } else {
      runRecordId = runRecord.id;
    }

    if (!settings.is_enabled) {
      console.log("News automation is disabled");
      return new Response(
        JSON.stringify({ message: "News automation is disabled" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sources = settings.default_sources || ["BOE", "AEAT"];
    const categories = settings.default_categories || ["Fiscal", "Mercantil"];

    console.log(`Generating ${articlesToGenerate} news articles from sources: ${sources.join(", ")}`);

const systemPrompt = `Eres un redactor experto en noticias legales y fiscales para España. Tu trabajo es generar noticias breves y relevantes para empresas.

REGLAS ESTRICTAS:
1. Cada noticia debe tener MÁXIMO 150 caracteres en el excerpt
2. El título debe ser conciso y directo (máximo 80 caracteres)
3. El contenido debe tener 2-3 párrafos explicando la noticia en detalle
4. Formato tweet-style para excerpt: directo al grano, sin adornos
5. Basado en actualidad legal REAL y reciente de España (BOE, AEAT, jurisprudencia)
6. Tono profesional e informativo
7. Incluir impacto práctico para empresas

FUENTES A USAR: ${sources.map((s: string) => NEWS_SOURCES[s as keyof typeof NEWS_SOURCES] || s).join(", ")}
CATEGORÍAS: ${categories.join(", ")}

FORMATO DE RESPUESTA (JSON array):
[
  {
    "title_es": "Título breve y directo",
    "excerpt_es": "Extracto de máximo 150 caracteres con el dato clave de la noticia.",
    "content_es": "Contenido expandido de 2-3 párrafos explicando la noticia en detalle, su contexto y las implicaciones prácticas para empresas.",
    "category": "Fiscal",
    "source_name": "AEAT"
  }
]

Genera exactamente ${articlesToGenerate} noticias diferentes, cada una de una categoría distinta si es posible.
Responde SOLO con el JSON, sin explicaciones adicionales.`;

    const userPrompt = `Genera ${articlesToGenerate} noticias legales/fiscales actuales para hoy, ${new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

Las noticias deben ser relevantes para:
- Empresas familiares
- Directivos y CFOs
- Asesores fiscales y legales
- Empresas con operaciones internacionales

Recuerda: máximo 150 caracteres por excerpt, basado en actualidad real española.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      const errorMessage = aiResponse.status === 429 
        ? "Rate limit exceeded. Please try again later."
        : aiResponse.status === 402
        ? "Payment required. Please add funds to your workspace."
        : `AI Gateway error: ${aiResponse.status}`;
      
      throw new Error(errorMessage);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    console.log("AI Response:", content);

    // Parse the JSON response
    let newsItems;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      newsItems = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse news items from AI response");
    }

    if (!Array.isArray(newsItems) || newsItems.length === 0) {
      throw new Error("Invalid news items format");
    }

    console.log(`Parsed ${newsItems.length} news items`);

    // Insert news articles
    const insertedNews = [];
    for (const item of newsItems) {
      const slug = item.title_es
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 50);

      const newsData = {
        title_es: item.title_es,
        excerpt_es: item.excerpt_es?.slice(0, 150) || item.excerpt_es,
        content_es: item.content_es || item.excerpt_es, // Fallback to excerpt if no content
        category: item.category || "Fiscal",
        source_name: item.source_name || "BOE",
        source_site: "es", // Required field for filtering in frontend
        slug_es: `${slug}-${Date.now()}`,
        is_published: settings.auto_publish,
        published_at: settings.auto_publish ? new Date().toISOString() : null,
        generated_with_ai: true,
      };

      const { data: inserted, error: insertError } = await supabase
        .from("news_articles")
        .insert(newsData)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting news:", insertError);
      } else {
        insertedNews.push(inserted);
        console.log(`Inserted news: ${inserted.title_es}`);
      }
    }

    // Update last_run_at
    const { error: updateError } = await supabase
      .from("news_automation_settings")
      .update({
        last_run_at: new Date().toISOString(),
        next_run_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", settings.id);

    if (updateError) {
      console.error("Error updating settings:", updateError);
    }

    // Update run record with success
    if (runRecordId) {
      await supabase
        .from("news_automation_runs")
        .update({
          status: "success",
          completed_at: new Date().toISOString(),
          articles_generated: insertedNews.length,
          execution_time_ms: Date.now() - startTime,
        })
        .eq("id", runRecordId);
    }

    console.log(`Successfully generated ${insertedNews.length} news articles`);

    return new Response(
      JSON.stringify({
        success: true,
        generated: insertedNews.length,
        articles: insertedNews,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in auto-generate-news:", error);
    
    // Update run record with error
    if (runRecordId) {
      await supabase
        .from("news_automation_runs")
        .update({
          status: "error",
          completed_at: new Date().toISOString(),
          articles_generated: 0,
          error_message: error instanceof Error ? error.message : "Unknown error",
          error_details: { stack: error instanceof Error ? error.stack : null },
          execution_time_ms: Date.now() - startTime,
        })
        .eq("id", runRecordId);
    } else if (settingsSnapshot) {
      // Create error record if we couldn't create one earlier
      await supabase
        .from("news_automation_runs")
        .insert({
          status: "error",
          completed_at: new Date().toISOString(),
          articles_requested: articlesToGenerate,
          articles_generated: 0,
          trigger_type: triggerType,
          settings_snapshot: settingsSnapshot,
          error_message: error instanceof Error ? error.message : "Unknown error",
          error_details: { stack: error instanceof Error ? error.stack : null },
          execution_time_ms: Date.now() - startTime,
        });
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
