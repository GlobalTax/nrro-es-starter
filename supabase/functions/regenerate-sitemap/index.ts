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
  { es: '/privacidad', ca: '/ca/privacitat', en: '/en/privacy', priority: '0.5', changefreq: 'yearly' },
  { es: '/aviso-legal', ca: '/ca/avis-legal', en: '/en/legal-notice', priority: '0.5', changefreq: 'yearly' },
  { es: '/cookies', ca: '/ca/cookies', en: '/en/cookies', priority: '0.5', changefreq: 'yearly' },
  { es: '/condiciones-contratacion', ca: '/ca/condicions-contractacio', en: '/en/terms', priority: '0.5', changefreq: 'yearly' },
];

// Service landing pages (ES-only, no multilingual alternates generated via staticRoutes)
const serviceLandingPages = [
  { path: '/es/asesoria-fiscal-barcelona', priority: '0.8', changefreq: 'monthly' },
  { path: '/es/asesoria-contable-barcelona', priority: '0.8', changefreq: 'monthly' },
  { path: '/es/asesoria-laboral-barcelona', priority: '0.8', changefreq: 'monthly' },
  { path: '/es/asesoria-mercantil-barcelona', priority: '0.8', changefreq: 'monthly' },
  { path: '/es/abogados-barcelona', priority: '0.8', changefreq: 'monthly' },
  { path: '/es/orientacion-global', priority: '0.8', changefreq: 'monthly' },
  { path: '/es/compliance-penal', priority: '0.7', changefreq: 'monthly' },
  { path: '/es/empresa-familiar', priority: '0.7', changefreq: 'monthly' },
  { path: '/es/due-diligence', priority: '0.7', changefreq: 'monthly' },
  { path: '/es/proteccion-datos-rgpd', priority: '0.7', changefreq: 'monthly' },
  { path: '/es/segunda-oportunidad', priority: '0.7', changefreq: 'monthly' },
  { path: '/es/constitucion-sociedades', priority: '0.7', changefreq: 'monthly' },
  { path: '/es/sobre-navarro', priority: '0.5', changefreq: 'monthly' },
  { path: '/es/contacto', priority: '0.6', changefreq: 'monthly' },
  { path: '/en/tax-advisor-barcelona', priority: '0.8', changefreq: 'monthly' },
  { path: '/en/beckham-law-spain', priority: '0.8', changefreq: 'monthly' },
  { path: '/en/services/accounting-and-labor-consulting', priority: '0.7', changefreq: 'monthly' },
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

async function uploadSitemapToStorage(
  supabase: any, 
  xmlContent: string
): Promise<string> {
  const fileName = 'sitemap.xml';
  const bucketName = 'public-files';
  
  console.log('📤 Subiendo sitemap a Storage...');
  
  // Convertir string a Blob
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  
  // Subir a Storage (upsert = true para sobrescribir)
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, blob, {
      contentType: 'application/xml',
      cacheControl: '3600', // 1 hora de cache
      upsert: true // Sobrescribir archivo existente
    });
  
  if (error) {
    console.error('❌ Error subiendo sitemap:', error);
    throw error;
  }
  
  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
  
  console.log('✅ Sitemap subido exitosamente');
  console.log('🔗 URL pública:', urlData.publicUrl);
  
  return urlData.publicUrl;
}

