import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getBaseUrl(domain: string): string {
  if (domain.includes('int.') || domain.includes('global.')) {
    return 'https://int.nrro.es';
  }
  return 'https://nrro.es';
}

interface RouteConfig {
  es: string;
  ca: string;
  en: string;
  priority: string;
  changefreq: string;
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  alternates?: Array<{ lang: string; href: string }>;
}

const staticRoutes: RouteConfig[] = [
  { es: '/', ca: '/ca/', en: '/en/', priority: '1.0', changefreq: 'weekly' },
  { es: '/servicios', ca: '/ca/serveis', en: '/en/services', priority: '0.9', changefreq: 'weekly' },
  { es: '/nosotros', ca: '/ca/nosaltres', en: '/en/about', priority: '0.5', changefreq: 'monthly' },
  { es: '/equipo', ca: '/ca/equip', en: '/en/team', priority: '0.5', changefreq: 'monthly' },
  { es: '/casos-exito', ca: '/ca/casos-exit', en: '/en/case-studies', priority: '0.9', changefreq: 'weekly' },
  { es: '/blog', ca: '/ca/blog', en: '/en/blog', priority: '0.6', changefreq: 'daily' },
  { es: '/contacto', ca: '/ca/contacte', en: '/en/contact', priority: '0.6', changefreq: 'monthly' },
  { es: '/carreras', ca: '/ca/carreres', en: '/en/careers', priority: '0.7', changefreq: 'weekly' },
  { es: '/metodologia', ca: '/ca/metodologia', en: '/en/methodology', priority: '0.7', changefreq: 'monthly' },
  { es: '/ley-beckham', ca: '/ca/llei-beckham', en: '/en/beckham-law', priority: '0.8', changefreq: 'monthly' },
  { es: '/orquest-kairoshr', ca: '/ca/orquest-kairoshr', en: '/en/orquest-kairoshr', priority: '0.8', changefreq: 'monthly' },
  { es: '/estrategia', ca: '/ca/estrategia', en: '/en/strategy', priority: '0.8', changefreq: 'monthly' },
  { es: '/sectores', ca: '/ca/sectors', en: '/en/sectors', priority: '0.8', changefreq: 'monthly' },
  { es: '/recursos', ca: '/ca/recursos', en: '/en/resources', priority: '0.7', changefreq: 'weekly' },
  { es: '/privacidad', ca: '/ca/privacitat', en: '/en/privacy', priority: '0.5', changefreq: 'yearly' },
  { es: '/aviso-legal', ca: '/ca/avis-legal', en: '/en/legal-notice', priority: '0.5', changefreq: 'yearly' },
  { es: '/cookies', ca: '/ca/cookies', en: '/en/cookies', priority: '0.5', changefreq: 'yearly' },
  { es: '/condiciones-contratacion', ca: '/ca/condicions-contractacio', en: '/en/terms', priority: '0.5', changefreq: 'yearly' },
];

// Service landing pages with hreflang groups
// Pages in the same group are alternates of each other
interface ServiceLandingGroup {
  pages: Array<{ path: string; lang: string }>;
  priority: string;
  changefreq: string;
}

