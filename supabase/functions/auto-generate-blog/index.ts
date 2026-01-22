import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Temas predefinidos por categoría para generación automática
const TOPIC_TEMPLATES = {
  Fiscal: [
    "Novedades fiscales {year}: cambios que afectan a empresas y autónomos",
    "Cómo optimizar la tributación de dividendos en sociedades familiares",
    "Deducciones fiscales poco conocidas para PYMEs en España",
    "Planificación fiscal para la sucesión empresarial",
    "Implicaciones del IVA en operaciones internacionales",
    "Régimen fiscal de las operaciones de reestructuración empresarial",
    "Incentivos fiscales para I+D+i: guía práctica",
    "Fiscalidad de las retribuciones a administradores",
    "Cómo preparar una inspección fiscal: guía completa",
    "Aplazamiento y fraccionamiento de deudas tributarias",
  ],
  Mercantil: [
    "Pactos de socios: cláusulas esenciales para proteger tu inversión",
    "Gobierno corporativo en la empresa familiar: buenas prácticas",
    "Cómo estructurar una operación de M&A paso a paso",
    "Due diligence legal: qué revisar antes de comprar una empresa",
    "Responsabilidad de administradores: límites y protección",
    "Protocolo familiar: herramienta clave para la continuidad",
    "Conflictos entre socios: prevención y resolución",
    "Operaciones acordeón: reducción y ampliación de capital",
    "Transformación de sociedad limitada a anónima: cuándo y cómo",
    "Joint ventures: estructura legal y fiscal óptima",
  ],
  Laboral: [
    "Teletrabajo: obligaciones legales del empleador en {year}",
    "Despido objetivo por causas económicas: requisitos actualizados",
    "Retribución flexible: ventajas fiscales y laborales",
    "Planes de igualdad: obligaciones según el tamaño de empresa",
    "Contratación de directivos: aspectos laborales y mercantiles",
    "Subrogación empresarial: derechos de los trabajadores",
    "ERTEs vs EREs: diferencias y cuándo aplicar cada uno",
    "Bonificaciones a la contratación vigentes",
    "Registro de jornada: novedades normativas",
    "Expatriación de trabajadores: marco legal y fiscal",
  ],
  Corporativo: [
    "Compliance penal: programa efectivo para PYMEs",
    "Protección de datos en la empresa: obligaciones RGPD",
    "Contratos con proveedores: cláusulas de protección esenciales",
    "Propiedad intelectual: proteger los activos intangibles",
    "Resolución alternativa de conflictos: mediación y arbitraje",
    "Ciberseguridad legal: obligaciones y responsabilidades",
    "Contratos internacionales: ley aplicable y jurisdicción",
    "Franquicias: marco legal y aspectos a negociar",
    "Licencias de software y tecnología: aspectos legales",
    "ESG y sostenibilidad: nuevas obligaciones de reporting",
  ],
};

