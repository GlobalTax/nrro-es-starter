const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ========== AI Helper: Claude + Lovable Gateway fallback (tool_use) ==========
async function callClaudeWithFallback(systemPrompt: string, userPrompt: string, tools: any[], toolChoice: any): Promise<any> {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  // Try Anthropic first
  if (ANTHROPIC_API_KEY) {
    try {
      console.log("[AI] Calling Claude for marketing audit qualitative analysis...");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
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

  // Fallback: Lovable Gateway (OpenAI-compatible tool calling)
  if (!LOVABLE_API_KEY) throw new Error("No AI keys configured");

  console.log("[AI] Using Lovable Gateway for marketing audit...");
  const gatewayTools = tools.map((t: any) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }));

  const controller2 = new AbortController();
  const timeout2 = setTimeout(() => controller2.abort(), 45000);
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

// ========== AI Analysis Tool Schema ==========
const qualitativeAnalysisTool = {
  name: "qualitative_analysis",
  description: "Evaluate qualitative aspects of a website that cannot be detected by regex or automated checks. Assess content quality, readability, CTAs, value proposition, trust signals, navigation, and other subjective criteria.",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Item ID from the checklist" },
            status: { type: "string", enum: ["correct", "improvable", "missing"] },
            note: { type: "string", description: "Brief explanation of the evaluation" },
          },
          required: ["id", "status", "note"],
        },
        description: "Array of evaluated checklist items",
      },
    },
    required: ["items"],
  },
};

// Items that need qualitative AI evaluation (not autoDetectable by regex)
const QUALITATIVE_ITEMS = [
  { id: "content-quality", catId: "content", desc: "Calidad general del contenido: ¿es profesional, claro, sin errores?" },
  { id: "readability", catId: "content", desc: "Legibilidad: ¿párrafos cortos, lenguaje claro, buena estructura?" },
  { id: "value-proposition", catId: "content", desc: "Propuesta de valor: ¿queda claro qué ofrece la empresa y por qué elegirla?" },
  { id: "blog-frequency", catId: "content", desc: "Frecuencia del blog: ¿hay un blog con contenido reciente?" },
  { id: "evergreen", catId: "content", desc: "Contenido evergreen: ¿hay contenido atemporal de valor?" },
  { id: "cta-buttons", catId: "ux-cro", desc: "CTAs: ¿hay llamadas a la acción claras y visibles?" },
  { id: "navigation", catId: "ux-cro", desc: "Navegación: ¿es clara, intuitiva, con menú bien estructurado?" },
  { id: "trust-signals", catId: "ux-cro", desc: "Señales de confianza: ¿hay logos de clientes, certificaciones, premios, testimonios?" },
  { id: "custom-404", catId: "seo-technical", desc: "Página 404 personalizada: ¿se menciona o hay indicios de una?" },
  { id: "page-speed-hints", catId: "seo-technical", desc: "Indicios de optimización de velocidad: ¿código limpio, scripts mínimos, no excesivos?" },
  { id: "google-business", catId: "offpage", desc: "Google Business Profile: ¿hay indicios de ficha de Google My Business (mapa embebido, enlace)?" },
  { id: "backlink-signals", catId: "offpage", desc: "Señales de backlinks: ¿se mencionan medios, premios, colaboraciones que sugieran backlinks?" },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Marketing Audit - Scraping URL:', formattedUrl);

    // Scrape the main page
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['html', 'links', 'markdown'],
        onlyMainContent: false,
        waitFor: 3000,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error('Firecrawl scrape error:', scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: scrapeData.error || 'Failed to scrape page' }),
        { status: scrapeResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to fetch robots.txt
    let robotsTxt = null;
    try {
      const baseUrl = new URL(formattedUrl);
      const robotsRes = await fetch(`${baseUrl.origin}/robots.txt`, { signal: AbortSignal.timeout(5000) });
      if (robotsRes.ok) {
        robotsTxt = await robotsRes.text();
      }
    } catch { /* ignore */ }

    // Try to fetch sitemap.xml
    let sitemapXml = null;
    try {
      const baseUrl = new URL(formattedUrl);
      const sitemapRes = await fetch(`${baseUrl.origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      if (sitemapRes.ok) {
        const text = await sitemapRes.text();
        if (text.includes('<urlset') || text.includes('<sitemapindex')) {
          sitemapXml = text.substring(0, 5000);
        }
      }
    } catch { /* ignore */ }

    const scrapedHtml = scrapeData.data?.html || scrapeData.html || '';
    const scrapedMarkdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    const scrapedLinks = scrapeData.data?.links || scrapeData.links || [];

    // ========== AI Qualitative Analysis ==========
    let aiAnalysis: { items: Array<{ id: string; status: string; note: string }> } | null = null;

    try {
      const systemPrompt = `Eres un auditor de marketing digital y SEO experto, especializado en sitios web de empresas de servicios profesionales (despachos legales, asesorías fiscales, consultoras). 
Evalúa el contenido de una página web en criterios cualitativos que no pueden detectarse con regex. 
Sé preciso y conciso en tus evaluaciones. Usa "correct" si el criterio se cumple bien, "improvable" si existe pero es mejorable, "missing" si no existe o es muy deficiente.`;

      const itemDescriptions = QUALITATIVE_ITEMS.map(i => `- ${i.id}: ${i.desc}`).join('\n');

      const userPrompt = `Analiza el siguiente sitio web y evalúa cada uno de estos criterios cualitativos:

${itemDescriptions}

## URL analizada: ${formattedUrl}

## Contenido de la página (markdown, primeros 4000 caracteres):
${scrapedMarkdown.substring(0, 4000)}

## HTML parcial (primeros 3000 caracteres):
${scrapedHtml.substring(0, 3000)}

## Enlaces encontrados (primeros 50):
${scrapedLinks.slice(0, 50).join('\n')}

Evalúa cada item con su id, status (correct/improvable/missing) y una nota breve explicativa.`;

      aiAnalysis = await callClaudeWithFallback(
        systemPrompt,
        userPrompt,
        [qualitativeAnalysisTool],
        { type: "tool", name: "qualitative_analysis" }
      );

      console.log('Marketing Audit - AI analysis completed:', aiAnalysis?.items?.length, 'items evaluated');
    } catch (aiError) {
      console.warn('Marketing Audit - AI analysis failed (continuing without it):', aiError instanceof Error ? aiError.message : 'unknown');
      // Continue without AI analysis — regex-only results will be used
    }

    const result = {
      success: true,
      data: {
        html: scrapedHtml,
        markdown: scrapedMarkdown,
        links: scrapedLinks,
        metadata: scrapeData.data?.metadata || scrapeData.metadata || {},
        robotsTxt,
        sitemapXml,
        scrapedUrl: formattedUrl,
        aiAnalysis: aiAnalysis?.items || null,
      },
    };

    console.log('Marketing Audit - Scrape + AI analysis successful');
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Marketing Audit error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
