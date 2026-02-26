const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * SEO Prerender Edge Function
 * 
 * Generates a fully-formed HTML page with correct meta tags, schema markup,
 * and basic content for any route. Designed to be consumed by:
 * 1. A Cloudflare Worker / prerender proxy that detects bot user-agents
 * 2. Direct access via sitemap for search engine crawlers
 * 
 * Usage: GET /functions/v1/seo-prerender?path=/es/asesoria-fiscal-barcelona
 */

const BASE = 'https://nrro.es';
const OG_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/VFsaCkJPcQelq90qCBepitB6wDA2/social-images/social-1762003818234-navarro.jpg';

// Inline route map to avoid import issues in Edge Functions
interface RouteData {
  title: string;
  description: string;
  canonical: string;
  hreflang?: { lang: string; href: string }[];
  keywords?: string;
  bodyContent?: string;
}

const routes: Record<string, RouteData> = {
  '/': {
    title: 'NRRO | Navarro Tax & Legal — Asesoría Fiscal y Legal en Barcelona',
    description: 'Asesoría fiscal, contable, laboral y legal en Barcelona. Más de 25 años de experiencia con empresas y familias empresarias.',
    canonical: `${BASE}/`,
    hreflang: [
      { lang: 'es', href: `${BASE}/` },
      { lang: 'ca', href: `${BASE}/ca/` },
      { lang: 'en', href: `${BASE}/en/` },
      { lang: 'x-default', href: `${BASE}/` },
    ],
    keywords: 'asesoría fiscal barcelona, asesoría legal barcelona, navarro tax legal, NRRO',
    bodyContent: `
      <h1>Navarro Tax & Legal — Asesoría Fiscal, Contable, Laboral y Legal en Barcelona</h1>
      <p>Más de 25 años asesorando a empresas y familias empresarias. Planificación fiscal, derecho societario, nóminas, compliance y expansión internacional.</p>
      <h2>Nuestros Servicios</h2>
      <ul>
        <li><a href="${BASE}/es/asesoria-fiscal-barcelona">Asesoría Fiscal</a> — Planificación fiscal, declaraciones, inspecciones y fiscalidad internacional</li>
        <li><a href="${BASE}/es/asesoria-contable-barcelona">Asesoría Contable</a> — Contabilidad general, cuentas anuales y reporting financiero</li>
        <li><a href="${BASE}/es/asesoria-laboral-barcelona">Asesoría Laboral</a> — Contratos, nóminas, Seguridad Social y movilidad internacional</li>
        <li><a href="${BASE}/es/asesoria-mercantil-barcelona">Asesoría Mercantil</a> — Derecho societario, pactos de socios y gobierno corporativo</li>
        <li><a href="${BASE}/es/orientacion-global">Orientación Global</a> — Expansión internacional y fiscalidad transfronteriza</li>
        <li><a href="${BASE}/es/empresa-familiar">Empresa Familiar</a> — Protocolo familiar, sucesión y holding</li>
      </ul>
      <h2>Contacto</h2>
      <p>Ausiàs March 36, Principal, 08010 Barcelona. Tel: <a href="tel:+34934593600">+34 93 459 36 00</a>. Email: <a href="mailto:info@nrro.es">info@nrro.es</a></p>
    `,
  },
  '/servicios': {
    title: 'Servicios — Asesoría Fiscal, Contable, Laboral y Legal | NRRO',
    description: 'Servicios integrales de asesoría fiscal, contable, laboral y legal para empresas en Barcelona.',
    canonical: `${BASE}/servicios`,
    hreflang: [
      { lang: 'es', href: `${BASE}/servicios` },
      { lang: 'ca', href: `${BASE}/ca/serveis` },
      { lang: 'en', href: `${BASE}/en/services` },
    ],
    bodyContent: `
      <h1>Servicios de Asesoría Fiscal, Contable, Laboral y Legal</h1>
      <p>Navarro Tax & Legal ofrece servicios integrales para empresas en Barcelona: planificación fiscal, contabilidad, gestión laboral, derecho mercantil, compliance y fiscalidad internacional.</p>
    `,
  },
  '/es/asesoria-fiscal-barcelona': {
    title: 'Asesoría Fiscal en Barcelona — Planificación y Gestión Tributaria | NRRO',
    description: 'Asesoría fiscal en Barcelona: planificación fiscal, gestión AEAT, declaraciones (IVA, IS, IRPF, Patrimonio), inspecciones y fiscalidad internacional.',
    canonical: `${BASE}/es/asesoria-fiscal-barcelona`,
    keywords: 'asesoría fiscal barcelona, asesor fiscal barcelona, planificación fiscal',
    hreflang: [
      { lang: 'es', href: `${BASE}/es/asesoria-fiscal-barcelona` },
      { lang: 'en', href: `${BASE}/en/tax-advisor-barcelona` },
    ],
    bodyContent: `
      <h1>Asesoría Fiscal en Barcelona</h1>
      <p>Servicios de asesoría fiscal integral: planificación fiscal estratégica, gestión ante la AEAT, declaraciones tributarias (IVA, Impuesto de Sociedades, IRPF, Patrimonio, modelos 200/202/210/216/296, SII), defensa en inspecciones fiscales y fiscalidad internacional.</p>
      <h2>Nuestros servicios fiscales</h2>
      <ul>
        <li>Planificación fiscal para empresas y particulares</li>
        <li>Declaraciones de IVA, IS, IRPF y Patrimonio</li>
        <li>Inspecciones y procedimientos tributarios</li>
        <li>Fiscalidad internacional y transfer pricing</li>
        <li>Empresa familiar y sucesión</li>
      </ul>
    `,
  },
  '/es/asesoria-contable-barcelona': {
    title: 'Asesoría Contable en Barcelona — Contabilidad para Empresas | NRRO',
    description: 'Servicios de asesoría contable en Barcelona: contabilidad general, cuentas anuales, reporting financiero.',
    canonical: `${BASE}/es/asesoria-contable-barcelona`,
    bodyContent: `<h1>Asesoría Contable en Barcelona</h1><p>Contabilidad general, cuentas anuales, reporting financiero, consolidación de cuentas y auditoría interna para empresas.</p>`,
  },
  '/es/asesoria-laboral-barcelona': {
    title: 'Asesoría Laboral en Barcelona — Gestión de RRHH y Nóminas | NRRO',
    description: 'Asesoría laboral en Barcelona: contratos, nóminas, Seguridad Social, despidos, ERTEs y movilidad internacional.',
    canonical: `${BASE}/es/asesoria-laboral-barcelona`,
    bodyContent: `<h1>Asesoría Laboral en Barcelona</h1><p>Consultoría laboral, contratos, nóminas, Seguridad Social, despidos, ERTEs, movilidad internacional y cumplimiento normativo laboral.</p>`,
  },
  '/es/asesoria-mercantil-barcelona': {
    title: 'Asesoría Mercantil en Barcelona — Derecho Societario | NRRO',
    description: 'Asesoría mercantil y societaria en Barcelona: constitución de sociedades, pactos de socios, gobierno corporativo.',
    canonical: `${BASE}/es/asesoria-mercantil-barcelona`,
    bodyContent: `<h1>Asesoría Mercantil en Barcelona</h1><p>Constitución de sociedades, pactos de socios, gobierno corporativo, reestructuraciones societarias y operaciones de M&A.</p>`,
  },
  '/es/orientacion-global': {
    title: 'Orientación Global — Expansión Internacional | NRRO',
    description: 'Servicios de expansión internacional: constitución de filiales, fiscalidad internacional, transfer pricing.',
    canonical: `${BASE}/es/orientacion-global`,
    bodyContent: `<h1>Orientación Global — Expansión Internacional</h1><p>Acompañamos a empresas en su expansión internacional: constitución de filiales, fiscalidad transfronteriza, transfer pricing y movilidad de expatriados.</p>`,
  },
  '/es/empresa-familiar': {
    title: 'Empresa Familiar — Asesoramiento y Sucesión | NRRO',
    description: 'Asesoramiento integral para empresas familiares: protocolo familiar, planificación sucesoria, gobierno corporativo.',
    canonical: `${BASE}/es/empresa-familiar`,
    bodyContent: `<h1>Asesoramiento para la Empresa Familiar</h1><p>Protocolo familiar, planificación sucesoria, gobierno corporativo, holding familiar y fiscalidad de la empresa familiar.</p>`,
  },
  '/contacto': {
    title: 'Contacto — Navarro Tax & Legal Barcelona | NRRO',
    description: 'Contacta con Navarro Tax & Legal en Barcelona. Ausiàs March 36, 08010 Barcelona. Tel: +34 93 459 36 00.',
    canonical: `${BASE}/contacto`,
    hreflang: [
      { lang: 'es', href: `${BASE}/contacto` },
      { lang: 'ca', href: `${BASE}/ca/contacte` },
      { lang: 'en', href: `${BASE}/en/contact` },
    ],
    bodyContent: `
      <h1>Contacto — Navarro Tax & Legal</h1>
      <p>Ausiàs March 36, Principal, 08010 Barcelona, España</p>
      <p>Teléfono: <a href="tel:+34934593600">+34 93 459 36 00</a></p>
      <p>Email: <a href="mailto:info@nrro.es">info@nrro.es</a></p>
    `,
  },
  '/nosotros': {
    title: 'Sobre Nosotros — Navarro Tax & Legal | NRRO',
    description: 'Conoce a Navarro Tax & Legal: más de 25 años asesorando a empresas y familias empresarias en Barcelona.',
    canonical: `${BASE}/nosotros`,
    hreflang: [
      { lang: 'es', href: `${BASE}/nosotros` },
      { lang: 'ca', href: `${BASE}/ca/nosaltres` },
      { lang: 'en', href: `${BASE}/en/about` },
    ],
    bodyContent: `<h1>Sobre Navarro Tax & Legal</h1><p>Desde 1998, más de 60 profesionales especializados en asesoría fiscal, contable, laboral y legal para empresas en Barcelona.</p>`,
  },
  '/equipo': {
    title: 'Equipo Profesional — Navarro Tax & Legal | NRRO',
    description: 'Nuestro equipo de más de 60 profesionales especializados en fiscal, contable, laboral y legal.',
    canonical: `${BASE}/equipo`,
    bodyContent: `<h1>Equipo Profesional</h1><p>Más de 60 profesionales: abogados, economistas, asesores fiscales y laborales especializados en asesoría integral para empresas.</p>`,
  },
  '/blog': {
    title: 'Blog Fiscal y Legal — Noticias y Artículos | NRRO',
    description: 'Artículos, guías y noticias sobre fiscalidad, derecho mercantil, laboral y empresa familiar.',
    canonical: `${BASE}/blog`,
    hreflang: [
      { lang: 'es', href: `${BASE}/blog` },
      { lang: 'ca', href: `${BASE}/ca/blog` },
      { lang: 'en', href: `${BASE}/en/blog` },
    ],
    bodyContent: `<h1>Blog — Navarro Tax & Legal</h1><p>Artículos, guías y noticias sobre fiscalidad, derecho mercantil, laboral y empresa familiar para empresas en España.</p>`,
  },
  '/casos-exito': {
    title: 'Casos de Éxito — Resultados Reales | NRRO',
    description: 'Descubre cómo Navarro Tax & Legal ha ayudado a empresas con planificación fiscal, reestructuraciones y expansión internacional.',
    canonical: `${BASE}/casos-exito`,
    bodyContent: `<h1>Casos de Éxito</h1><p>Descubre cómo hemos ayudado a empresas con planificación fiscal, reestructuraciones societarias, expansión internacional y empresa familiar.</p>`,
  },
  '/ley-beckham': {
    title: 'Ley Beckham España — Régimen Fiscal para Impatriados | NRRO',
    description: 'Guía completa de la Ley Beckham en España: requisitos, ventajas fiscales y procedimiento de solicitud.',
    canonical: `${BASE}/ley-beckham`,
    keywords: 'ley beckham, régimen impatriados, beckham law spain',
    hreflang: [
      { lang: 'es', href: `${BASE}/ley-beckham` },
      { lang: 'en', href: `${BASE}/en/beckham-law` },
    ],
    bodyContent: `<h1>Ley Beckham — Régimen Fiscal para Impatriados en España</h1><p>Guía completa sobre el régimen especial de tributación para trabajadores desplazados a España (Ley Beckham): requisitos de elegibilidad, ventajas fiscales, procedimiento de solicitud y planificación fiscal óptima.</p>`,
  },
  '/en/': {
    title: 'NRRO | Navarro Tax & Legal — Tax & Legal Advisory in Barcelona',
    description: 'Tax, accounting, labor and legal advisory in Barcelona. Over 25 years helping businesses and family enterprises.',
    canonical: `${BASE}/en/`,
    hreflang: [
      { lang: 'en', href: `${BASE}/en/` },
      { lang: 'es', href: `${BASE}/` },
      { lang: 'ca', href: `${BASE}/ca/` },
    ],
    bodyContent: `<h1>Navarro Tax & Legal — Tax & Legal Advisory in Barcelona</h1><p>Over 25 years of experience in tax planning, accounting, labor law and corporate law for businesses in Barcelona, Spain.</p>`,
  },
  '/en/tax-advisor-barcelona': {
    title: 'Tax Advisor in Barcelona — Tax Planning & Compliance | NRRO',
    description: 'Professional tax advisory services in Barcelona: tax planning, compliance, VAT, corporate tax, personal income tax and international taxation.',
    canonical: `${BASE}/en/tax-advisor-barcelona`,
    bodyContent: `<h1>Tax Advisor in Barcelona</h1><p>Professional tax advisory: tax planning, VAT, corporate tax, personal income tax, tax inspections, international taxation and transfer pricing.</p>`,
  },
};

