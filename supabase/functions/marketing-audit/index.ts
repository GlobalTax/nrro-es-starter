const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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
          sitemapXml = text.substring(0, 5000); // Truncate for size
        }
      }
    } catch { /* ignore */ }

    const result = {
      success: true,
      data: {
        html: scrapeData.data?.html || scrapeData.html || '',
        markdown: scrapeData.data?.markdown || scrapeData.markdown || '',
        links: scrapeData.data?.links || scrapeData.links || [],
        metadata: scrapeData.data?.metadata || scrapeData.metadata || {},
        robotsTxt,
        sitemapXml,
        scrapedUrl: formattedUrl,
      },
    };

    console.log('Marketing Audit - Scrape successful');
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