// Función para obtener eventos del calendario editorial próximos
async function getUpcomingCalendarEvent(supabase: any): Promise<{
  topic: string;
  category: string;
  eventName: string;
} | null> {
  try {
    const today = new Date();
    const futureDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 días
    const currentYear = today.getFullYear();

    const { data: events, error } = await supabase
      .from("editorial_calendar_events")
      .select("*")
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (error || !events || events.length === 0) {
      return null;
    }

    // Procesar eventos y encontrar el más próximo
    for (const event of events) {
      let eventDate = new Date(event.event_date);
      
      // Para eventos anuales, ajustar al año actual
      if (event.recurrence === "yearly") {
        eventDate.setFullYear(currentYear);
        if (eventDate < today) {
          eventDate.setFullYear(currentYear + 1);
        }
      }

      // Calcular fecha de publicación sugerida
      const publishDate = new Date(eventDate.getTime() - (event.days_before_publish || 7) * 24 * 60 * 60 * 1000);

      // Si la fecha de publicación está dentro de los próximos 14 días
      if (publishDate >= today && publishDate <= futureDate) {
        // Verificar que no hayamos publicado ya sobre este tema recientemente
        const { data: existingPosts } = await supabase
          .from("blog_posts")
          .select("id")
          .ilike("title_es", `%${event.event_name.split(" ").slice(0, 2).join(" ")}%`)
          .gte("created_at", new Date(currentYear, 0, 1).toISOString())
          .limit(1);

        if (!existingPosts || existingPosts.length === 0) {
          const suggestedTopic = event.suggested_topic_template
            ?.replace("{year}", eventDate.getFullYear().toString())
            ?.replace("{year+1}", (eventDate.getFullYear() + 1).toString())
            ?.replace("{model}", "111/115") || event.event_name;

          console.log(`[auto-generate-blog] Found calendar event: ${event.event_name}`);

          return {
            topic: suggestedTopic,
            category: event.suggested_category || "Fiscal",
            eventName: event.event_name,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("[auto-generate-blog] Error checking calendar:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    let count = 2;
    let forceTopic: string | null = null;
    let forceCategory: string | null = null;
    let useCalendar = true;

    try {
      const body = await req.json();
      count = body.count || 2;
      forceTopic = body.topic || null;
      forceCategory = body.category || null;
      useCalendar = body.useCalendar !== false;
    } catch {
      // Use defaults if no body
    }

    console.log(`[auto-generate-blog] Starting generation of ${count} articles`);

    // Check if automation is enabled
    const { data: settings } = await supabase
      .from("blog_automation_settings")
      .select("*")
      .single();

    if (settings && !settings.is_enabled) {
      console.log("[auto-generate-blog] Automation is disabled");
      return new Response(
        JSON.stringify({ success: false, message: "Automation is disabled" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get category distribution to balance content
    const { data: categoryStats } = await supabase
      .from("blog_posts")
      .select("category")
      .eq("status", "published");

    const categoryCounts: Record<string, number> = {
      Fiscal: 0,
      Mercantil: 0,
      Laboral: 0,
      Corporativo: 0,
    };

    categoryStats?.forEach((post: { category: string }) => {
      if (post.category && categoryCounts[post.category] !== undefined) {
        categoryCounts[post.category]++;
      }
    });

    console.log("[auto-generate-blog] Category distribution:", categoryCounts);

    // Sort categories by count (ascending) to prioritize underrepresented ones
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => a[1] - b[1])
      .map(([cat]) => cat);

    const generatedArticles: any[] = [];
    const errors: any[] = [];
    const currentYear = new Date().getFullYear();

    // Check for upcoming calendar events first
    let calendarEvent: { topic: string; category: string; eventName: string } | null = null;
    if (useCalendar && !forceTopic) {
      calendarEvent = await getUpcomingCalendarEvent(supabase);
    }

    for (let i = 0; i < count; i++) {
      try {
        // Check queue for pending topics first
        const { data: queueItem } = await supabase
          .from("blog_generation_queue")
          .select("*")
          .eq("status", "pending")
          .lte("scheduled_for", new Date().toISOString())
          .order("scheduled_for", { ascending: true })
          .limit(1)
          .single();

        let topic: string;
        let category: string;
        let tone: string;
        let language: string;
        let queueId: string | null = null;
        let isCalendarTopic = false;

        if (queueItem) {
          // Use topic from queue
          topic = queueItem.topic;
          category = queueItem.category;
          tone = queueItem.tone;
          language = queueItem.language;
          queueId = queueItem.id;

          // Mark as generating
          await supabase
            .from("blog_generation_queue")
            .update({ status: "generating" })
            .eq("id", queueId);

          console.log(`[auto-generate-blog] Using queued topic: ${topic}`);
        } else if (calendarEvent && i === 0) {
          // Use calendar event topic for first article
          topic = calendarEvent.topic;
          category = calendarEvent.category;
          tone = settings?.default_tone || "professional";
          language = settings?.default_language || "both";
          isCalendarTopic = true;
          
          console.log(`[auto-generate-blog] Using calendar topic: ${topic} (${calendarEvent.eventName})`);
          
          // Clear calendar event so subsequent articles use regular topics
          calendarEvent = null;
        } else {
          // Auto-generate topic
          category = forceCategory || sortedCategories[i % sortedCategories.length];
          const templates = TOPIC_TEMPLATES[category as keyof typeof TOPIC_TEMPLATES];
          const randomIndex = Math.floor(Math.random() * templates.length);
          topic = forceTopic || templates[randomIndex].replace("{year}", currentYear.toString());
          tone = settings?.default_tone || "professional";
          language = settings?.default_language || "both";

          console.log(`[auto-generate-blog] Auto-generated topic: ${topic} (${category})`);
        }

        // Call the existing generate-blog-article function
        const { data: articleData, error: genError } = await supabase.functions.invoke(
          "generate-blog-article",
          {
            body: { prompt: topic, tone, language },
          }
        );

        if (genError) {
          throw new Error(`Generation failed: ${genError.message}`);
        }

        if (!articleData) {
          throw new Error("No article data returned");
        }

        console.log(`[auto-generate-blog] Article generated: ${articleData.title_es}`);

        // Create slug from title
        const slugEs = articleData.title_es
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const slugEn = articleData.title_en
          ? articleData.title_en
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : slugEs;

        // Determine status based on quality validation
        let postStatus = settings?.auto_publish ? "published" : "draft";
        
        // If auto_publish is enabled but validation failed, keep as draft for review
        if (settings?.auto_publish && articleData.passed_validation === false) {
          postStatus = "draft";
          console.log(`[auto-generate-blog] Article quality score (${articleData.quality_score}) below threshold, keeping as draft`);
        }

        // Insert into blog_posts with quality data
        const { data: newPost, error: insertError } = await supabase
          .from("blog_posts")
          .insert({
            title_es: articleData.title_es,
            title_en: articleData.title_en,
            slug_es: `${slugEs}-${Date.now()}`,
            slug_en: `${slugEn}-${Date.now()}`,
            excerpt_es: articleData.excerpt_es,
            excerpt_en: articleData.excerpt_en,
            content_es: articleData.content_es,
            content_en: articleData.content_en,
            category: articleData.category || category,
            tags: articleData.tags || [],
            featured_image: articleData.featured_image_url,
            read_time: articleData.read_time || 5,
            status: postStatus,
            published_at: postStatus === "published" ? new Date().toISOString() : null,
            author_id: "system",
            author_name: "Navarro Asesores",
            seo_title_es: articleData.seo_title_es,
            seo_title_en: articleData.seo_title_en,
            seo_description_es: articleData.seo_description_es,
            seo_description_en: articleData.seo_description_en,
            source_site: "navarro",
            // New quality columns
            quality_score: articleData.quality_score || 0,
            quality_checks: articleData.quality_checks || {},
            passed_validation: articleData.passed_validation || false,
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(`Insert failed: ${insertError.message}`);
        }

        console.log(`[auto-generate-blog] Post created with ID: ${newPost.id}, Quality: ${articleData.quality_score}`);

        // Update queue item if exists
        if (queueId) {
          await supabase
            .from("blog_generation_queue")
            .update({
              status: "completed",
              generated_post_id: newPost.id,
            })
            .eq("id", queueId);
        }

        generatedArticles.push({
          id: newPost.id,
          title: articleData.title_es,
          category,
          status: postStatus,
          quality_score: articleData.quality_score,
          passed_validation: articleData.passed_validation,
          is_calendar_topic: isCalendarTopic,
        });

        // Rotate to next category
        sortedCategories.push(sortedCategories.shift()!);
      } catch (error) {
        console.error(`[auto-generate-blog] Error generating article ${i + 1}:`, error);
        errors.push({
          index: i,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Update automation settings
    await supabase
      .from("blog_automation_settings")
      .update({
        last_run_at: new Date().toISOString(),
        next_run_at: new Date(
          Date.now() + (settings?.run_interval_days || 2) * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .eq("id", settings?.id);

    // Send email notification if articles were generated
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey && generatedArticles.length > 0) {
      try {
        const articlesList = generatedArticles
          .map((a) => {
            const qualityBadge = a.passed_validation 
              ? `<span style="color: #10b981;">✓ ${a.quality_score}pts</span>` 
              : `<span style="color: #f59e0b;">⚠ ${a.quality_score}pts</span>`;
            const calendarBadge = a.is_calendar_topic 
              ? ` <span style="background: #dbeafe; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; font-size: 11px;">📅 Tema oportuno</span>` 
              : '';
            return `<li style="margin-bottom: 8px;">
              <strong>${a.title}</strong> 
              <span style="color: #666;">(${a.category})</span>
              ${qualityBadge}${calendarBadge}
            </li>`;
          })
          .join("");

        const needsReview = generatedArticles.filter(a => !a.passed_validation).length;
        const reviewNote = needsReview > 0 
          ? `<p style="color: #f59e0b; margin-bottom: 16px;">⚠️ ${needsReview} artículo(s) requieren revisión adicional (score < 70)</p>`
          : '';

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Navarro Blog <onboarding@resend.dev>",
            to: ["s.navarro@nrro.es"],
            subject: `📝 ${generatedArticles.length} nuevos artículos generados`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0f172a; margin-bottom: 16px;">Nuevos artículos generados</h2>
                <p style="color: #374151; margin-bottom: 16px;">Se han generado <strong>${generatedArticles.length} artículos</strong>:</p>
                ${reviewNote}
                <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; background: #f9fafb; padding: 16px; border-radius: 8px;">
                  ${articlesList}
                </ul>
                <a href="https://navarro.lovable.app/admin/blog" 
                   style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Revisar artículos
                </a>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                <p style="color: #9ca3af; font-size: 12px;">
                  Este email fue enviado automáticamente. Los artículos con score < 70 puntos necesitan revisión antes de publicar.
                </p>
              </div>
            `,
          }),
        });

        if (emailResponse.ok) {
          console.log("[auto-generate-blog] Notification email sent");
        } else {
          const errorData = await emailResponse.text();
          console.error("[auto-generate-blog] Failed to send email:", errorData);
        }
      } catch (emailError) {
        console.error("[auto-generate-blog] Email error:", emailError);
      }
    }

    const result = {
      success: true,
      generated: generatedArticles.length,
      articles: generatedArticles,
      errors: errors.length > 0 ? errors : undefined,
      emailSent: resendApiKey && generatedArticles.length > 0,
      next_run: new Date(
        Date.now() + (settings?.run_interval_days || 2) * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    console.log("[auto-generate-blog] Completed:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[auto-generate-blog] Fatal error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