function getRouteData(path: string): RouteData {
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '');
  if (routes[normalized]) return routes[normalized];

  // Blog fallback
  if (normalized.startsWith('/blog/')) {
    return {
      title: 'Blog — Navarro Tax & Legal | NRRO',
      description: 'Artículos y guías sobre fiscalidad, derecho mercantil, laboral y empresa familiar.',
      canonical: `${BASE}${normalized}`,
      bodyContent: `<h1>Artículo — Navarro Tax & Legal</h1><p>Contenido disponible en <a href="${BASE}${normalized}">${BASE}${normalized}</a></p>`,
    };
  }

  return {
    title: 'NRRO | Navarro Tax & Legal — Asesoría Fiscal y Legal en Barcelona',
    description: 'Asesoría fiscal, contable, laboral y legal en Barcelona. Más de 25 años de experiencia.',
    canonical: `${BASE}${normalized}`,
    bodyContent: `<h1>Navarro Tax & Legal</h1><p>Asesoría fiscal, contable, laboral y legal en Barcelona.</p>`,
  };
}

function buildHtml(data: RouteData, path: string): string {
  const lang = path.startsWith('/en/') || path === '/en/' ? 'en'
    : path.startsWith('/ca/') || path === '/ca/' ? 'ca'
    : 'es';

  const hreflangTags = data.hreflang
    ? data.hreflang.map(h => `<link rel="alternate" hreflang="${h.lang}" href="${h.href}" />`).join('\n    ')
    : '';

  const keywordsMeta = data.keywords
    ? `<meta name="keywords" content="${data.keywords}" />`
    : '';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.title}</title>
  <meta name="description" content="${data.description}" />
  ${keywordsMeta}
  <meta name="author" content="Navarro Tax & Legal" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <link rel="canonical" href="${data.canonical}" />
  ${hreflangTags}
  
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="NRRO — Navarro Tax & Legal" />
  <meta property="og:url" content="${data.canonical}" />
  <meta property="og:title" content="${data.title}" />
  <meta property="og:description" content="${data.description}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:locale" content="${lang === 'en' ? 'en_US' : lang === 'ca' ? 'ca_ES' : 'es_ES'}" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${data.title}" />
  <meta name="twitter:description" content="${data.description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Navarro Tax & Legal",
    "alternateName": "NRRO",
    "url": "https://nrro.es",
    "logo": "https://nrro.es/assets/logos/navarro-tax-legal.svg",
    "description": "Asesoría fiscal, contable, laboral y legal en Barcelona.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ausiàs March 36, Principal",
      "addressLocality": "Barcelona",
      "postalCode": "08010",
      "addressRegion": "Catalunya",
      "addressCountry": "ES"
    },
    "telephone": "+34934593600",
    "email": "info@nrro.es",
    "foundingDate": "1998",
    "numberOfEmployees": { "@type": "QuantitativeValue", "value": 60 }
  }
  </script>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "NRRO — Navarro Tax & Legal",
    "url": "https://nrro.es",
    "telephone": "+34934593600",
    "email": "info@nrro.es",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ausiàs March 36, Principal",
      "addressLocality": "Barcelona",
      "postalCode": "08010",
      "addressCountry": "ES"
    },
    "areaServed": { "@type": "City", "name": "Barcelona" },
    "priceRange": "€€",
    "openingHours": "Mo-Fr 09:00-18:00",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoría Fiscal" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoría Contable" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoría Laboral" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoría Legal y Mercantil" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fiscalidad Internacional" } }
      ]
    }
  }
  </script>
