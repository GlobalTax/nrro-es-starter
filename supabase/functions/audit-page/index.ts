import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// ========== AI Helper: Claude + Gateway fallback with tool_use ==========
async function callClaudeWithFallback(systemPrompt: string, userPrompt: string, tools: any[], toolChoice: any): Promise<any> {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  if (ANTHROPIC_API_KEY) {
    try {
      console.log("[AI] Calling Claude for SEO audit...");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
          tools,
          tool_choice: toolChoice,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (resp.ok) {
        const data = await resp.json();
        const toolBlock = data.content?.find((b: any) => b.type === "tool_use");
        if (toolBlock?.input) {
          console.log("[AI] ✅ Claude tool_use OK");
          return toolBlock.input;
        }
      } else {
        console.warn(`[AI] Claude ${resp.status}, falling back...`);
      }
    } catch (err) {
      console.warn(`[AI] Claude failed: ${err instanceof Error ? err.message : 'unknown'}, falling back...`);
    }
  }

  if (!LOVABLE_API_KEY) throw new Error("No AI keys configured");

  console.log("[AI] Using Lovable Gateway for SEO audit...");
  const gatewayTools = tools.map((t: any) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }));

  const controller2 = new AbortController();
  const timeout2 = setTimeout(() => controller2.abort(), 30000);
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: gatewayTools,
      tool_choice: { type: "function", function: { name: toolChoice.name } },
    }),
    signal: controller2.signal,
  });
  clearTimeout(timeout2);

  if (!resp.ok) {
    if (resp.status === 429) throw Object.assign(new Error("Rate limit"), { status: 429 });
    if (resp.status === 402) throw Object.assign(new Error("Payment required"), { status: 402 });
    throw new Error(`Gateway error ${resp.status}`);
  }

  const data = await resp.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) {
    const parsed = typeof toolCall.function.arguments === 'string'
      ? JSON.parse(toolCall.function.arguments)
      : toolCall.function.arguments;
    console.log("[AI] ✅ Gateway tool_use OK");
    return parsed;
  }

  throw new Error("No tool_use response from AI");
}

// ========== Audit Result Tool Schema ==========
const auditResultTool = {
  name: "audit_result",
  description: "Return the complete SEO audit result with scores, issues, and recommendations for a web page.",
  input_schema: {
    type: "object",
    properties: {
      seo_score: { type: "number", description: "SEO score 0-100 (meta tags, headings, keywords, URLs)" },
      content_score: { type: "number", description: "Content quality score 0-100 (clarity, value, CTAs)" },
      structure_score: { type: "number", description: "Structure score 0-100 (hierarchy, accessibility, images, links)" },
      overall_score: { type: "number", description: "Weighted overall score 0-100" },
      issues: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["seo", "content", "structure"] },
            severity: { type: "string", enum: ["error", "warning", "info"] },
            message: { type: "string" },
            recommendation: { type: "string" },
          },
          required: ["type", "severity", "message", "recommendation"],
        },
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            priority: { type: "string", enum: ["high", "medium", "low"] },
            category: { type: "string" },
            action: { type: "string" },
          },
          required: ["priority", "category", "action"],
        },
      },
    },
    required: ["seo_score", "content_score", "structure_score", "overall_score", "issues", "recommendations"],
  },
};

