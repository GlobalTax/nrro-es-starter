import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://zntotcpagkunvkwpubqu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudG90Y3BhZ2t1bnZrd3B1YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc5MDUsImV4cCI6MjA2ODUwMzkwNX0.YaVxgYF91UyCkSc8nqsVSACP2Xs4r5--sE8EtLnzMCI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const BASE_URL = 'https://nrro.es';

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

// Rutas estáticas con traducciones
const staticRoutes: RouteConfig[] = [
  { es: '/', ca: '/ca/', en: '/en/', priority: '1.0', changefreq: 'weekly' },
  { es: '/servicios', ca: '/ca/serveis', en: '/en/services', priority: '0.9', changefreq: 'weekly' },
  { es: '/nosotros', ca: '/ca/nosaltres', en: '/en/about', priority: '0.8', changefreq: 'monthly' },
  { es: '/equipo', ca: '/ca/equip', en: '/en/team', priority: '0.8', changefreq: 'monthly' },
  { es: '/casos-exito', ca: '/ca/casos-exit', en: '/en/case-studies', priority: '0.9', changefreq: 'weekly' },
  { es: '/blog', ca: '/ca/blog', en: '/en/blog', priority: '0.9', changefreq: 'daily' },
  { es: '/contacto', ca: '/ca/contacte', en: '/en/contact', priority: '0.8', changefreq: 'monthly' },
  { es: '/talento', ca: '/ca/talent', en: '/en/careers', priority: '0.7', changefreq: 'weekly' },
  { es: '/metodologia', ca: '/ca/metodologia', en: '/en/methodology', priority: '0.7', changefreq: 'monthly' },
  { es: '/ley-beckham', ca: '/ca/llei-beckham', en: '/en/beckham-law', priority: '0.8', changefreq: 'monthly' },
  { es: '/orquest-kairoshr', ca: '/ca/orquest-kairoshr', en: '/en/orquest-kairoshr', priority: '0.8', changefreq: 'monthly' },
  { es: '/privacidad', ca: '/ca/privacitat', en: '/en/privacy', priority: '0.5', changefreq: 'yearly' },
  { es: '/aviso-legal', ca: '/ca/avis-legal', en: '/en/legal-notice', priority: '0.5', changefreq: 'yearly' },
  { es: '/cookies', ca: '/ca/cookies', en: '/en/cookies', priority: '0.5', changefreq: 'yearly' },
  { es: '/condiciones-contratacion', ca: '/ca/condicions-contractacio', en: '/en/terms', priority: '0.5', changefreq: 'yearly' },
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

async function generateSitemap() {
  console.log('🚀 Iniciando generación de sitemap...\n');
  
  const urls: SitemapUrl[] = [];
  const today = formatDate(new Date().toISOString());
  
  // 1. Agregar rutas estáticas
  console.log('📄 Procesando rutas estáticas...');
  staticRoutes.forEach(route => {
    const alternates = [
      { lang: 'es', href: `${BASE_URL}${route.es}` },
      { lang: 'ca', href: `${BASE_URL}${route.ca}` },
      { lang: 'en', href: `${BASE_URL}${route.en}` }
    ];
    
    // Agregar URL en español
    urls.push({
      loc: `${BASE_URL}${route.es}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
      alternates
    });
    
    // Agregar URL en catalán
    urls.push({
      loc: `${BASE_URL}${route.ca}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
      alternates
    });
    
    // Agregar URL en inglés
    urls.push({
      loc: `${BASE_URL}${route.en}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
      alternates
    });
  });
  console.log(`  ✅ ${staticRoutes.length * 3} URLs estáticas agregadas`);
  
  // 2. Agregar servicios dinámicos
  console.log('\n🔧 Procesando servicios...');
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('slug_es, slug_ca, slug_en, updated_at')
      .eq('is_active', true);
    
    if (error) throw error;
    
    if (services && services.length > 0) {
      services.forEach(service => {
        const lastmod = formatDate(service.updated_at);
        const slugCa = service.slug_ca || service.slug_es;
        const slugEn = service.slug_en || service.slug_es;
        
        const alternates = [
          { lang: 'es', href: `${BASE_URL}/servicios/${service.slug_es}` },
          { lang: 'ca', href: `${BASE_URL}/ca/serveis/${slugCa}` },
          { lang: 'en', href: `${BASE_URL}/en/services/${slugEn}` }
        ];
        
        urls.push({
          loc: `${BASE_URL}/servicios/${service.slug_es}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.9',
          alternates
        });
        
        urls.push({
          loc: `${BASE_URL}/ca/serveis/${slugCa}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.9',
          alternates
        });
        
        urls.push({
          loc: `${BASE_URL}/en/services/${slugEn}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.9',
          alternates
        });
      });
      console.log(`  ✅ ${services.length * 3} URLs de servicios agregadas`);
    }
  } catch (error) {
    console.error('  ❌ Error al obtener servicios:', error);
  }
  
  // 3. Agregar blog posts
  console.log('\n📝 Procesando blog posts...');
  try {
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('slug_es, slug_ca, slug_en, published_at, updated_at')
      .eq('status', 'published');
    
    if (error) throw error;
    
    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach(post => {
        const lastmod = formatDate(post.updated_at || post.published_at);
        const slugCa = post.slug_ca || post.slug_es;
        const slugEn = post.slug_en || post.slug_es;
        
        const alternates = [
          { lang: 'es', href: `${BASE_URL}/blog/${post.slug_es}` },
          { lang: 'ca', href: `${BASE_URL}/ca/blog/${slugCa}` },
          { lang: 'en', href: `${BASE_URL}/en/blog/${slugEn}` }
        ];
        
        urls.push({
          loc: `${BASE_URL}/blog/${post.slug_es}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.8',
          alternates
        });
        
        urls.push({
          loc: `${BASE_URL}/ca/blog/${slugCa}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.8',
          alternates
        });
        
        urls.push({
          loc: `${BASE_URL}/en/blog/${slugEn}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.8',
          alternates
        });
      });
      console.log(`  ✅ ${blogPosts.length * 3} URLs de blog posts agregadas`);
    }
  } catch (error) {
    console.error('  ❌ Error al obtener blog posts:', error);
  }
  
  // 4. Agregar case studies
  console.log('\n📊 Procesando case studies...');
  try {
    const { data: caseStudies, error } = await supabase
      .from('case_studies')
      .select('slug_es, slug_ca, slug_en, published_at, updated_at')
      .eq('status', 'published');
    
    if (error) throw error;
    
    if (caseStudies && caseStudies.length > 0) {
      caseStudies.forEach(caseStudy => {
        const lastmod = formatDate(caseStudy.updated_at || caseStudy.published_at);
        const slugCa = caseStudy.slug_ca || caseStudy.slug_es;
        const slugEn = caseStudy.slug_en || caseStudy.slug_es;
        
        const alternates = [
          { lang: 'es', href: `${BASE_URL}/casos-exito/${caseStudy.slug_es}` },
          { lang: 'ca', href: `${BASE_URL}/ca/casos-exit/${slugCa}` },
          { lang: 'en', href: `${BASE_URL}/en/case-studies/${slugEn}` }
        ];
        
        urls.push({
          loc: `${BASE_URL}/casos-exito/${caseStudy.slug_es}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.9',
          alternates
        });
        
        urls.push({
          loc: `${BASE_URL}/ca/casos-exit/${slugCa}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.9',
          alternates
        });
        
        urls.push({
          loc: `${BASE_URL}/en/case-studies/${slugEn}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.9',
          alternates
        });
      });
      console.log(`  ✅ ${caseStudies.length * 3} URLs de case studies agregadas`);
    }
  } catch (error) {
    console.error('  ❌ Error al obtener case studies:', error);
  }
  
  // 5. Generar XML
  console.log('\n📦 Generando XML...');
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  const xmlFooter = `\n</urlset>`;
  const xmlBody = urls.map(url => createUrlEntry(url)).join('\n');
  const xml = xmlHeader + xmlBody + xmlFooter;
  
  // 6. Guardar archivo
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  
  console.log('\n✅ Sitemap generado exitosamente!');
  console.log(`📍 Ubicación: ${sitemapPath}`);
  console.log(`📊 Total de URLs: ${urls.length}`);
  console.log(`🌍 URLs por idioma: ${urls.length / 3}`);
  console.log('\n🔍 Desglose:');
  console.log(`   - Rutas estáticas: ${staticRoutes.length * 3}`);
  console.log(`   - Servicios: ~${Math.floor((urls.length - staticRoutes.length * 3) / 3 * 0.3)}`);
  console.log(`   - Blog posts: ~${Math.floor((urls.length - staticRoutes.length * 3) / 3 * 0.5)}`);
  console.log(`   - Case studies: ~${Math.floor((urls.length - staticRoutes.length * 3) / 3 * 0.2)}`);
}

// Ejecutar script
generateSitemap().catch(error => {
  console.error('\n❌ Error al generar sitemap:', error);
  process.exit(1);
});