</head>
<body>
  <header>
    <nav>
      <a href="${BASE}/">NRRO — Navarro Tax & Legal</a>
      <a href="${BASE}/servicios">Servicios</a>
      <a href="${BASE}/nosotros">Nosotros</a>
      <a href="${BASE}/equipo">Equipo</a>
      <a href="${BASE}/casos-exito">Casos de Éxito</a>
      <a href="${BASE}/blog">Blog</a>
      <a href="${BASE}/contacto">Contacto</a>
    </nav>
  </header>
  <main>
    ${data.bodyContent || `<h1>${data.title}</h1><p>${data.description}</p>`}
  </main>
  <footer>
    <p>© ${new Date().getFullYear()} Navarro Tax & Legal (NRRO). Ausiàs March 36, 08010 Barcelona. Tel: +34 93 459 36 00</p>
    <nav>
      <a href="${BASE}/privacidad">Privacidad</a>
      <a href="${BASE}/aviso-legal">Aviso Legal</a>
      <a href="${BASE}/cookies">Cookies</a>
      <a href="${BASE}/condiciones-contratacion">Condiciones</a>
    </nav>
  </footer>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    
    const data = getRouteData(path);
    const html = buildHtml(data, path);

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
      },
    });
  } catch (error) {
    console.error('Prerender error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
