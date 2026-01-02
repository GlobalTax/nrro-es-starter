import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SitemapUrl {
  url: string;
  language: string;
  pageType: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔄 Iniciando sincronización de site_pages...');

    // Crear registro de sincronización
    const { data: syncLog, error: logError } = await supabase
      .from('sitemap_sync_log')
      .insert({
        status: 'running',
        triggered_by: 'manual',
      })
      .select()
      .single();

    if (logError) {
      throw new Error(`Error creando log: ${logError.message}`);
    }

    console.log(`📝 Log de sincronización creado: ${syncLog.id}`);

    // 1. Descargar sitemap.xml desde Storage
    console.log('📥 Descargando sitemap.xml...');
    const { data: sitemapFile } = supabase.storage
      .from('public-files')
      .getPublicUrl('sitemap.xml');

    const sitemapResponse = await fetch(sitemapFile.publicUrl);
    if (!sitemapResponse.ok) {
      throw new Error('Error descargando sitemap.xml');
    }

    const sitemapXml = await sitemapResponse.text();
    console.log(`✅ Sitemap descargado (${sitemapXml.length} bytes)`);

    // 2. Parsear URLs del sitemap
    const urlMatches = sitemapXml.matchAll(/<loc>(https:\/\/int\.nrro\.es\/[^<]+)<\/loc>/g);
    const sitemapUrls: SitemapUrl[] = [];

    for (const match of urlMatches) {
      const fullUrl = match[1];
      const urlPath = fullUrl.replace('https://int.nrro.es', '');
      
      // Detectar idioma
      let language = 'es';
      if (urlPath.startsWith('/en/')) language = 'en';
      else if (urlPath.startsWith('/ca/')) language = 'ca';

      // Detectar tipo de página
      let pageType = 'static';
      if (urlPath.includes('/servicios/') || urlPath.includes('/services/')) pageType = 'service';
      else if (urlPath.includes('/blog/')) pageType = 'blog';
      else if (urlPath.includes('/casos-estudio/') || urlPath.includes('/case-studies/')) pageType = 'case_study';
      else if (urlPath.includes('/trabaja-con-nosotros/') || urlPath.includes('/careers/')) pageType = 'job';
      else if (urlPath.includes('/constituir-empresa/') || 
                urlPath.includes('/ley-beckham/') ||
                urlPath.includes('/herencias-barcelona/')) pageType = 'landing';

      sitemapUrls.push({ url: urlPath, language, pageType });
    }

    console.log(`🔍 Encontradas ${sitemapUrls.length} URLs en sitemap`);

    // 3. Obtener todas las páginas actuales de la BD
    const { data: existingPages, error: fetchError } = await supabase
      .from('site_pages')
      .select('url, status');

    if (fetchError) {
      throw new Error(`Error fetching pages: ${fetchError.message}`);
    }

    const existingUrls = new Set(existingPages?.map(p => p.url) || []);
    console.log(`💾 ${existingUrls.size} páginas en la base de datos`);

    // 4. Detectar nuevas, archivadas y actualizadas
    const newUrls = sitemapUrls.filter(su => !existingUrls.has(su.url));
    const sitemapUrlSet = new Set(sitemapUrls.map(su => su.url));
    const archivedUrls = existingPages?.filter(
      p => !sitemapUrlSet.has(p.url) && p.status !== 'archived'
    ) || [];

    console.log(`🆕 ${newUrls.length} URLs nuevas`);
    console.log(`📦 ${archivedUrls.length} URLs a archivar`);

    let pagesAdded = 0;
    let pagesArchived = 0;
    let pagesUpdated = 0;
    const errors: any[] = [];

    // 5. Insertar nuevas páginas
    if (newUrls.length > 0) {
      const pagesToInsert = newUrls.map(nu => ({
        url: nu.url,
        title: `Página en ${nu.language.toUpperCase()}`,
        page_type: nu.pageType,
        language: nu.language,
        status: 'published',
        last_updated: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from('site_pages')
        .insert(pagesToInsert);

      if (insertError) {
        console.error('❌ Error insertando páginas:', insertError);
        errors.push({ action: 'insert', error: insertError.message });
      } else {
        pagesAdded = newUrls.length;
        console.log(`✅ ${pagesAdded} páginas añadidas`);
      }
    }

    // 6. Archivar páginas eliminadas
    if (archivedUrls.length > 0) {
      const { error: archiveError } = await supabase
        .from('site_pages')
        .update({ status: 'archived' })
        .in('url', archivedUrls.map(p => p.url));

      if (archiveError) {
        console.error('❌ Error archivando páginas:', archiveError);
        errors.push({ action: 'archive', error: archiveError.message });
      } else {
        pagesArchived = archivedUrls.length;
        console.log(`📦 ${pagesArchived} páginas archivadas`);
      }
    }

    // 7. Actualizar last_updated de páginas existentes
    const existingInSitemap = sitemapUrls.filter(su => existingUrls.has(su.url));
    if (existingInSitemap.length > 0) {
      const { error: updateError } = await supabase
        .from('site_pages')
        .update({ last_updated: new Date().toISOString() })
        .in('url', existingInSitemap.map(p => p.url));

      if (updateError) {
        console.error('❌ Error actualizando páginas:', updateError);
        errors.push({ action: 'update', error: updateError.message });
      } else {
        pagesUpdated = existingInSitemap.length;
        console.log(`🔄 ${pagesUpdated} páginas actualizadas`);
      }
    }

    // 8. Actualizar log de sincronización
    await supabase
      .from('sitemap_sync_log')
      .update({
        completed_at: new Date().toISOString(),
        status: errors.length > 0 ? 'failed' : 'completed',
        pages_added: pagesAdded,
        pages_updated: pagesUpdated,
        pages_archived: pagesArchived,
        pages_total: sitemapUrls.length,
        errors: errors,
      })
      .eq('id', syncLog.id);

    console.log('✅ Sincronización completada');

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          pagesAdded,
          pagesUpdated,
          pagesArchived,
          pagesTotal: sitemapUrls.length,
          errors,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error en sincronización:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});