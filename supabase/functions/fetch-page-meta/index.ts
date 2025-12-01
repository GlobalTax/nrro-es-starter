import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PageMeta {
  url: string;
  meta_title?: string;
  meta_description?: string;
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔍 Fetching page meta tags...');

    // Obtener páginas sin meta tags
    const { data: pages, error: fetchError } = await supabase
      .from('site_pages')
      .select('id, url')
      .or('meta_title.is.null,meta_description.is.null')
      .eq('status', 'active')
      .limit(50); // Procesar máximo 50 páginas por ejecución

    if (fetchError) {
      throw new Error(`Error fetching pages: ${fetchError.message}`);
    }

    if (!pages || pages.length === 0) {
      console.log('✅ No pages need meta tag extraction');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No pages need meta tag extraction',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📄 Processing ${pages.length} pages...`);

    const results: PageMeta[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Procesar cada página
    for (const page of pages) {
      try {
        console.log(`Fetching: ${page.url}`);
        
        // Hacer fetch a la URL con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(page.url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Navarro-SEO-Bot/1.0'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();

        // Extraer title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const meta_title = titleMatch ? titleMatch[1].trim() : undefined;

        // Extraer meta description
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        const meta_description = descMatch ? descMatch[1].trim() : undefined;

        // Actualizar en la base de datos
        const updates: any = {};
        if (meta_title) updates.meta_title = meta_title;
        if (meta_description) updates.meta_description = meta_description;

        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('site_pages')
            .update(updates)
            .eq('id', page.id);

          if (updateError) {
            console.error(`Error updating page ${page.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`✅ Updated ${page.url}`);
            successCount++;
          }
        }

        results.push({
          url: page.url,
          meta_title,
          meta_description
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error processing ${page.url}:`, errorMessage);
        errorCount++;
        results.push({
          url: page.url,
          error: errorMessage
        });
      }
    }

    console.log(`✅ Completed: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: pages.length,
        successCount,
        errorCount,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Fatal error:', errorMessage);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
