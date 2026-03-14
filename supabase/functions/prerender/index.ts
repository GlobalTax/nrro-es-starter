import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SITE_URL = 'https://nrro.es';

// Inline route registry (edge functions can't import from src/)
// This is a simplified version — the full registry lives in src/data/siteRoutes.ts
interface RegistryRoute {
  path: string;
  title: string;
  description: string;
  h1: string;
  internalLinks: string[];
  priority: string;
  changefreq: string;
}

// We'll load from the prerender_cache or use the embedded fallback
const REGISTRY_ROUTES: RegistryRoute[] = [
  { path: '/', title: 'NRRO | Navarro Tax & Legal — Asesoría Fiscal, Contable, Laboral y Legal en Barcelona', description: 'Asesoría integral en Barcelona: fiscal, contable, laboral, legal y M&A. +60 profesionales al servicio de empresas y autónomos.', h1: 'Navarro Tax & Legal — Asesoría Fiscal, Contable, Laboral y Legal en Barcelona', internalLinks: ['/servicios', '/contacto', '/equipo', '/blog', '/casos-exito'], priority: '1.0', changefreq: 'weekly' },
  { path: '/servicios', title: 'Servicios — Asesoría Fiscal, Contable, Laboral y Legal | NRRO', description: 'Servicios integrales de asesoría fiscal, contable, laboral y legal para empresas en Barcelona.', h1: 'Servicios de Asesoría Fiscal, Contable, Laboral y Legal', internalLinks: ['/servicios/asesoramiento-fiscal', '/servicios/contabilidad', '/servicios/asesoria-laboral', '/servicios/asesoria-legal'], priority: '0.9', changefreq: 'weekly' },
  { path: '/contacto', title: 'Contacto | NRRO Navarro Tax & Legal Barcelona', description: 'Contacta con NRRO Navarro Tax & Legal. Oficinas en Barcelona.', h1: 'Contacto — Navarro Tax & Legal', internalLinks: ['/servicios', '/equipo'], priority: '0.8', changefreq: 'monthly' },
  { path: '/equipo', title: 'Nuestro Equipo | NRRO Navarro Tax & Legal', description: 'Conoce al equipo de +60 profesionales de NRRO Navarro Tax & Legal.', h1: 'Nuestro Equipo', internalLinks: ['/contacto', '/nosotros'], priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', title: 'Blog | NRRO Navarro Tax & Legal', description: 'Artículos sobre fiscalidad, derecho laboral, mercantil y novedades legales.', h1: 'Blog — Navarro Tax & Legal', internalLinks: ['/servicios', '/contacto'], priority: '0.9', changefreq: 'daily' },
  { path: '/casos-exito', title: 'Casos de Éxito | NRRO Navarro Tax & Legal', description: 'Casos de éxito de NRRO: operaciones M&A, planificación fiscal y asesoramiento empresarial.', h1: 'Casos de Éxito', internalLinks: ['/servicios', '/contacto'], priority: '0.9', changefreq: 'weekly' },
  { path: '/nosotros', title: 'Sobre Nosotros | NRRO Navarro Tax & Legal', description: 'Conoce NRRO Navarro Tax & Legal, asesoría integral en Barcelona.', h1: 'Sobre Nosotros', internalLinks: ['/equipo', '/contacto'], priority: '0.8', changefreq: 'monthly' },
  { path: '/carreras', title: 'Trabaja con Nosotros | NRRO Navarro Tax & Legal', description: 'Únete al equipo de NRRO Navarro Tax & Legal.', h1: 'Trabaja con Nosotros', internalLinks: ['/equipo', '/contacto'], priority: '0.7', changefreq: 'weekly' },
  { path: '/ley-beckham', title: 'Ley Beckham España — Régimen Fiscal para Impatriados | NRRO', description: 'Guía completa de la Ley Beckham en España.', h1: 'Ley Beckham — Régimen Fiscal para Impatriados en España', internalLinks: ['/contacto'], priority: '0.8', changefreq: 'monthly' },
  { path: '/en', title: 'NRRO | Navarro Tax & Legal — Tax & Legal Advisory in Barcelona', description: 'Full-service advisory in Barcelona: tax, accounting, employment, legal and M&A.', h1: 'Navarro Tax & Legal — Tax & Legal Advisory in Barcelona', internalLinks: ['/en/services', '/en/contact', '/en/blog'], priority: '0.8', changefreq: 'weekly' },
  { path: '/ca', title: 'NRRO | Navarro Tax & Legal — Assessoria Fiscal i Legal a Barcelona', description: "Assessoria integral a Barcelona: fiscal, comptable, laboral, legal i M&A.", h1: 'Navarro Tax & Legal — Assessoria Fiscal i Legal a Barcelona', internalLinks: ['/ca/serveis', '/ca/contacte', '/ca/blog'], priority: '0.8', changefreq: 'weekly' },
];

function validatePath(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.includes('@')) return false;
  if (path.includes('//')) return false;
  if (path.includes('\\')) return false;
  if (/^\/[a-z]+:/i.test(path)) return false; // protocol schemes
  if (path.length > 500) return false;
  return true;
}

