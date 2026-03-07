import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

// ========== CLAUDE + FALLBACK (text only, no tool_call) ==========
async function callClaudeTextWithFallback(systemPrompt: string, userPrompt: string): Promise<string> {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  if (ANTHROPIC_API_KEY) {
    try {
      console.log("[AI] Calling Claude for audit analysis...");
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
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      }, 30000);

      if (resp.ok) {
        const data = await resp.json();
        const text = data.content?.find((b: { type: string }) => b.type === "text")?.text;
        if (text) {
          console.log("[AI] ✅ Claude OK for audit");
          return text;
        }
      } else {
        console.warn(`[AI] Claude ${resp.status}, falling back...`);
      }
    } catch (err) {
      console.warn(`[AI] Claude failed: ${err instanceof Error ? err.message : 'unknown'}, falling back...`);
    }
  }

  if (!LOVABLE_API_KEY) throw new Error("No AI keys configured");

  console.log("[AI] Using Lovable Gateway for audit...");
  const resp = await fetchWithTimeout("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    }),
  }, 30000);

  if (!resp.ok) {
    if (resp.status === 429) throw Object.assign(new Error("Rate limit"), { status: 429 });
    if (resp.status === 402) throw Object.assign(new Error("Payment required"), { status: 402 });
    throw new Error(`Gateway error ${resp.status}`);
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || '';
  console.log("[AI] ✅ Gateway OK for audit");
  return content;
}

interface AuditResult {
  seo_score: number;
  content_score: number;
  structure_score: number;
  overall_score: number;
  issues: Array<{
    type: 'seo' | 'content' | 'structure';
    severity: 'error' | 'warning' | 'info';
    message: string;
    recommendation: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    action: string;
  }>;
}

serve(async (req) => {
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
      internalLinks: pageLinks.filter((l: string) => l.includes(new URL(formattedUrl).hostname)).length,
      externalLinks: pageLinks.filter((l: string) => !l.includes(new URL(formattedUrl).hostname)).length,
      contentLength: pageContent.length,
      url: formattedUrl,
    };

    // Step 2: AI analysis (Claude + fallback)
    const aiPrompt = `Eres un experto auditor SEO y UX para sitios web de asesorías legales y fiscales en España. 
Analiza los siguientes datos de una página web y proporciona una evaluación detallada.

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

## Instrucciones:
Evalúa la página en tres categorías (puntuación 0-100):
1. **SEO Score**: Meta tags, estructura de encabezados, keywords, URLs amigables
2. **Content Score**: Calidad, claridad, valor para el usuario, llamadas a la acción
3. **Structure Score**: Jerarquía visual, accesibilidad, imágenes, links internos

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido:
{
  "seo_score": number,
  "content_score": number,
  "structure_score": number,
  "overall_score": number,
  "issues": [{"type": "seo"|"content"|"structure", "severity": "error"|"warning"|"info", "message": "...", "recommendation": "..."}],
  "recommendations": [{"priority": "high"|"medium"|"low", "category": "...", "action": "..."}]
}`;

    let auditResult: AuditResult;
    try {
      const aiContent = await callClaudeTextWithFallback(
        'Eres un auditor SEO experto. Responde siempre en JSON válido sin explicaciones adicionales.',
        aiPrompt
      );

      let cleanedContent = aiContent.trim();
      if (cleanedContent.startsWith('```json')) cleanedContent = cleanedContent.slice(7);
      else if (cleanedContent.startsWith('```')) cleanedContent = cleanedContent.slice(3);
      if (cleanedContent.endsWith('```')) cleanedContent = cleanedContent.slice(0, -3);
      
      auditResult = JSON.parse(cleanedContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      auditResult = {
        seo_score: seoData.title.length >= 30 && seoData.title.length <= 60 ? 70 : 50,
        content_score: seoData.contentLength > 1000 ? 70 : 50,
        structure_score: seoData.h1Count === 1 ? 70 : 50,
        overall_score: 60,
        issues: [{ type: 'seo', severity: 'warning', message: 'No se pudo completar el análisis detallado', recommendation: 'Intenta auditar la página de nuevo' }],
        recommendations: []
      };
    }

    if (!auditResult.overall_score) {
      auditResult.overall_score = Math.round((auditResult.seo_score + auditResult.content_score + auditResult.structure_score) / 3);
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
