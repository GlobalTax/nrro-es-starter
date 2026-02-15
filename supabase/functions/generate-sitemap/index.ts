import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  alternates?: Array<{ lang: string; href: string }>;
}

interface RouteConfig {
  es: string;
  ca: string;
  en: string;
  priority: string;
  changefreq: string;
}

function getBaseUrl(domain: string): string {
  if (domain.includes('int.') || domain.includes('global.')) {
    return 'https://int.nrro.es';
  }
  return 'https://nrro.es';
}

function isInternational(domain: string): boolean {
  return domain.includes('int.') || domain.includes('global.');
}

const staticRoutes: RouteConfig[] = [
  { es: '/', ca: '/ca/', en: '/en/', priority: '1.0', changefreq: 'weekly' },
  { es: '/servicios', ca: '/ca/serveis', en: '/en/services', priority: '0.9', changefreq: 'weekly' },
  { es: '/nosotros', ca: '/ca/nosaltres', en: '/en/about', priority: '0.8', changefreq: 'monthly' },
  { es: '/equipo', ca: '/ca/equip', en: '/en/team', priority: '0.8', changefreq: 'monthly' },
  { es: '/casos-exito', ca: '/ca/casos-exit', en: '/en/case-studies', priority: '0.9', changefreq: 'weekly' },
  { es: '/blog', ca: '/ca/blog', en: '/en/blog', priority: '0.9', changefreq: 'daily' },
  { es: '/contacto', ca: '/ca/contacte', en: '/en/contact', priority: '0.8', changefreq: 'monthly' },
  { es: '/carreras', ca: '/ca/carreres', en: '/en/careers', priority: '0.7', changefreq: 'weekly' },
  { es: '/metodologia', ca: '/ca/metodologia', en: '/en/methodology', priority: '0.7', changefreq: 'monthly' },
  { es: '/estrategia', ca: '/ca/estrategia', en: '/en/strategy', priority: '0.7', changefreq: 'monthly' },
  { es: '/sectores', ca: '/ca/sectors', en: '/en/sectors', priority: '0.7', changefreq: 'monthly' },
  { es: '/recursos', ca: '/ca/recursos', en: '/en/resources', priority: '0.7', changefreq: 'weekly' },
  { es: '/ley-beckham', ca: '/ca/llei-beckham', en: '/en/beckham-law', priority: '0.8', changefreq: 'monthly' },
  { es: '/orquest-kairoshr', ca: '/ca/orquest-kairoshr', en: '/en/orquest-kairoshr', priority: '0.8', changefreq: 'monthly' },
  { es: '/privacidad', ca: '/ca/privacitat', en: '/en/privacy', priority: '0.5', changefreq: 'yearly' },
  { es: '/aviso-legal', ca: '/ca/avis-legal', en: '/en/legal-notice', priority: '0.5', changefreq: 'yearly' },
  { es: '/cookies', ca: '/ca/cookies', en: '/en/cookies', priority: '0.5', changefreq: 'yearly' },
  { es: '/condiciones-contratacion', ca: '/ca/condicions-contractacio', en: '/en/terms', priority: '0.5', changefreq: 'yearly' },
];

// nrro.es-only landings (no multilingual alternates needed)
const esOnlyLandings = [
  { path: '/set-up-company-spain', priority: '0.8', changefreq: 'monthly' },
  { path: '/crear-empresa-espana', priority: '0.8', changefreq: 'monthly' },
  { path: '/canal-denuncias', priority: '0.6', changefreq: 'yearly' },
];

// EN-only landings on nrro.es
const enOnlyLandings = [
  { path: '/en/company-setup-calculator', priority: '0.7', changefreq: 'monthly' },
  { path: '/en/nie-spain-foreigners', priority: '0.7', changefreq: 'monthly' },
  { path: '/en/startup-company-setup-spain', priority: '0.7', changefreq: 'monthly' },
  { path: '/en/fast-company-registration-spain', priority: '0.7', changefreq: 'monthly' },
  { path: '/en/set-up-company-spain', priority: '0.7', changefreq: 'monthly' },
];