function extractFromHtml(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
    || html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  
  // Extract internal links
  const linkMatches = [...html.matchAll(/<a\s[^>]*href=["'](\/[^"'#]*|https?:\/\/nrro\.es[^"'#]*)["'][^>]*>/gi)];
  const internalLinks = linkMatches
    .map(m => {
      let href = m[1];
      if (href.startsWith('https://nrro.es')) href = href.replace('https://nrro.es', '');
      return href || '/';
    })
    .filter((v, i, a) => a.indexOf(v) === i); // dedupe

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    meta_description: descMatch ? descMatch[1].trim() : null,
    h1: h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null,
    h2s: h2Matches,
    internal_links: internalLinks,
  };
}

function computeHealth(data: { title: string | null; meta_description: string | null; h1: string | null; internal_links: string[] }): string {
  const hasTitle = !!data.title && data.title.length > 5;
  const hasDesc = !!data.meta_description && data.meta_description.length > 10;
  const hasH1 = !!data.h1 && data.h1.length > 2;
  const hasLinks = data.internal_links.length > 0;

  if (hasTitle && hasDesc && hasH1 && hasLinks) return 'green';
  if (hasTitle && (hasDesc || hasH1)) return 'yellow';
  return 'red';
}

async function verifyAdmin(req: Request, supabaseUrl: string, serviceKey: string): Promise<{ valid: boolean; userId?: string }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return { valid: false };

  const token = authHeader.replace('Bearer ', '');
  const adminClient = createClient(supabaseUrl, serviceKey);
  
  const { data: { user }, error } = await adminClient.auth.getUser(token);
  if (error || !user) return { valid: false };

  const { data: roles } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const userRoles = roles?.map(r => r.role) || [];
  const allowed = ['admin', 'editor', 'marketing'];
  if (!userRoles.some(r => allowed.includes(r))) return { valid: false };

  return { valid: true, userId: user.id };
}

async function checkRateLimit(adminClient: any, userId: string, category: string, maxRequests: number, windowMinutes: number): Promise<boolean> {
  const { data } = await adminClient.rpc('check_rate_limit_enhanced_safe', {
    p_identifier: userId,
    p_category: category,
    p_max_requests: maxRequests,
    p_window_minutes: windowMinutes,
  });
  return data !== false;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    // Auth check
    const auth = await verifyAdmin(req, supabaseUrl, serviceKey);
    if (!auth.valid) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const url = new URL(req.url);
    const path = url.searchParams.get('path');
    const refresh = url.searchParams.get('refresh') === 'true';
    const bulk = url.searchParams.get('bulk') === 'true';

    // Bulk mode: scan all routes
    if (bulk) {
      const withinLimit = await checkRateLimit(adminClient, auth.userId!, 'prerender_bulk', 5, 60);
      if (!withinLimit) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded (5 bulk scans/hour)' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const results: any[] = [];
      for (const route of REGISTRY_ROUTES) {
        const result = await scanSinglePath(route.path, adminClient, false);
        results.push(result);
      }

      return new Response(JSON.stringify({ success: true, scanned: results.length, results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Single path mode
    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing ?path= parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!validatePath(path)) {
      return new Response(JSON.stringify({ error: 'Invalid path (SSRF prevention)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const withinLimit = await checkRateLimit(adminClient, auth.userId!, 'prerender_single', 60, 60);
    if (!withinLimit) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded (60 scans/hour)' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check cache first (unless refresh)
    if (!refresh) {
      const { data: cached } = await adminClient
        .from('prerender_cache')
        .select('*')
        .eq('path', path)
        .single();

      if (cached && cached.rendered_at) {
        const age = Date.now() - new Date(cached.rendered_at).getTime();
        if (age < 3600000) { // 1 hour
          return new Response(JSON.stringify({ source: 'cache', ...cached }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    const result = await scanSinglePath(path, adminClient, true);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[PRERENDER] Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function scanSinglePath(path: string, adminClient: any, saveToCache: boolean) {
  const notes: string[] = [];
  let source = 'fetched';
  let extracted = { title: null as string | null, meta_description: null as string | null, h1: null as string | null, h2s: [] as string[], internal_links: [] as string[] };

  try {
    // Try fetching the actual page
    const fetchUrl = `${SITE_URL}${path}`;
    const response = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'NRRO-Prerender-Scanner/1.0' },
      redirect: 'follow',
    });

    if (response.ok) {
      const html = await response.text();
      
      // Check if we got SPA shell (empty root div)
      const isEmptyShell = html.includes('<div id="root"></div>') || 
                           (html.includes('<div id="root">') && !html.includes('<h1'));
      
      if (isEmptyShell) {
        notes.push('SPA shell detected — falling back to registry metadata');
        source = 'registry';
      } else {
        extracted = extractFromHtml(html);
        notes.push('HTML fetched and parsed successfully');
        
        // Check what was found
        if (extracted.title) notes.push(`Title found: "${extracted.title.substring(0, 60)}..."`);
        if (extracted.meta_description) notes.push('Meta description found');
        if (extracted.h1) notes.push(`H1 found: "${extracted.h1.substring(0, 60)}"`);
        notes.push(`${extracted.h2s.length} H2s found, ${extracted.internal_links.length} internal links found`);
      }
    } else {
      notes.push(`HTTP ${response.status} — falling back to registry`);
      source = 'registry';
    }
  } catch (fetchError: any) {
    notes.push(`Fetch failed: ${fetchError.message} — falling back to registry`);
    source = 'registry';
  }

  // Fallback to registry
  if (source === 'registry') {
    const registryRoute = REGISTRY_ROUTES.find(r => r.path === path);
    if (registryRoute) {
      extracted = {
        title: extracted.title || registryRoute.title,
        meta_description: extracted.meta_description || registryRoute.description,
        h1: extracted.h1 || registryRoute.h1,
        h2s: extracted.h2s.length > 0 ? extracted.h2s : [],
        internal_links: extracted.internal_links.length > 0 ? extracted.internal_links : registryRoute.internalLinks,
      };
      notes.push('Registry fallback applied for missing fields');
    } else {
      notes.push('Path not found in registry — no fallback available');
    }
  }

  const health = computeHealth(extracted);

  const record = {
    path,
    title: extracted.title,
    meta_description: extracted.meta_description,
    h1: extracted.h1,
    h2s: extracted.h2s,
    internal_links: extracted.internal_links,
    internal_link_count: extracted.internal_links.length,
    status: 'scanned',
    rendered_at: new Date().toISOString(),
    source,
    health,
    extraction_notes: notes,
    full_record: !!(extracted.title && extracted.meta_description && extracted.h1),
  };

  if (saveToCache) {
    await adminClient
      .from('prerender_cache')
      .upsert(record, { onConflict: 'path' });
  }

  return record;
}
