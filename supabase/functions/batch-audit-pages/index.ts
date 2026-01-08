import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SitePage {
  id: string;
  url: string;
  title: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sitePageIds, baseUrl = 'https://nrro.es' } = await req.json();

    if (!sitePageIds || !Array.isArray(sitePageIds) || sitePageIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'sitePageIds array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch site pages details
    const { data: sitePages, error: fetchError } = await supabase
      .from('site_pages')
      .select('id, url, title')
      .in('id', sitePageIds);

    if (fetchError) {
      console.error('Error fetching site pages:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch site pages' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pages = sitePages as SitePage[];
    console.log(`Starting batch audit for ${pages.length} pages`);

    const results: Array<{
      sitePageId: string;
      url: string;
      success: boolean;
      overallScore?: number;
      error?: string;
    }> = [];

    // Audit pages sequentially with delays
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      
      // Construct full URL
      let fullUrl = page.url;
      if (!fullUrl.startsWith('http')) {
        fullUrl = `${baseUrl}${page.url.startsWith('/') ? '' : '/'}${page.url}`;
      }

      console.log(`Auditing page ${i + 1}/${pages.length}: ${fullUrl}`);

      try {
        // Call the audit-page function
        const auditResponse = await fetch(`${supabaseUrl}/functions/v1/audit-page`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: fullUrl, sitePageId: page.id }),
        });

        const auditData = await auditResponse.json();

        if (auditData.success) {
          results.push({
            sitePageId: page.id,
            url: fullUrl,
            success: true,
            overallScore: auditData.audit?.overall_score,
          });
        } else {
          results.push({
            sitePageId: page.id,
            url: fullUrl,
            success: false,
            error: auditData.error || 'Unknown error',
          });
        }
      } catch (error) {
        console.error(`Error auditing ${fullUrl}:`, error);
        results.push({
          sitePageId: page.id,
          url: fullUrl,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Add delay between audits to avoid rate limiting (3 seconds)
      if (i < pages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Batch audit completed: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        total: pages.length,
        successCount,
        failCount,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Batch audit error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