async function generateSitemap(domain: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const BASE_URL = getBaseUrl(domain);
  console.log(`🚀 Iniciando generación de sitemap para ${domain} (${BASE_URL})...`);
  
  const urls: SitemapUrl[] = [];
  const today = formatDate(new Date().toISOString());
  
  // 1. Agregar rutas estáticas
  staticRoutes.forEach(route => {
    const alternates = [
      { lang: 'es', href: `${BASE_URL}${route.es}` },
      { lang: 'ca', href: `${BASE_URL}${route.ca}` },
      { lang: 'en', href: `${BASE_URL}${route.en}` }
    ];
    
    urls.push({ loc: `${BASE_URL}${route.es}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
    urls.push({ loc: `${BASE_URL}${route.ca}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
    urls.push({ loc: `${BASE_URL}${route.en}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
  });
  console.log(`  ✅ ${urls.length} URLs estáticas agregadas`);
  
  // 1b. Add service landing pages (single-language, with hreflang pairs where applicable)
  const hreflangPairs: Record<string, string> = {
    '/es/asesoria-fiscal-barcelona': '/en/tax-advisor-barcelona',
    '/en/tax-advisor-barcelona': '/es/asesoria-fiscal-barcelona',
  };
  serviceLandingPages.forEach(page => {
    const alternates: Array<{ lang: string; href: string }> = [];
    const pair = hreflangPairs[page.path];
    if (pair) {
      const lang = page.path.startsWith('/en/') ? 'en' : 'es';
      const pairLang = lang === 'es' ? 'en' : 'es';
      alternates.push({ lang, href: `${BASE_URL}${page.path}` });
      alternates.push({ lang: pairLang, href: `${BASE_URL}${pair}` });
    }
    urls.push({ loc: `${BASE_URL}${page.path}`, lastmod: today, changefreq: page.changefreq, priority: page.priority, alternates: alternates.length > 0 ? alternates : undefined });
  });
  console.log(`  ✅ ${serviceLandingPages.length} URLs de landing pages agregadas`);
  
  // 2. Agregar servicios dinámicos
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
      const alternates = [
        { lang: 'es', href: `${BASE_URL}/servicios/${service.slug_es}` },
        { lang: 'ca', href: `${BASE_URL}/ca/serveis/${slugCa}` },
        { lang: 'en', href: `${BASE_URL}/en/services/${slugEn}` }
      ];
      urls.push({ loc: `${BASE_URL}/servicios/${service.slug_es}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urls.push({ loc: `${BASE_URL}/ca/serveis/${slugCa}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urls.push({ loc: `${BASE_URL}/en/services/${slugEn}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
    });
    console.log(`  ✅ ${services.length * 3} URLs de servicios agregadas`);
  }
  
  // 3. Agregar blog posts dinámicos (sin slug_ca - no existe en la tabla)
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
      const alternates = [
        { lang: 'es', href: `${BASE_URL}/blog/${post.slug_es}` },
        { lang: 'en', href: `${BASE_URL}/en/blog/${slugEn}` }
      ];
      urls.push({ loc: `${BASE_URL}/blog/${post.slug_es}`, lastmod, changefreq: 'weekly', priority: '0.8', alternates });
      urls.push({ loc: `${BASE_URL}/en/blog/${slugEn}`, lastmod, changefreq: 'weekly', priority: '0.8', alternates });
    });
    console.log(`  ✅ ${blogPosts.length * 2} URLs de blog posts agregadas`);
  }
  
  // 4. Agregar case studies dinámicos
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
      const alternates = [
        { lang: 'es', href: `${BASE_URL}/casos-exito/${cs.slug_es}` },
        { lang: 'ca', href: `${BASE_URL}/ca/casos-exit/${slugCa}` },
        { lang: 'en', href: `${BASE_URL}/en/case-studies/${slugEn}` }
      ];
      urls.push({ loc: `${BASE_URL}/casos-exito/${cs.slug_es}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urls.push({ loc: `${BASE_URL}/ca/casos-exit/${slugCa}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      urls.push({ loc: `${BASE_URL}/en/case-studies/${slugEn}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
    });
    console.log(`  ✅ ${caseStudies.length * 3} URLs de case studies agregadas`);
  }
  
  // 5. Generar XML
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  const xmlBody = urls.map(url => createUrlEntry(url)).join('\n');
  const xmlFooter = '\n</urlset>';
  const xmlContent = xmlHeader + xmlBody + xmlFooter;
  
  console.log(`✅ Sitemap generado: ${urls.length} URLs`);
  return xmlContent;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('🔄 Regenerando sitemaps para ambos dominios...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Generate and upload sitemap for nrro.es
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
