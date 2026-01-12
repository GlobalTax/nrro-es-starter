import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Starting audit for URL:', formattedUrl);

    // Step 1: Scrape page with Firecrawl
    console.log('Calling Firecrawl API...');
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
      
      // Handle specific timeout error
      if (errorData.code === 'SCRAPE_TIMEOUT' || firecrawlResponse.status === 408) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'La página tardó demasiado en cargar. Intenta de nuevo o con una página más ligera.',
            code: 'TIMEOUT'
          }),
          { status: 408, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: `Failed to scrape page: ${errorData.error || errorData.message || 'Unknown error'}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlData = await firecrawlResponse.json();
    console.log('Firecrawl scrape successful');

    const pageContent = firecrawlData.data?.markdown || firecrawlData.markdown || '';
    const pageHtml = firecrawlData.data?.html || firecrawlData.html || '';
    const pageLinks = firecrawlData.data?.links || firecrawlData.links || [];
    const metadata = firecrawlData.data?.metadata || firecrawlData.metadata || {};

    // Extract key SEO elements from HTML
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
      totalImages: totalImages,
      internalLinks: pageLinks.filter((l: string) => l.includes(new URL(formattedUrl).hostname)).length,
      externalLinks: pageLinks.filter((l: string) => !l.includes(new URL(formattedUrl).hostname)).length,
      contentLength: pageContent.length,
      url: formattedUrl,
    };

    // Step 2: Send to Lovable AI for analysis
    console.log('Calling Lovable AI for analysis...');
    
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

Identifica problemas específicos y proporciona recomendaciones accionables.

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "seo_score": number,
  "content_score": number,
  "structure_score": number,
  "overall_score": number,
  "issues": [
    {
      "type": "seo" | "content" | "structure",
      "severity": "error" | "warning" | "info",
      "message": "descripción del problema",
      "recommendation": "cómo solucionarlo"
    }
  ],
  "recommendations": [
    {
      "priority": "high" | "medium" | "low",
      "category": "categoría",
      "action": "acción a tomar"
    }
  ]
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-nano',
        messages: [
          { role: 'system', content: 'Eres un auditor SEO experto. Responde siempre en JSON válido sin explicaciones adicionales.' },
          { role: 'user', content: aiPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    console.log('AI response received, parsing...');

    // Parse AI response
    let auditResult: AuditResult;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedContent = aiContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();
      
      auditResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      // Provide fallback result based on basic checks
      auditResult = {
        seo_score: seoData.title.length >= 30 && seoData.title.length <= 60 ? 70 : 50,
        content_score: seoData.contentLength > 1000 ? 70 : 50,
        structure_score: seoData.h1Count === 1 ? 70 : 50,
        overall_score: 60,
        issues: [
          {
            type: 'seo',
            severity: 'warning',
            message: 'No se pudo completar el análisis detallado',
            recommendation: 'Intenta auditar la página de nuevo'
          }
        ],
        recommendations: []
      };
    }

    // Calculate overall score if not provided
    if (!auditResult.overall_score) {
      auditResult.overall_score = Math.round(
        (auditResult.seo_score + auditResult.content_score + auditResult.structure_score) / 3
      );
    }

    // Step 3: Save to database
    console.log('Saving audit result to database...');
    
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
        raw_data: {
          seoData,
          metadata,
          linksCount: pageLinks.length,
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      // Still return the audit result even if save fails
    }

    console.log('Audit completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        audit: {
          id: insertedAudit?.id,
          ...auditResult,
          page_url: formattedUrl,
          audit_date: new Date().toISOString(),
          raw_data: {
            seoData,
            metadata,
            linksCount: pageLinks.length,
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Audit error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