const serviceLandingGroups: ServiceLandingGroup[] = [
  // Fiscal - ES ↔ EN
  {
    pages: [
      { path: '/es/asesoria-fiscal-barcelona', lang: 'es' },
      { path: '/en/tax-advisor-barcelona', lang: 'en' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // Contable - ES (no EN equivalent yet)
  {
    pages: [
      { path: '/es/asesoria-contable-barcelona', lang: 'es' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // Laboral - ES (no EN equivalent yet)
  {
    pages: [
      { path: '/es/asesoria-laboral-barcelona', lang: 'es' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // Mercantil - ES (no EN equivalent yet)
  {
    pages: [
      { path: '/es/asesoria-mercantil-barcelona', lang: 'es' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // Abogados Barcelona - ES (no EN equivalent yet)
  {
    pages: [
      { path: '/es/abogados-barcelona', lang: 'es' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // Empresa Familiar - ES
  {
    pages: [
      { path: '/es/empresa-familiar', lang: 'es' },
    ],
    priority: '0.7', changefreq: 'monthly',
  },
  // Herencias Barcelona - ES
  {
    pages: [
      { path: '/es/abogados-herencias-barcelona', lang: 'es' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // Company setup - ES ↔ CA ↔ EN
  {
    pages: [
      { path: '/crear-empresa-espana', lang: 'es' },
      { path: '/ca/crear-empresa-espanya', lang: 'ca' },
      { path: '/en/set-up-company-spain', lang: 'en' },
    ],
    priority: '0.9', changefreq: 'monthly',
  },
  // Beckham Law EN landing
  {
    pages: [
      { path: '/en/beckham-law-spain', lang: 'en' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // EN - Company setup calculator
  {
    pages: [
      { path: '/en/company-setup-calculator', lang: 'en' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // EN - NIE Spain
  {
    pages: [
      { path: '/en/nie-spain-foreigners', lang: 'en' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // EN - Startup setup
  {
    pages: [
      { path: '/en/startup-company-setup-spain', lang: 'en' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // EN - Fast registration
  {
    pages: [
      { path: '/en/fast-company-registration-spain', lang: 'en' },
    ],
    priority: '0.8', changefreq: 'monthly',
  },
  // Canal denuncias
  {
    pages: [
      { path: '/canal-denuncias', lang: 'es' },
    ],
    priority: '0.3', changefreq: 'yearly',
  },
  // ES specialization landings
  {
    pages: [{ path: '/es/orientacion-global', lang: 'es' }],
    priority: '0.7', changefreq: 'monthly',
  },
  {
    pages: [{ path: '/es/compliance-penal', lang: 'es' }],
    priority: '0.7', changefreq: 'monthly',
  },
  {
    pages: [{ path: '/es/due-diligence', lang: 'es' }],
    priority: '0.7', changefreq: 'monthly',
  },
  {
    pages: [{ path: '/es/proteccion-datos-rgpd', lang: 'es' }],
    priority: '0.7', changefreq: 'monthly',
  },
  {
    pages: [{ path: '/es/segunda-oportunidad', lang: 'es' }],
    priority: '0.7', changefreq: 'monthly',
  },
  {
    pages: [{ path: '/es/constitucion-sociedades', lang: 'es' }],
    priority: '0.8', changefreq: 'monthly',
  },
  {
    pages: [{ path: '/es/sobre-navarro', lang: 'es' }],
    priority: '0.6', changefreq: 'monthly',
  },
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
  let xml = `  <url>\n`;
  xml += `    <loc>${url.loc}</loc>\n`;
  xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
  xml += `    <priority>${url.priority}</priority>\n`;
  
  if (url.alternates && url.alternates.length > 0) {
    url.alternates.forEach(alt => {
      xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}"/>\n`;
    });
  }
  
  xml += `  </url>`;
  return xml;
}

// Helper: build alternates array with x-default pointing to ES version
function buildAlternates(
  baseUrl: string,
  langs: Array<{ lang: string; path: string }>,
): Array<{ lang: string; href: string }> {
  const alternates = langs.map(l => ({ lang: l.lang, href: `${baseUrl}${l.path}` }));
  // x-default = ES version (or first available)
  const esVersion = langs.find(l => l.lang === 'es') || langs[0];
  alternates.push({ lang: 'x-default', href: `${baseUrl}${esVersion.path}` });
  return alternates;
}

async function uploadSitemapToStorage(
  supabase: any, 
  xmlContent: string
): Promise<string> {
  const fileName = 'sitemap.xml';
  const bucketName = 'public-files';
  
  console.log('📤 Subiendo sitemap a Storage...');
  
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  
  const { data, error } = await supabase.storage
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
  console.log('🔗 URL pública:', urlData.publicUrl);
  
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

async function generateSitemap(domain: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const BASE_URL = getBaseUrl(domain);
  const startTime = Date.now();
  console.log(`🚀 Iniciando generación de sitemap para ${domain} (${BASE_URL})...`);
  
  const urls: SitemapUrl[] = [];
  const today = formatDate(new Date().toISOString());
  let urlsEs = 0, urlsCa = 0, urlsEn = 0;
  
  // 1. Static routes with x-default
  staticRoutes.forEach(route => {
    const langs = [
      { lang: 'es', path: route.es },
      { lang: 'ca', path: route.ca },
      { lang: 'en', path: route.en },
    ];
    const alternates = buildAlternates(BASE_URL, langs);
    
    urls.push({ loc: `${BASE_URL}${route.es}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
    urls.push({ loc: `${BASE_URL}${route.ca}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
    urls.push({ loc: `${BASE_URL}${route.en}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
    urlsEs++; urlsCa++; urlsEn++;
  });
  console.log(`  ✅ ${urls.length} URLs estáticas agregadas`);
  
  // 1b. Service landing groups with x-default
  serviceLandingGroups.forEach(group => {
    const hasMultipleLangs = group.pages.length > 1;
    const alternates = hasMultipleLangs
      ? buildAlternates(BASE_URL, group.pages.map(p => ({ lang: p.lang, path: p.path })))
      : undefined;
    
    group.pages.forEach(page => {
      urls.push({
        loc: `${BASE_URL}${page.path}`,
        lastmod: today,
        changefreq: group.changefreq,
        priority: group.priority,
        alternates,
      });
      if (page.lang === 'es' || page.path.startsWith('/es/') || page.path.startsWith('/crear')) urlsEs++;
      else if (page.lang === 'ca' || page.path.startsWith('/ca/')) urlsCa++;
      else if (page.lang === 'en' || page.path.startsWith('/en/')) urlsEn++;
    });
  });
  console.log(`  ✅ Service landing pages agregadas`);
  
  // 2. Dynamic services
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('slug_es, slug_ca, slug_en, updated_at')
    .eq('is_active', true);
  
  if (servicesError) {
    console.error('Error al obtener servicios:', servicesError);
  } else if (services) {
    services.forEach(service => {
      const lastmod = formatDate(service.updated_at);
      const slugCa = service.slug_ca || service.slug_es;
      const slugEn = service.slug_en || service.slug_es;
      const langs = [
        { lang: 'es', path: `/servicios/${service.slug_es}` },
        { lang: 'ca', path: `/ca/serveis/${slugCa}` },
        { lang: 'en', path: `/en/services/${slugEn}` },
      ];
      const alternates = buildAlternates(BASE_URL, langs);
      urls.push({ loc: `${BASE_URL}/servicios/${service.slug_es}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urls.push({ loc: `${BASE_URL}/ca/serveis/${slugCa}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urls.push({ loc: `${BASE_URL}/en/services/${slugEn}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urlsEs++; urlsCa++; urlsEn++;
    });
    console.log(`  ✅ ${services.length * 3} URLs de servicios agregadas`);
  }
  
  // 3. Blog posts (no slug_ca in table)
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('slug_es, slug_en, published_at, updated_at')
    .eq('status', 'published');
  
  if (blogError) {
    console.error('Error al obtener blog posts:', blogError);
  } else if (blogPosts) {
    blogPosts.forEach(post => {
      const lastmod = formatDate(post.updated_at || post.published_at);
      const slugEn = post.slug_en || post.slug_es;
      const langs = [
        { lang: 'es', path: `/blog/${post.slug_es}` },
        { lang: 'en', path: `/en/blog/${slugEn}` },
      ];
      const alternates = buildAlternates(BASE_URL, langs);
      urls.push({ loc: `${BASE_URL}/blog/${post.slug_es}`, lastmod, changefreq: 'weekly', priority: '0.8', alternates });
      urls.push({ loc: `${BASE_URL}/en/blog/${slugEn}`, lastmod, changefreq: 'weekly', priority: '0.8', alternates });
      urlsEs++; urlsEn++;
    });
    console.log(`  ✅ ${blogPosts.length * 2} URLs de blog posts agregadas`);
  }
  
  // 4. News articles
  const { data: newsArticles, error: newsError } = await supabase
    .from('news_articles')
    .select('slug, published_at, updated_at')
    .eq('is_published', true);
  
  if (newsError) {
    console.error('Error al obtener news articles:', newsError);
  } else if (newsArticles && newsArticles.length > 0) {
    newsArticles.forEach(article => {
      const lastmod = formatDate(article.updated_at || article.published_at);
      urls.push({
        loc: `${BASE_URL}/noticias/${article.slug}`,
        lastmod,
        changefreq: 'weekly',
        priority: '0.7',
      });
      urlsEs++;
    });
    console.log(`  ✅ ${newsArticles.length} URLs de noticias agregadas`);
  }
  
  // 5. Case studies
  const { data: caseStudies, error: casesError } = await supabase
    .from('case_studies')
    .select('slug_es, slug_ca, slug_en, published_at, updated_at')
    .eq('status', 'published');
  
  if (casesError) {
    console.error('Error al obtener case studies:', casesError);
  } else if (caseStudies) {
    caseStudies.forEach(cs => {
      const lastmod = formatDate(cs.updated_at || cs.published_at);
      const slugCa = cs.slug_ca || cs.slug_es;
      const slugEn = cs.slug_en || cs.slug_es;
      const langs = [
        { lang: 'es', path: `/casos-exito/${cs.slug_es}` },
        { lang: 'ca', path: `/ca/casos-exit/${slugCa}` },
        { lang: 'en', path: `/en/case-studies/${slugEn}` },
      ];
      const alternates = buildAlternates(BASE_URL, langs);
      urls.push({ loc: `${BASE_URL}/casos-exito/${cs.slug_es}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urls.push({ loc: `${BASE_URL}/ca/casos-exit/${slugCa}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urls.push({ loc: `${BASE_URL}/en/case-studies/${slugEn}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urlsEs++; urlsCa++; urlsEn++;
    });
    console.log(`  ✅ ${caseStudies.length * 3} URLs de case studies agregadas`);
  }
  
  // 6. Job positions
  const { data: jobs, error: jobsError } = await supabase
    .from('job_positions')
    .select('slug, slug_es, slug_ca, slug_en, updated_at, published_at')
    .eq('status', 'published');
  
  if (jobsError) {
    console.error('Error al obtener job positions:', jobsError);
  } else if (jobs && jobs.length > 0) {
    jobs.forEach(job => {
      const lastmod = formatDate(job.updated_at || job.published_at);
      const slugEs = job.slug_es || job.slug;
      const slugCa = job.slug_ca || slugEs;
      const slugEn = job.slug_en || slugEs;
      const langs = [
        { lang: 'es', path: `/carreras/${slugEs}` },
        { lang: 'ca', path: `/ca/carreres/${slugCa}` },
        { lang: 'en', path: `/en/careers/${slugEn}` },
      ];
      const alternates = buildAlternates(BASE_URL, langs);
      urls.push({ loc: `${BASE_URL}/carreras/${slugEs}`, lastmod, changefreq: 'weekly', priority: '0.7', alternates });
      urls.push({ loc: `${BASE_URL}/ca/carreres/${slugCa}`, lastmod, changefreq: 'weekly', priority: '0.7', alternates });
      urls.push({ loc: `${BASE_URL}/en/careers/${slugEn}`, lastmod, changefreq: 'weekly', priority: '0.7', alternates });
      urlsEs++; urlsCa++; urlsEn++;
    });
    console.log(`  ✅ ${jobs.length * 3} URLs de ofertas de empleo agregadas`);
  }
  
  // Generate XML
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  const xmlBody = urls.map(url => createUrlEntry(url)).join('\n');
  const xmlFooter = '\n</urlset>';
  const xmlContent = xmlHeader + xmlBody + xmlFooter;
  
  const generationTimeMs = Date.now() - startTime;
  console.log(`✅ Sitemap generado: ${urls.length} URLs en ${generationTimeMs}ms (ES:${urlsEs} CA:${urlsCa} EN:${urlsEn})`);
  
  // Save history
  await saveSitemapHistory(supabase, urls.length, urlsEs, urlsCa, urlsEn, xmlContent.length, generationTimeMs);
  
  return xmlContent;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('🔄 Regenerando sitemaps...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const xmlEs = await generateSitemap('nrro.es');
    await uploadSitemapToStorage(supabase, xmlEs);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sitemap regenerado y almacenado exitosamente',
        size: xmlEs.length,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('❌ Error al generar sitemap:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