interface AuditResult {
  seo_score: number;
  content_score: number;
  structure_score: number;
  overall_score: number;
  issues: Array<{ type: string; severity: string; message: string; recommendation: string }>;
  recommendations: Array<{ priority: string; category: string; action: string }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, sitePageId } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Starting audit for URL:', formattedUrl);

    // Step 1: Scrape page with Firecrawl
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown', 'html', 'links'],
        onlyMainContent: true,
        waitFor: 3000,
        timeout: 45000,
      }),
    });

    if (!firecrawlResponse.ok) {
      const errorData = await firecrawlResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Firecrawl error:', firecrawlResponse.status, errorData);

      if (errorData.code === 'SCRAPE_TIMEOUT' || firecrawlResponse.status === 408) {
        return new Response(
          JSON.stringify({ success: false, error: 'La página tardó demasiado en cargar.', code: 'TIMEOUT' }),
          { status: 408, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: `Failed to scrape page: ${errorData.error || errorData.message || 'Unknown error'}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlData = await firecrawlResponse.json();
    const pageContent = firecrawlData.data?.markdown || firecrawlData.markdown || '';
    const pageHtml = firecrawlData.data?.html || firecrawlData.html || '';
    const pageLinks = firecrawlData.data?.links || firecrawlData.links || [];
    const metadata = firecrawlData.data?.metadata || firecrawlData.metadata || {};

    const titleMatch = pageHtml.match(/<title[^>]*>([^<]*)<\/title>/i);
    const metaDescMatch = pageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const h1Matches = pageHtml.match(/<h1[^>]*>([^<]*)<\/h1>/gi) || [];
    const imgWithoutAlt = (pageHtml.match(/<img(?![^>]*alt=["'][^"']+["'])[^>]*>/gi) || []).length;
    const totalImages = (pageHtml.match(/<img[^>]*>/gi) || []).length;

    const seoData = {
      title: titleMatch ? titleMatch[1] : metadata.title || '',
      metaDescription: metaDescMatch ? metaDescMatch[1] : metadata.description || '',
      h1Count: h1Matches.length,
      h1Text: h1Matches.map((h: string) => h.replace(/<[^>]*>/g, '')),
      imagesWithoutAlt: imgWithoutAlt,
      totalImages,
      internalLinks: pageLinks.filter((l: string) => { try { return new URL(l).hostname === new URL(formattedUrl).hostname; } catch { return false; } }).length,
      externalLinks: pageLinks.filter((l: string) => { try { return !new URL(l).hostname.includes(new URL(formattedUrl).hostname); } catch { return false; } }).length,
      contentLength: pageContent.length,
      url: formattedUrl,
    };

    // Step 2: AI analysis with tool_use (structured output)
    const systemPrompt = 'Eres un experto auditor SEO y UX para sitios web de asesorías legales y fiscales en España. Analiza páginas web y evalúa su calidad SEO, contenido y estructura.';

    const userPrompt = `Analiza los siguientes datos de una página web y proporciona una evaluación detallada.

## Datos de la página:
- URL: ${seoData.url}
- Title: "${seoData.title}" (${seoData.title.length} caracteres)
- Meta Description: "${seoData.metaDescription}" (${seoData.metaDescription.length} caracteres)
- Número de H1: ${seoData.h1Count}
- Texto H1: ${JSON.stringify(seoData.h1Text)}
- Imágenes sin alt: ${seoData.imagesWithoutAlt} de ${seoData.totalImages}
- Links internos: ${seoData.internalLinks}
- Links externos: ${seoData.externalLinks}
- Longitud del contenido: ${seoData.contentLength} caracteres

## Contenido de la página (primeros 3000 caracteres):
${pageContent.substring(0, 3000)}

Evalúa la página en tres categorías (puntuación 0-100):
1. **SEO Score**: Meta tags, estructura de encabezados, keywords, URLs amigables
2. **Content Score**: Calidad, claridad, valor para el usuario, llamadas a la acción
3. **Structure Score**: Jerarquía visual, accesibilidad, imágenes, links internos

Identifica issues y proporciona recomendaciones priorizadas.`;

    let auditResult: AuditResult;
    try {
      auditResult = await callClaudeWithFallback(
        systemPrompt,
        userPrompt,
        [auditResultTool],
        { type: "tool", name: "audit_result" }
      );

      // Ensure overall_score is calculated if missing
      if (!auditResult.overall_score) {
        auditResult.overall_score = Math.round(
          (auditResult.seo_score + auditResult.content_score + auditResult.structure_score) / 3
        );
      }
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Heuristic fallback
      auditResult = {
        seo_score: seoData.title.length >= 30 && seoData.title.length <= 60 ? 70 : 50,
        content_score: seoData.contentLength > 1000 ? 70 : 50,
        structure_score: seoData.h1Count === 1 ? 70 : 50,
        overall_score: 60,
        issues: [{ type: 'seo', severity: 'warning', message: 'No se pudo completar el análisis IA', recommendation: 'Intenta auditar la página de nuevo' }],
        recommendations: [],
      };
    }

    // Step 3: Save to database
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { data: insertedAudit, error: insertError } = await supabase
      .from('page_audits')
      .insert({
        site_page_id: sitePageId || null,
        page_url: formattedUrl,
        seo_score: auditResult.seo_score,
        content_score: auditResult.content_score,
        structure_score: auditResult.structure_score,
        overall_score: auditResult.overall_score,
        issues: auditResult.issues,
        recommendations: auditResult.recommendations,
        raw_data: { seoData, metadata, linksCount: pageLinks.length },
      })
      .select()
      .single();

    if (insertError) console.error('Database insert error:', insertError);

    return new Response(
      JSON.stringify({
        success: true,
        audit: {
          id: insertedAudit?.id,
          ...auditResult,
          page_url: formattedUrl,
          audit_date: new Date().toISOString(),
          raw_data: { seoData, metadata, linksCount: pageLinks.length },
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Audit error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An error occurred during the audit. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
