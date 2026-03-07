import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ── Checklist definition (mirrors client-side marketingAuditChecklist.ts) ──
const createDefaultChecklist = () => [
  {
    id: 'seo-onpage', name: 'SEO On-Page', icon: 'Search', weight: 20, score: 0,
    items: [
      { id: 'title-tag', label: 'Title Tag', description: '', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'meta-description', label: 'Meta Description', description: '', status: 'pending', note: '', weight: 8, autoDetectable: true },
      { id: 'headings', label: 'Estructura H1-H6', description: '', status: 'pending', note: '', weight: 8, autoDetectable: true },
      { id: 'keywords', label: 'Keywords', description: '', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'urls', label: 'URLs amigables', description: '', status: 'pending', note: '', weight: 6, autoDetectable: true },
      { id: 'alt-tags', label: 'Alt Tags en imágenes', description: '', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'internal-links', label: 'Enlaces internos', description: '', status: 'pending', note: '', weight: 6, autoDetectable: true },
      { id: 'canonical', label: 'Canonical Tags', description: '', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'schema', label: 'Schema Markup', description: '', status: 'pending', note: '', weight: 8, autoDetectable: true },
      { id: 'duplicate-content', label: 'Contenido duplicado', description: '', status: 'pending', note: '', weight: 6, autoDetectable: false },
    ],
  },
  {
    id: 'seo-technical', name: 'SEO Técnico', icon: 'Settings', weight: 20, score: 0,
    items: [
      { id: 'core-web-vitals', label: 'Core Web Vitals', description: '', status: 'pending', note: '', weight: 9, autoDetectable: false },
      { id: 'mobile-friendly', label: 'Mobile-friendly', description: '', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'ssl', label: 'Certificado SSL', description: '', status: 'pending', note: '', weight: 10, autoDetectable: true },
      { id: 'sitemap', label: 'Sitemap XML', description: '', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'robots-txt', label: 'Robots.txt', description: '', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'errors-404', label: 'Errores 404', description: '', status: 'pending', note: '', weight: 6, autoDetectable: false },
      { id: 'indexation', label: 'Indexación', description: '', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'hreflang', label: 'Hreflang', description: '', status: 'pending', note: '', weight: 5, autoDetectable: true },
      { id: 'compression', label: 'Compresión', description: '', status: 'pending', note: '', weight: 6, autoDetectable: false },
      { id: 'lazy-loading', label: 'Lazy Loading', description: '', status: 'pending', note: '', weight: 5, autoDetectable: true },
      { id: 'image-formats', label: 'Formatos de imagen', description: '', status: 'pending', note: '', weight: 5, autoDetectable: true },
    ],
  },
  {
    id: 'content', name: 'Contenido y Copywriting', icon: 'FileText', weight: 15, score: 0,
    items: [
      { id: 'content-quality', label: 'Calidad del contenido', description: '', status: 'pending', note: '', weight: 9, autoDetectable: false },
      { id: 'readability', label: 'Legibilidad', description: '', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'ctas', label: 'CTAs claros', description: '', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'value-proposition', label: 'Propuesta de valor', description: '', status: 'pending', note: '', weight: 9, autoDetectable: false },
      { id: 'blog-frequency', label: 'Blog / Frecuencia', description: '', status: 'pending', note: '', weight: 6, autoDetectable: false },
      { id: 'evergreen', label: 'Contenido Evergreen', description: '', status: 'pending', note: '', weight: 5, autoDetectable: false },
      { id: 'multimedia', label: 'Multimedia', description: '', status: 'pending', note: '', weight: 6, autoDetectable: true },
    ],
  },
  {
    id: 'ux-cro', name: 'UX y Conversión (CRO)', icon: 'MousePointer', weight: 15, score: 0,
    items: [
      { id: 'navigation', label: 'Navegación', description: '', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'forms', label: 'Formularios', description: '', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'interaction-speed', label: 'Velocidad de interacción', description: '', status: 'pending', note: '', weight: 6, autoDetectable: false },
      { id: 'responsive', label: 'Diseño responsive', description: '', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'cta-buttons', label: 'Botones CTA', description: '', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'chat', label: 'Chat en vivo', description: '', status: 'pending', note: '', weight: 4, autoDetectable: true },
      { id: 'trust-signals', label: 'Trust Signals', description: '', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'custom-404', label: 'Página 404', description: '', status: 'pending', note: '', weight: 3, autoDetectable: false },
    ],
  },
  {
    id: 'analytics', name: 'Analítica y Tracking', icon: 'BarChart3', weight: 10, score: 0,
    items: [
      { id: 'ga4', label: 'Google Analytics 4', description: '', status: 'pending', note: '', weight: 10, autoDetectable: true },
      { id: 'gtm', label: 'Google Tag Manager', description: '', status: 'pending', note: '', weight: 8, autoDetectable: true },
      { id: 'meta-pixel', label: 'Pixel de Meta', description: '', status: 'pending', note: '', weight: 6, autoDetectable: true },
      { id: 'linkedin-tag', label: 'LinkedIn Insight Tag', description: '', status: 'pending', note: '', weight: 5, autoDetectable: true },
      { id: 'events', label: 'Eventos / Conversiones', description: '', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'search-console', label: 'Search Console', description: '', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'heatmaps', label: 'Hotjar / Clarity', description: '', status: 'pending', note: '', weight: 5, autoDetectable: true },
    ],
  },
  {
    id: 'offpage', name: 'Presencia Digital y Off-Page', icon: 'Globe', weight: 10, score: 0,
    items: [
      { id: 'google-business', label: 'Google Business', description: '', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'nap', label: 'Coherencia NAP', description: '', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'social-media', label: 'Redes sociales', description: '', status: 'pending', note: '', weight: 6, autoDetectable: true },
      { id: 'backlinks', label: 'Backlinks', description: '', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'brand-mentions', label: 'Menciones de marca', description: '', status: 'pending', note: '', weight: 5, autoDetectable: false },
      { id: 'directories', label: 'Directorios', description: '', status: 'pending', note: '', weight: 4, autoDetectable: false },
    ],
  },
  {
    id: 'legal', name: 'Legal y Compliance', icon: 'Shield', weight: 10, score: 0,
    items: [
      { id: 'legal-notice', label: 'Aviso Legal', description: '', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'privacy-policy', label: 'Política de Privacidad', description: '', status: 'pending', note: '', weight: 10, autoDetectable: true },
      { id: 'cookies-banner', label: 'Banner de Cookies', description: '', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'form-consent', label: 'Consentimiento en formularios', description: '', status: 'pending', note: '', weight: 8, autoDetectable: true },
    ],
  },
];