// CA-only landings on nrro.es
const caOnlyLandings = [
  { path: '/ca/crear-empresa-espanya', priority: '0.7', changefreq: 'monthly' },
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

async function generateSitemap(domain: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const baseUrl = getBaseUrl(domain);
  const isInt = isInternational(domain);
  const today = formatDate(new Date().toISOString());
  const urls: SitemapUrl[] = [];

  // 1. Static routes with hreflang alternates
  staticRoutes.forEach(route => {
    const alternates = [
      { lang: 'es', href: `${baseUrl}${route.es}` },
      { lang: 'ca', href: `${baseUrl}${route.ca}` },
      { lang: 'en', href: `${baseUrl}${route.en}` },
    ];

    if (isInt) {
      // International site: only EN routes
      urls.push({ loc: `${baseUrl}${route.en}`, lastmod: today, changefreq: route.changefreq, priority: route.priority });
    } else {
      // nrro.es: all 3 languages with hreflang
      urls.push({ loc: `${baseUrl}${route.es}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
      urls.push({ loc: `${baseUrl}${route.ca}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
      urls.push({ loc: `${baseUrl}${route.en}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, alternates });
    }
  });

  // 2. Extra landings (nrro.es only)
  if (!isInt) {
    [...esOnlyLandings, ...enOnlyLandings, ...caOnlyLandings].forEach(l => {
      urls.push({ loc: `${baseUrl}${l.path}`, lastmod: today, changefreq: l.changefreq, priority: l.priority });
    });
  }

  // 3. Dynamic: services
  const { data: services } = await supabase
    .from('services')
    .select('slug_es, slug_ca, slug_en, updated_at')
    .eq('is_active', true);

  if (services) {
    services.forEach(s => {
      const lastmod = formatDate(s.updated_at);
      const slugCa = s.slug_ca || s.slug_es;
      const slugEn = s.slug_en || s.slug_es;
      const alternates = [
        { lang: 'es', href: `${baseUrl}/servicios/${s.slug_es}` },
        { lang: 'ca', href: `${baseUrl}/ca/serveis/${slugCa}` },
        { lang: 'en', href: `${baseUrl}/en/services/${slugEn}` },
      ];
      if (isInt) {
        urls.push({ loc: `${baseUrl}/en/services/${slugEn}`, lastmod, changefreq: 'monthly', priority: '0.9' });
      } else {
        urls.push({ loc: `${baseUrl}/servicios/${s.slug_es}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
        urls.push({ loc: `${baseUrl}/ca/serveis/${slugCa}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
        urls.push({ loc: `${baseUrl}/en/services/${slugEn}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      }
    });
  }

  // 4. Dynamic: blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug_es, slug_en, published_at, updated_at, source_site, shared_sites')
    .eq('status', 'published');

  if (blogPosts) {
    blogPosts.forEach(post => {
      const lastmod = formatDate(post.updated_at || post.published_at);
      const slugEn = post.slug_en || post.slug_es;

      if (isInt) {
        // Only include posts for int site
        if (post.source_site === 'int' || (post.shared_sites && post.shared_sites.includes('int'))) {
          urls.push({ loc: `${baseUrl}/en/blog/${slugEn}`, lastmod, changefreq: 'weekly', priority: '0.8' });
        }
      } else {
        // nrro.es: include es-sourced + shared posts
        if (post.source_site === 'es' || !post.source_site || (post.shared_sites && post.shared_sites.includes('es'))) {
          const alternates = [
            { lang: 'es', href: `${baseUrl}/blog/${post.slug_es}` },
            { lang: 'en', href: `${baseUrl}/en/blog/${slugEn}` },
          ];
          urls.push({ loc: `${baseUrl}/blog/${post.slug_es}`, lastmod, changefreq: 'weekly', priority: '0.8', alternates });
          urls.push({ loc: `${baseUrl}/en/blog/${slugEn}`, lastmod, changefreq: 'weekly', priority: '0.8', alternates });
        }
      }
    });
  }

  // 5. Dynamic: case studies
  const { data: caseStudies } = await supabase
    .from('case_studies')
    .select('slug_es, slug_ca, slug_en, published_at, updated_at, source_site')
    .eq('status', 'published');

  if (caseStudies) {
    caseStudies.forEach(cs => {
      const lastmod = formatDate(cs.updated_at || cs.published_at);
      const slugCa = cs.slug_ca || cs.slug_es;
      const slugEn = cs.slug_en || cs.slug_es;

      if (isInt) {
        urls.push({ loc: `${baseUrl}/en/case-studies/${slugEn}`, lastmod, changefreq: 'monthly', priority: '0.9' });
      } else {
        const alternates = [
          { lang: 'es', href: `${baseUrl}/casos-exito/${cs.slug_es}` },
          { lang: 'ca', href: `${baseUrl}/ca/casos-exit/${slugCa}` },
          { lang: 'en', href: `${baseUrl}/en/case-studies/${slugEn}` },
        ];
        urls.push({ loc: `${baseUrl}/casos-exito/${cs.slug_es}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
        urls.push({ loc: `${baseUrl}/ca/casos-exit/${slugCa}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
        urls.push({ loc: `${baseUrl}/en/case-studies/${slugEn}`, lastmod, changefreq: 'monthly', priority: '0.9', alternates });
      }
    });
  }

  // 6. Dynamic: published landing pages
  const { data: landings } = await supabase
    .from('landing_pages')
    .select('slug, slug_es, slug_ca, slug_en, updated_at, source_site')
    .eq('is_active', true);

  if (landings) {
    landings.forEach(lp => {
      const lastmod = formatDate(lp.updated_at);
      const slug = lp.slug_es || lp.slug;
      if (isInt) {
        if (lp.slug_en) {
          urls.push({ loc: `${baseUrl}/${lp.slug_en}`, lastmod, changefreq: 'monthly', priority: '0.8' });
        }
      } else {
        urls.push({ loc: `${baseUrl}/${slug}`, lastmod, changefreq: 'monthly', priority: '0.8' });
        if (lp.slug_ca) urls.push({ loc: `${baseUrl}/${lp.slug_ca}`, lastmod, changefreq: 'monthly', priority: '0.7' });
        if (lp.slug_en) urls.push({ loc: `${baseUrl}/${lp.slug_en}`, lastmod, changefreq: 'monthly', priority: '0.7' });
      }
    });
  }

  // Build XML
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  const xmlBody = urls.map(url => createUrlEntry(url)).join('\n');
  const xmlFooter = '\n</urlset>';

  console.log(`✅ Sitemap for ${domain}: ${urls.length} URLs`);
  return xmlHeader + xmlBody + xmlFooter;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Detect domain from query param or Host header
    const url = new URL(req.url);
    const domain = url.searchParams.get('domain') || req.headers.get('host') || 'nrro.es';

    const xmlContent = await generateSitemap(domain);

    return new Response(xmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
