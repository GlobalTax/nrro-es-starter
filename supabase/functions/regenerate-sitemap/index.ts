import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = 'https://nrro.es';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

// All approved static URLs (no hreflang groups — each is standalone)
const staticUrls: Array<{ path: string; priority: string; changefreq: string }> = [
  // Homepage
  { path: '/', priority: '1.0', changefreq: 'weekly' },

  // Servicios ES
  { path: '/servicios/asesoramiento-fiscal', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/planificacion-fiscal', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/impuesto-sociedades', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/irpf', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/iva', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/compliance-fiscal', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/contabilidad', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/auditoria', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/auditoria-subvenciones', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/asesoria-laboral', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/nominas', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/contratos-laborales', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/ertes-despidos', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/reubicacion-empleados-espana', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/asesoria-legal', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/derecho-mercantil', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/constituciones-sociedades', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/contratos-mercantiles', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/herencias-sucesiones', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/compraventa-empresas', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/due-diligence', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/capital-riesgo', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/empresa-familiar', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/csrd-esrs-verificacion', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/taxonomia-europea', priority: '0.9', changefreq: 'monthly' },

  // Servicios CA
  { path: '/ca/serveis/assessorament-fiscal', priority: '0.9', changefreq: 'monthly' },
  { path: '/ca/serveis/compravenda-d-empreses', priority: '0.9', changefreq: 'monthly' },
  { path: '/ca/serveis/empresa-familiar', priority: '0.9', changefreq: 'monthly' },
  { path: '/ca/serveis/auditoria-subvencions-autonomiques', priority: '0.9', changefreq: 'monthly' },
  { path: '/ca/serveis/auditoria-subvencions-publiques', priority: '0.9', changefreq: 'monthly' },
  { path: '/ca/serveis/auditoria-sistemes-it-cobit', priority: '0.9', changefreq: 'monthly' },

  // Servicios EN
  { path: '/en/services/ma-transaction-advisory', priority: '0.9', changefreq: 'monthly' },
  { path: '/en/services/vendor-due-diligence', priority: '0.9', changefreq: 'monthly' },
  { path: '/en/services/accounting-services-spain', priority: '0.9', changefreq: 'monthly' },
  { path: '/en/services/csrd-esrs-sustainability-verification', priority: '0.9', changefreq: 'monthly' },
  { path: '/en/services/eu-taxonomy-verification', priority: '0.9', changefreq: 'monthly' },

  // Páginas estáticas
  { path: '/contacto', priority: '0.6', changefreq: 'monthly' },
  { path: '/equipo', priority: '0.5', changefreq: 'monthly' },
  { path: '/sobre-nosotros', priority: '0.5', changefreq: 'monthly' },
  { path: '/casos-exito', priority: '0.8', changefreq: 'weekly' },
  { path: '/sectores', priority: '0.8', changefreq: 'monthly' },
  { path: '/recursos', priority: '0.7', changefreq: 'weekly' },
  { path: '/blog', priority: '0.6', changefreq: 'daily' },
  { path: '/carreras', priority: '0.7', changefreq: 'weekly' },
  { path: '/abogados-herencias-barcelona', priority: '0.8', changefreq: 'monthly' },
  { path: '/canal-denuncias', priority: '0.3', changefreq: 'yearly' },
  { path: '/ca', priority: '0.8', changefreq: 'weekly' },
  { path: '/ca/carreres', priority: '0.7', changefreq: 'weekly' },
  { path: '/en', priority: '0.8', changefreq: 'weekly' },

  // Páginas para LLMs / IA
  { path: '/llm.html', priority: '0.5', changefreq: 'monthly' },
];

function formatDate(date: string | null | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function createUrlEntry(url: SitemapUrl): string {
  return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
}

async function uploadSitemapToStorage(
  supabase: any,
  xmlContent: string
): Promise<string> {
  const fileName = 'sitemap.xml';
  const bucketName = 'public-files';

  console.log('📤 Subiendo sitemap a Storage...');

  const blob = new Blob([xmlContent], { type: 'application/xml' });

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, blob, {
      contentType: 'application/xml',
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('❌ Error subiendo sitemap:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  console.log('✅ Sitemap subido exitosamente');
  return urlData.publicUrl;
}

async function saveSitemapHistory(
  supabase: any,
  totalUrls: number,
  urlsEs: number,
  urlsCa: number,
  urlsEn: number,
  fileSize: number,
  generationTimeMs: number
) {
  try {
    await supabase.from('sitemap_history').insert({
      total_urls: totalUrls,
      urls_es: urlsEs,
      urls_ca: urlsCa,
      urls_en: urlsEn,
      file_size: fileSize,
      generation_time_ms: generationTimeMs,
    });
  } catch (e) {
    console.warn('⚠️ Could not save sitemap history:', e);
  }
}

async function generateSitemap() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const startTime = Date.now();
  console.log('🚀 Generando sitemap para nrro.es...');

  const urls: SitemapUrl[] = [];
  const today = formatDate(new Date().toISOString());
  let urlsEs = 0, urlsCa = 0, urlsEn = 0;

  // 1. Static approved URLs
  staticUrls.forEach(route => {
    urls.push({
      loc: `${BASE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
    if (route.path.startsWith('/ca')) urlsCa++;
    else if (route.path.startsWith('/en')) urlsEn++;
    else urlsEs++;
  });
  console.log(`  ✅ ${urls.length} URLs estáticas agregadas`);

  // 2. Blog posts (dynamic — only /blog/{slug})
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('slug_es, published_at, updated_at')
    .eq('status', 'published');

  if (blogError) {
    console.error('Error al obtener blog posts:', blogError);
  } else if (blogPosts) {
    blogPosts.forEach((post: any) => {
      const lastmod = formatDate(post.updated_at || post.published_at);
      urls.push({
        loc: `${BASE_URL}/blog/${post.slug_es}`,
        lastmod,
        changefreq: 'weekly',
        priority: '0.8',
      });
      urlsEs++;
    });
    console.log(`  ✅ ${blogPosts.length} URLs de blog agregadas`);
  }

  // Generate XML
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => createUrlEntry(url)).join('\n')}
</urlset>`;

  const generationTimeMs = Date.now() - startTime;
  console.log(`✅ Sitemap generado: ${urls.length} URLs en ${generationTimeMs}ms (ES:${urlsEs} CA:${urlsCa} EN:${urlsEn})`);

  await saveSitemapHistory(supabase, urls.length, urlsEs, urlsCa, urlsEn, xmlContent.length, generationTimeMs);

  return xmlContent;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Regenerando sitemap...');

    const xmlContent = await generateSitemap();

    // Upload to storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    await uploadSitemapToStorage(supabase, xmlContent);

    return new Response(xmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