// ── Analysis logic (mirrors client-side marketingAuditAnalyzer.ts) ──
type AuditItemStatus = 'correct' | 'improvable' | 'missing' | 'pending';

interface ScrapedData {
  html: string;
  markdown: string;
  links: string[];
  metadata: Record<string, any>;
  robotsTxt: string | null;
  sitemapXml: string | null;
  scrapedUrl: string;
}

function analyzeScrapedData(data: ScrapedData, categories: any[]): any[] {
  const html = data.html || '';
  const links = data.links || [];
  const url = data.scrapedUrl || '';

  const updated = categories.map(cat => ({
    ...cat,
    items: cat.items.map((item: any) => ({ ...item })),
  }));

  const setItem = (catId: string, itemId: string, status: AuditItemStatus, note: string) => {
    const cat = updated.find((c: any) => c.id === catId);
    if (!cat) return;
    const item = cat.items.find((i: any) => i.id === itemId);
    if (!item) return;
    item.status = status;
    item.autoResult = note;
    item.note = note;
  };

  // Title tag
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    const titleText = titleMatch[1].trim();
    const len = titleText.length;
    if (len >= 30 && len <= 65) setItem('seo-onpage', 'title-tag', 'correct', `Title: ${len} chars`);
    else if (len > 0) setItem('seo-onpage', 'title-tag', 'improvable', `Title: ${len} chars (recomendado: 50-60)`);
  } else {
    setItem('seo-onpage', 'title-tag', 'missing', 'No title tag');
  }

  // Meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  if (metaDescMatch) {
    const len = metaDescMatch[1].trim().length;
    if (len >= 120 && len <= 160) setItem('seo-onpage', 'meta-description', 'correct', `Meta desc: ${len} chars`);
    else if (len > 0) setItem('seo-onpage', 'meta-description', 'improvable', `Meta desc: ${len} chars`);
  } else {
    setItem('seo-onpage', 'meta-description', 'missing', 'No meta description');
  }

  // Headings
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  const h2s = (html.match(/<h2[\s>]/gi) || []).length;
  if (h1s === 1 && h2s > 0) setItem('seo-onpage', 'headings', 'correct', `H1: ${h1s}, H2: ${h2s}`);
  else if (h1s === 0) setItem('seo-onpage', 'headings', 'missing', 'No H1');
  else setItem('seo-onpage', 'headings', 'improvable', `H1: ${h1s}, H2: ${h2s}`);

  // URLs
  try {
    const urlObj = new URL(url);
    const clean = !urlObj.search && /^[a-z0-9\-\/\.]+$/i.test(urlObj.pathname);
    setItem('seo-onpage', 'urls', clean ? 'correct' : 'improvable', clean ? 'URL limpia' : 'URL con parámetros');
  } catch { setItem('seo-onpage', 'urls', 'pending', 'No se pudo analizar'); }

  // Alt tags
  const imgs = html.match(/<img[^>]*>/gi) || [];
  const withAlt = imgs.filter(img => /alt=["'][^"']+["']/i.test(img));
  if (imgs.length === 0) setItem('seo-onpage', 'alt-tags', 'correct', 'Sin imágenes');
  else {
    const ratio = withAlt.length / imgs.length;
    setItem('seo-onpage', 'alt-tags', ratio >= 0.9 ? 'correct' : ratio >= 0.5 ? 'improvable' : 'missing', `${withAlt.length}/${imgs.length} con alt`);
  }

  // Internal links
  let internalCount = 0;
  try {
    const host = new URL(url).hostname;
    internalCount = links.filter(l => { try { return new URL(l).hostname === host; } catch { return false; } }).length;
  } catch {}
  setItem('seo-onpage', 'internal-links', internalCount >= 5 ? 'correct' : internalCount >= 2 ? 'improvable' : 'missing', `${internalCount} internos`);

  // Canonical
  const hasCan = /<link[^>]*rel=["']canonical["']/i.test(html);
  setItem('seo-onpage', 'canonical', hasCan ? 'correct' : 'missing', hasCan ? 'Canonical detectado' : 'Sin canonical');

  // Schema
  const hasSchema = /application\/ld\+json/i.test(html);
  setItem('seo-onpage', 'schema', hasSchema ? 'correct' : 'missing', hasSchema ? 'JSON-LD detectado' : 'Sin schema');

  // SSL
  setItem('seo-technical', 'ssl', url.startsWith('https://') ? 'correct' : 'missing', url.startsWith('https://') ? 'HTTPS' : 'Sin HTTPS');

  // Sitemap
  setItem('seo-technical', 'sitemap', data.sitemapXml ? 'correct' : 'missing', data.sitemapXml ? 'Sitemap encontrado' : 'Sin sitemap');

  // Robots
  setItem('seo-technical', 'robots-txt', data.robotsTxt ? 'correct' : 'missing', data.robotsTxt ? 'Robots.txt encontrado' : 'Sin robots.txt');

  // Viewport
  const hasVP = /<meta[^>]*name=["']viewport["']/i.test(html);
  setItem('seo-technical', 'mobile-friendly', hasVP ? 'correct' : 'improvable', hasVP ? 'Viewport detectado' : 'Sin viewport');

  // Hreflang
  const hasHL = /<link[^>]*hreflang/i.test(html);
  setItem('seo-technical', 'hreflang', hasHL ? 'correct' : 'pending', hasHL ? 'Hreflang detectado' : 'Sin hreflang');

  // Lazy loading
  const hasLazy = /loading=["']lazy["']/i.test(html);
  setItem('seo-technical', 'lazy-loading', hasLazy ? 'correct' : 'improvable', hasLazy ? 'Lazy loading' : 'Sin lazy loading');

  // Modern image formats
  const hasModern = /\.(webp|avif)/i.test(html);
  setItem('seo-technical', 'image-formats', hasModern ? 'correct' : 'improvable', hasModern ? 'WebP/AVIF detectado' : 'Sin formatos modernos');

  // Multimedia
  const hasVideo = /<video|<iframe[^>]*youtube|<iframe[^>]*vimeo/i.test(html);
  setItem('content', 'multimedia', hasVideo ? 'correct' : 'improvable', hasVideo ? 'Video detectado' : 'Sin video');

  // Forms
  const formCount = (html.match(/<form/gi) || []).length;
  setItem('ux-cro', 'forms', formCount > 0 ? 'correct' : 'improvable', formCount > 0 ? `${formCount} formulario(s)` : 'Sin formularios');
  setItem('ux-cro', 'responsive', hasVP ? 'correct' : 'improvable', hasVP ? 'Viewport' : 'Sin viewport');

  // Chat
  const hasChat = /tawk\.to|intercom|drift|crisp|hubspot|livechat|tidio|zendesk/i.test(html);
  setItem('ux-cro', 'chat', hasChat ? 'correct' : 'pending', hasChat ? 'Chat detectado' : 'Sin chat');

  // Analytics
  const hasGA4 = /gtag.*G-|googletagmanager.*G-|google-analytics/i.test(html);
  setItem('analytics', 'ga4', hasGA4 ? 'correct' : 'missing', hasGA4 ? 'GA4 detectado' : 'Sin GA4');
  const hasGTM = /googletagmanager\.com\/gtm/i.test(html);
  setItem('analytics', 'gtm', hasGTM ? 'correct' : 'missing', hasGTM ? 'GTM detectado' : 'Sin GTM');
  const hasMeta = /connect\.facebook\.net|fbq\(|fb-pixel/i.test(html);
  setItem('analytics', 'meta-pixel', hasMeta ? 'correct' : 'pending', hasMeta ? 'Meta Pixel' : 'Sin Meta Pixel');
  const hasLI = /snap\.licdn\.com|linkedin\.com\/px|_linkedin_partner_id/i.test(html);
  setItem('analytics', 'linkedin-tag', hasLI ? 'correct' : 'pending', hasLI ? 'LinkedIn Tag' : 'Sin LinkedIn Tag');
  const hasHM = /hotjar|clarity\.ms|mouseflow|fullstory|lucky ?orange/i.test(html);
  setItem('analytics', 'heatmaps', hasHM ? 'correct' : 'pending', hasHM ? 'Heatmaps detectado' : 'Sin heatmaps');

  // Social
  const socials = ['facebook.com', 'twitter.com', 'x.com', 'linkedin.com', 'instagram.com', 'youtube.com'];
  const found = socials.filter(s => links.some(l => l.includes(s)));
  setItem('offpage', 'social-media', found.length >= 3 ? 'correct' : found.length >= 1 ? 'improvable' : 'missing', `${found.length} redes`);

  // Legal
  const legalKw = ['aviso-legal', 'aviso_legal', 'legal-notice', 'terminos', 'terms'];
  const privKw = ['privacidad', 'privacy', 'politica-de-privacidad'];
  const cookKw = ['cookies', 'cookie-policy'];
  const hasLegal = links.some(l => legalKw.some(k => l.toLowerCase().includes(k)));
  setItem('legal', 'legal-notice', hasLegal ? 'correct' : 'missing', hasLegal ? 'Aviso legal' : 'Sin aviso legal');
  const hasPriv = links.some(l => privKw.some(k => l.toLowerCase().includes(k)));
  setItem('legal', 'privacy-policy', hasPriv ? 'correct' : 'missing', hasPriv ? 'Privacidad' : 'Sin privacidad');
  const hasCookie = /cookie[_-]?banner|cookie[_-]?consent|cookiebot|onetrust|quantcast|klaro|tarteaucitron/i.test(html) ||
    links.some(l => cookKw.some(k => l.toLowerCase().includes(k)));
  setItem('legal', 'cookies-banner', hasCookie ? 'correct' : 'missing', hasCookie ? 'Cookies banner' : 'Sin cookies banner');
  const formHtml = html.match(/<form[\s\S]*?<\/form>/gi) || [];
  const hasCons = formHtml.some(f => /type=["']checkbox["']/i.test(f) && /consent|acepto|privacidad|rgpd|gdpr/i.test(f));
  setItem('legal', 'form-consent', hasCons ? 'correct' : formCount > 0 ? 'improvable' : 'pending', hasCons ? 'Consentimiento' : 'Sin consentimiento');

  return updated;
}

function calculateCategoryScore(items: any[]): number {
  const totalWeight = items.reduce((s: number, i: any) => s + i.weight, 0);
  if (totalWeight === 0) return 0;
  const ws = items.reduce((s: number, i: any) => {
    const sc = i.status === 'correct' ? 1 : i.status === 'improvable' ? 0.5 : i.status === 'missing' ? 0 : 0.25;
    return s + sc * i.weight;
  }, 0);
  return Math.round((ws / totalWeight) * 100);
}

function calculateGlobalScore(cats: any[]): number {
  const tw = cats.reduce((s: number, c: any) => s + c.weight, 0);
  if (tw === 0) return 0;
  return Math.round(cats.reduce((s: number, c: any) => s + c.score * c.weight, 0) / tw);
}

function generateQuickWins(cats: any[]) {
  const failed: any[] = [];
  for (const cat of cats) {
    for (const item of cat.items) {
      if (item.status === 'missing' || item.status === 'improvable') {
        failed.push({
          itemId: item.id, categoryId: cat.id, label: item.label,
          impact: item.weight * (cat.weight / 20),
          description: `[${cat.name}] ${item.autoResult || item.description}`,
        });
      }
    }
  }
  failed.sort((a, b) => b.impact - a.impact);
  return failed.slice(0, 10).map(i => ({
    ...i, impact: Math.round(i.impact),
    effort: i.impact > 7 ? 'low' : i.impact > 4 ? 'medium' : 'high',
  }));
}

function generateRecommendations(cats: any[]) {
  const recs: any[] = [];
  for (const cat of cats) {
    if (cat.score < 50) {
      recs.push({ title: `Mejorar ${cat.name}`, description: `Puntuación ${cat.score}/100`, priority: 'high', timeframe: 'short', category: cat.id });
    } else if (cat.score < 75) {
      recs.push({ title: `Optimizar ${cat.name}`, description: `Puntuación ${cat.score}/100`, priority: 'medium', timeframe: 'medium', category: cat.id });
    }
  }
  return recs;
}

// ── Scrape a URL using Firecrawl ──
async function scrapeUrl(url: string, apiKey: string): Promise<ScrapedData> {
  let formattedUrl = url.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }

  const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: formattedUrl, formats: ['html', 'links', 'markdown'], onlyMainContent: false, waitFor: 3000 }),
  });
  const scrapeData = await scrapeRes.json();
  if (!scrapeRes.ok) throw new Error(scrapeData.error || 'Firecrawl scrape failed');

  let robotsTxt = null;
  try {
    const base = new URL(formattedUrl);
    const r = await fetch(`${base.origin}/robots.txt`, { signal: AbortSignal.timeout(5000) });
    if (r.ok) robotsTxt = await r.text();
  } catch {}

  let sitemapXml = null;
  try {
    const base = new URL(formattedUrl);
    const s = await fetch(`${base.origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
    if (s.ok) {
      const txt = await s.text();
      if (txt.includes('<urlset') || txt.includes('<sitemapindex')) sitemapXml = txt.substring(0, 5000);
    }
  } catch {}

  return {
    html: scrapeData.data?.html || scrapeData.html || '',
    markdown: scrapeData.data?.markdown || scrapeData.markdown || '',
    links: scrapeData.data?.links || scrapeData.links || [],
    metadata: scrapeData.data?.metadata || scrapeData.metadata || {},
    robotsTxt, sitemapXml, scrapedUrl: formattedUrl,
  };
}

// ── Run full audit for a single URL and persist ──
async function auditAndSave(url: string, firecrawlKey: string, supabase: any) {
  console.log(`Auto-audit: scraping ${url}`);
  const scraped = await scrapeUrl(url, firecrawlKey);

  let categories = createDefaultChecklist();
  categories = analyzeScrapedData(scraped, categories);
  categories = categories.map(c => ({ ...c, score: calculateCategoryScore(c.items) }));
  const globalScore = calculateGlobalScore(categories);
  const quickWins = generateQuickWins(categories);
  const recommendations = generateRecommendations(categories);

  const categoryScores: Record<string, number> = {};
  categories.forEach(c => { categoryScores[c.id] = c.score; });

  const { data: inserted, error } = await supabase.from('marketing_audits').insert({
    url,
    global_score: globalScore,
    category_scores: categoryScores,
    checklist_data: categories,
    quick_wins: quickWins,
    recommendations,
    raw_analysis: { metadata: scraped.metadata, linksCount: scraped.links.length },
  }).select('id, global_score').single();

  if (error) {
    console.error('Error saving audit:', error);
    throw error;
  }

  console.log(`Auto-audit: ${url} → score ${globalScore}, id ${inserted.id}`);
  return inserted;
}

// ── Main handler ──
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      return new Response(JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const mode = body.mode || 'single';

    if (mode === 'single') {
      // Single URL audit (triggered by new lead or manual call)
      const url = body.url;
      if (!url) {
        return new Response(JSON.stringify({ success: false, error: 'URL required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const result = await auditAndSave(url, firecrawlKey, supabase);
      return new Response(JSON.stringify({ success: true, data: result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else if (mode === 'cron') {
      // CRON mode: audit all active scheduled URLs that are due
      const { data: schedules, error: schedErr } = await supabase
        .from('audit_schedule')
        .select('*')
        .eq('is_active', true);

      if (schedErr) throw schedErr;

      const now = new Date();
      const results: any[] = [];

      for (const sched of (schedules || [])) {
        // Check if due
        if (sched.last_audit_at) {
          const last = new Date(sched.last_audit_at);
          const daysSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
          if (sched.frequency === 'weekly' && daysSince < 6.5) continue;
          if (sched.frequency === 'monthly' && daysSince < 28) continue;
        }

        try {
          const result = await auditAndSave(sched.url, firecrawlKey, supabase);

          // Update schedule record
          await supabase.from('audit_schedule').update({
            last_audit_at: now.toISOString(),
            last_score: result.global_score,
            last_audit_id: result.id,
          }).eq('id', sched.id);

          results.push({ url: sched.url, score: result.global_score, audit_id: result.id });

          // Delay between audits to respect rate limits
          await new Promise(r => setTimeout(r, 3000));
        } catch (err) {
          console.error(`Auto-audit failed for ${sched.url}:`, err);
          results.push({ url: sched.url, error: String(err) });
        }
      }

      return new Response(JSON.stringify({ success: true, audited: results.length, results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid mode' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Auto-marketing-audit error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
