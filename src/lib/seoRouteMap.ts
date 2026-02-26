/**
 * SEO Route Map — defines unique meta tags for every route.
 * Used by the seo-prerender Edge Function to generate bot-friendly HTML.
 */

export interface SeoRouteData {
  title: string;
  description: string;
  canonical: string;
  hreflang?: { lang: string; href: string }[];
  schemaType?: 'LegalService' | 'Article' | 'FAQPage' | 'WebPage' | 'AboutPage' | 'ContactPage';
  keywords?: string;
}

const BASE = 'https://nrro.es';

export const seoRouteMap: Record<string, SeoRouteData> = {
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
  },
  '/servicios': {
    title: 'Servicios — Asesoría Fiscal, Contable, Laboral y Legal | NRRO',
    description: 'Servicios integrales de asesoría fiscal, contable, laboral y legal para empresas en Barcelona. Planificación fiscal, derecho societario, nóminas y compliance.',
    canonical: `${BASE}/servicios`,
    hreflang: [
      { lang: 'es', href: `${BASE}/servicios` },
      { lang: 'ca', href: `${BASE}/ca/serveis` },
      { lang: 'en', href: `${BASE}/en/services` },
    ],
    keywords: 'servicios asesoría fiscal, asesoría contable, asesoría laboral, asesoría legal barcelona',
  },
  '/nosotros': {
    title: 'Sobre Nosotros — Navarro Tax & Legal | NRRO',
    description: 'Conoce a Navarro Tax & Legal (NRRO): más de 25 años asesorando a empresas y familias empresarias en Barcelona. 60 profesionales, enfoque multidisciplinar.',
    canonical: `${BASE}/nosotros`,
    schemaType: 'AboutPage',
    hreflang: [
      { lang: 'es', href: `${BASE}/nosotros` },
      { lang: 'ca', href: `${BASE}/ca/nosaltres` },
      { lang: 'en', href: `${BASE}/en/about` },
    ],
  },
  '/equipo': {
    title: 'Equipo Profesional — Navarro Tax & Legal | NRRO',
    description: 'Nuestro equipo de más de 60 profesionales especializados en fiscal, contable, laboral y legal. Abogados, economistas y asesores en Barcelona.',
    canonical: `${BASE}/equipo`,
    hreflang: [
      { lang: 'es', href: `${BASE}/equipo` },
      { lang: 'ca', href: `${BASE}/ca/equip` },
      { lang: 'en', href: `${BASE}/en/team` },
    ],
  },
  '/contacto': {
    title: 'Contacto — Navarro Tax & Legal Barcelona | NRRO',
    description: 'Contacta con Navarro Tax & Legal en Barcelona. Ausiàs March 36, 08010 Barcelona. Tel: +34 93 459 36 00. Solicita una consulta personalizada.',
    canonical: `${BASE}/contacto`,
    schemaType: 'ContactPage',
    hreflang: [
      { lang: 'es', href: `${BASE}/contacto` },
      { lang: 'ca', href: `${BASE}/ca/contacte` },
      { lang: 'en', href: `${BASE}/en/contact` },
    ],
    keywords: 'contacto asesoría fiscal barcelona, navarro tax legal contacto, consulta fiscal barcelona',
  },
  '/blog': {
    title: 'Blog Fiscal y Legal — Noticias y Artículos | NRRO',
    description: 'Artículos, guías y noticias sobre fiscalidad, derecho mercantil, laboral y empresa familiar. Actualidad legal y fiscal para empresas en España.',
    canonical: `${BASE}/blog`,
    hreflang: [
      { lang: 'es', href: `${BASE}/blog` },
      { lang: 'ca', href: `${BASE}/ca/blog` },
      { lang: 'en', href: `${BASE}/en/blog` },
    ],
    keywords: 'blog fiscal, noticias legales, novedades fiscales españa, asesoría fiscal artículos',
  },
  '/casos-exito': {
    title: 'Casos de Éxito — Resultados Reales | NRRO',
    description: 'Descubre cómo Navarro Tax & Legal ha ayudado a empresas con planificación fiscal, reestructuraciones societarias, expansión internacional y empresa familiar.',
    canonical: `${BASE}/casos-exito`,
    hreflang: [
      { lang: 'es', href: `${BASE}/casos-exito` },
      { lang: 'ca', href: `${BASE}/ca/casos-exit` },
      { lang: 'en', href: `${BASE}/en/case-studies` },
    ],
  },
  '/metodologia': {
    title: 'Metodología de Trabajo — Navarro Tax & Legal | NRRO',
    description: 'Nuestra metodología: diagnóstico, planificación, ejecución y seguimiento. Un enfoque estructurado para la asesoría fiscal, contable y legal de tu empresa.',
    canonical: `${BASE}/metodologia`,
    hreflang: [
      { lang: 'es', href: `${BASE}/metodologia` },
      { lang: 'ca', href: `${BASE}/ca/metodologia` },
      { lang: 'en', href: `${BASE}/en/methodology` },
    ],
  },
  '/estrategia': {
    title: 'Estrategia Empresarial — Navarro Tax & Legal | NRRO',
    description: 'Asesoramiento estratégico para empresas: planificación fiscal, gobierno corporativo, sucesión empresarial y crecimiento sostenible.',
    canonical: `${BASE}/estrategia`,
    hreflang: [
      { lang: 'es', href: `${BASE}/estrategia` },
      { lang: 'ca', href: `${BASE}/ca/estrategia` },
      { lang: 'en', href: `${BASE}/en/strategy` },
    ],
  },
  '/sectores': {
    title: 'Sectores — Experiencia por Industria | NRRO',
    description: 'Asesoría especializada por sector: empresa familiar, tecnología, hostelería, salud, retail y más. Conocemos los retos específicos de cada industria.',
    canonical: `${BASE}/sectores`,
    hreflang: [
      { lang: 'es', href: `${BASE}/sectores` },
      { lang: 'ca', href: `${BASE}/ca/sectors` },
      { lang: 'en', href: `${BASE}/en/sectors` },
    ],
  },
  '/carreras': {
    title: 'Trabaja con Nosotros — Ofertas de Empleo | NRRO',
    description: 'Únete a Navarro Tax & Legal. Ofertas de empleo en asesoría fiscal, contable, laboral y legal en Barcelona. Crece profesionalmente con nosotros.',
    canonical: `${BASE}/carreras`,
    hreflang: [
      { lang: 'es', href: `${BASE}/carreras` },
      { lang: 'ca', href: `${BASE}/ca/carreres` },
      { lang: 'en', href: `${BASE}/en/careers` },
    ],
  },
  '/recursos': {
    title: 'Recursos y Herramientas — Guías Fiscales y Legales | NRRO',
    description: 'Recursos gratuitos: guías fiscales, calculadoras, plantillas y herramientas para la gestión fiscal y legal de tu empresa.',
    canonical: `${BASE}/recursos`,
    hreflang: [
      { lang: 'es', href: `${BASE}/recursos` },
      { lang: 'ca', href: `${BASE}/ca/recursos` },
      { lang: 'en', href: `${BASE}/en/resources` },
    ],
  },

  // Service landings (ES)
  '/es/asesoria-fiscal-barcelona': {
    title: 'Asesoría Fiscal en Barcelona — Planificación y Gestión Tributaria | NRRO',
    description: 'Asesoría fiscal en Barcelona: planificación fiscal, gestión AEAT, declaraciones (IVA, IS, IRPF, Patrimonio), inspecciones y fiscalidad internacional.',
    canonical: `${BASE}/es/asesoria-fiscal-barcelona`,
    keywords: 'asesoría fiscal barcelona, asesor fiscal barcelona, planificación fiscal, gestión tributaria barcelona',
    hreflang: [
      { lang: 'es', href: `${BASE}/es/asesoria-fiscal-barcelona` },
      { lang: 'en', href: `${BASE}/en/tax-advisor-barcelona` },
    ],
  },
  '/es/asesoria-contable-barcelona': {
    title: 'Asesoría Contable en Barcelona — Contabilidad para Empresas | NRRO',
    description: 'Servicios de asesoría contable en Barcelona: contabilidad general, cuentas anuales, reporting financiero, consolidación de cuentas y auditoría interna.',
    canonical: `${BASE}/es/asesoria-contable-barcelona`,
    keywords: 'asesoría contable barcelona, contabilidad empresas barcelona, cuentas anuales',
  },
  '/es/asesoria-laboral-barcelona': {
    title: 'Asesoría Laboral en Barcelona — Gestión de RRHH y Nóminas | NRRO',
    description: 'Asesoría laboral en Barcelona: contratos, nóminas, Seguridad Social, despidos, ERTEs, movilidad internacional y cumplimiento normativo laboral.',
    canonical: `${BASE}/es/asesoria-laboral-barcelona`,
    keywords: 'asesoría laboral barcelona, nóminas, seguridad social, gestión RRHH barcelona',
  },
  '/es/asesoria-mercantil-barcelona': {
    title: 'Asesoría Mercantil en Barcelona — Derecho Societario | NRRO',
    description: 'Asesoría mercantil y societaria en Barcelona: constitución de sociedades, pactos de socios, gobierno corporativo, reestructuraciones y M&A.',
    canonical: `${BASE}/es/asesoria-mercantil-barcelona`,
    keywords: 'asesoría mercantil barcelona, derecho societario, pactos de socios, gobierno corporativo',
  },
  '/es/abogados-barcelona': {
    title: 'Abogados en Barcelona — Asesoramiento Legal para Empresas | NRRO',
    description: 'Abogados en Barcelona especializados en derecho mercantil, fiscal, laboral y compliance. Asesoramiento legal integral para empresas y familias empresarias.',
    canonical: `${BASE}/es/abogados-barcelona`,
    keywords: 'abogados barcelona, abogados empresas barcelona, derecho mercantil barcelona',
  },
  '/es/orientacion-global': {
    title: 'Orientación Global — Expansión Internacional | NRRO',
    description: 'Servicios de expansión internacional: constitución de filiales, fiscalidad internacional, transfer pricing, cumplimiento regulatorio y movilidad de expatriados.',
    canonical: `${BASE}/es/orientacion-global`,
    keywords: 'fiscalidad internacional, expansión internacional, transfer pricing, filiales extranjero',
  },
  '/es/compliance-penal': {
    title: 'Compliance Penal — Programa de Cumplimiento Normativo | NRRO',
    description: 'Implementación de programas de compliance penal para empresas. Prevención de riesgos penales, canal de denuncias y cumplimiento normativo.',
    canonical: `${BASE}/es/compliance-penal`,
    keywords: 'compliance penal, cumplimiento normativo, programa compliance, canal denuncias',
  },
  '/es/empresa-familiar': {
    title: 'Empresa Familiar — Asesoramiento y Sucesión | NRRO',
    description: 'Asesoramiento integral para empresas familiares: protocolo familiar, planificación sucesoria, gobierno corporativo, holding familiar y fiscalidad.',
    canonical: `${BASE}/es/empresa-familiar`,
    keywords: 'empresa familiar, protocolo familiar, sucesión empresarial, holding familiar',
  },
  '/es/due-diligence': {
    title: 'Due Diligence — Auditoría para Operaciones M&A | NRRO',
    description: 'Servicios de due diligence fiscal, financiera, laboral y legal para operaciones de M&A. Identificación de riesgos y valoración de empresas.',
    canonical: `${BASE}/es/due-diligence`,
    keywords: 'due diligence, auditoría M&A, valoración empresas, compraventa empresas',
  },
  '/es/proteccion-datos-rgpd': {
    title: 'Protección de Datos y RGPD — Cumplimiento Normativo | NRRO',
    description: 'Asesoramiento en protección de datos y RGPD/LOPD-GDD. Auditorías, DPO externo, políticas de privacidad y gestión de brechas de seguridad.',
    canonical: `${BASE}/es/proteccion-datos-rgpd`,
    keywords: 'protección datos, RGPD, LOPD, DPO externo, privacidad empresas',
  },
  '/es/segunda-oportunidad': {
    title: 'Ley de Segunda Oportunidad — Exoneración de Deudas | NRRO',
    description: 'Asesoramiento en la Ley de Segunda Oportunidad: exoneración de deudas para autónomos y particulares. Procedimiento concursal y negociación con acreedores.',
    canonical: `${BASE}/es/segunda-oportunidad`,
    keywords: 'ley segunda oportunidad, exoneración deudas, concurso acreedores',
  },
  '/es/constitucion-sociedades': {
    title: 'Constitución de Sociedades en España — SL y SA | NRRO',
    description: 'Constitución de sociedades en España: SL, SA, sucursales y filiales. Trámites, costes, plazos y requisitos legales para crear tu empresa.',
    canonical: `${BASE}/es/constitucion-sociedades`,
    keywords: 'constitución sociedades españa, crear empresa españa, sociedad limitada, SL, SA',
  },
  '/es/sobre-navarro': {
    title: 'Sobre Navarro — Historia y Valores | NRRO',
    description: 'Descubre la historia de Navarro Tax & Legal: desde 1998 asesorando a empresas en Barcelona con un enfoque multidisciplinar y cercano.',
    canonical: `${BASE}/es/sobre-navarro`,
    schemaType: 'AboutPage',
  },

  '/es/abogados-herencias-barcelona': {
    title: 'Abogados de Herencias en Barcelona — Sucesiones y Testamentos | NRRO',
    description: 'Abogados especializados en herencias en Barcelona: aceptación de herencia, impuesto de sucesiones, testamentos, partición hereditaria y reclamación de legítima.',
    canonical: `${BASE}/es/abogados-herencias-barcelona`,
    keywords: 'abogados herencias barcelona, herencias barcelona, impuesto sucesiones barcelona, testamentos abogado',
  },

  // English landings
  '/en/company-setup-calculator': {
    title: 'Company Setup Cost Calculator — Spain Business Registration | NRRO',
    description: 'Calculate the costs of setting up a company in Spain. Interactive calculator with notary fees, taxes, registration costs and professional fees.',
    canonical: `${BASE}/en/company-setup-calculator`,
    keywords: 'company setup calculator spain, business registration cost spain, SL formation cost',
  },
  '/en/nie-spain-foreigners': {
    title: 'NIE Spain for Foreigners — How to Get Your NIE Number | NRRO',
    description: 'Complete guide to obtaining your NIE number in Spain. Requirements, process, documents and professional assistance for foreigners.',
    canonical: `${BASE}/en/nie-spain-foreigners`,
    keywords: 'NIE spain, NIE number foreigners, get NIE spain, foreigner identification number',
  },
  '/en/startup-company-setup-spain': {
    title: 'Startup Company Setup in Spain — Tech & Innovation | NRRO',
    description: 'Set up your tech startup in Spain: Startup Act benefits, tax incentives for R&D, visa for entrepreneurs and fast-track registration.',
    canonical: `${BASE}/en/startup-company-setup-spain`,
    keywords: 'startup spain, tech company setup spain, startup act spain, entrepreneur visa spain',
  },
  '/en/fast-company-registration-spain': {
    title: 'Fast Company Registration in Spain — Express Setup | NRRO',
    description: 'Register your company in Spain in record time. Express SL formation, PAE fast-track, digital incorporation and same-day NIF.',
    canonical: `${BASE}/en/fast-company-registration-spain`,
    keywords: 'fast company registration spain, express company setup, quick SL formation spain',
  },

  // Other landings
  '/orquest-kairoshr': {
    title: 'Orquest + KairosHR — Solución Integral de Gestión Laboral | NRRO',
    description: 'La combinación perfecta de Orquest para optimización de turnos y KairosHR para gestión de recursos humanos en restaurantes y retail.',
    canonical: `${BASE}/orquest-kairoshr`,
    keywords: 'orquest, kairoshr, gestión laboral, optimización turnos, recursos humanos, software restaurantes',
  },
  '/insights': {
    title: 'Insights — Análisis Fiscal, Legal y Económico | NRRO',
    description: 'Análisis y perspectivas sobre fiscalidad, derecho mercantil, empresa familiar y tendencias económicas para empresas en España.',
    canonical: `${BASE}/insights`,
    keywords: 'insights fiscales, análisis legal, tendencias económicas españa',
  },

  // Special landings
  '/ley-beckham': {
    title: 'Ley Beckham España — Régimen Fiscal para Impatriados | NRRO',
    description: 'Guía completa de la Ley Beckham en España: requisitos, ventajas fiscales, procedimiento de solicitud y planificación fiscal para profesionales extranjeros.',
    canonical: `${BASE}/ley-beckham`,
    keywords: 'ley beckham, régimen impatriados, fiscalidad expatriados españa, beckham law spain',
    hreflang: [
      { lang: 'es', href: `${BASE}/ley-beckham` },
      { lang: 'ca', href: `${BASE}/ca/llei-beckham` },
      { lang: 'en', href: `${BASE}/en/beckham-law` },
    ],
  },
  '/set-up-company-spain': {
    title: 'Set Up a Company in Spain — Business Registration | NRRO',
    description: 'Complete guide to setting up a company in Spain: company types, registration process, costs, timelines and legal requirements for foreign entrepreneurs.',
    canonical: `${BASE}/set-up-company-spain`,
    keywords: 'set up company spain, register business spain, company formation spain',
    hreflang: [
      { lang: 'en', href: `${BASE}/en/set-up-company-spain` },
      { lang: 'es', href: `${BASE}/crear-empresa-espana` },
    ],
  },
  '/crear-empresa-espana': {
    title: 'Crear Empresa en España — Guía Completa de Constitución | NRRO',
    description: 'Guía completa para crear una empresa en España: tipos de sociedad, trámites, costes y plazos. Te acompañamos en todo el proceso de constitución.',
    canonical: `${BASE}/crear-empresa-espana`,
    keywords: 'crear empresa españa, constituir sociedad, montar negocio españa',
  },
  '/canal-denuncias': {
    title: 'Canal de Denuncias — Canal Ético Interno | NRRO',
    description: 'Canal de denuncias interno de Navarro Tax & Legal. Comunica de forma confidencial cualquier irregularidad o incumplimiento ético.',
    canonical: `${BASE}/canal-denuncias`,
  },

  // English pages
  '/en/': {
    title: 'NRRO | Navarro Tax & Legal — Tax & Legal Advisory in Barcelona',
    description: 'Tax, accounting, labor and legal advisory services in Barcelona. Over 25 years helping businesses and family enterprises with tax planning, corporate law and international expansion.',
    canonical: `${BASE}/en/`,
    hreflang: [
      { lang: 'en', href: `${BASE}/en/` },
      { lang: 'es', href: `${BASE}/` },
      { lang: 'ca', href: `${BASE}/ca/` },
    ],
    keywords: 'tax advisor barcelona, legal advisor barcelona, accountant barcelona, NRRO',
  },
  '/en/tax-advisor-barcelona': {
    title: 'Tax Advisor in Barcelona — Tax Planning & Compliance | NRRO',
    description: 'Professional tax advisory services in Barcelona: tax planning, compliance, VAT, corporate tax, personal income tax, tax inspections and international taxation.',
    canonical: `${BASE}/en/tax-advisor-barcelona`,
    keywords: 'tax advisor barcelona, tax consultant spain, corporate tax spain',
    hreflang: [
      { lang: 'en', href: `${BASE}/en/tax-advisor-barcelona` },
      { lang: 'es', href: `${BASE}/es/asesoria-fiscal-barcelona` },
    ],
  },
  '/en/beckham-law-spain': {
    title: 'Beckham Law Spain — Special Tax Regime for Expats | NRRO',
    description: 'Complete guide to the Beckham Law in Spain: eligibility, tax benefits, application process and tax planning for foreign professionals relocating to Spain.',
    canonical: `${BASE}/en/beckham-law-spain`,
    keywords: 'beckham law spain, special tax regime expats, inpatriate tax regime spain',
  },
  '/en/services': {
    title: 'Services — Tax, Accounting, Labor & Legal | NRRO',
    description: 'Comprehensive advisory services in Barcelona: tax planning, accounting, payroll, labor law, corporate law, international taxation and compliance.',
    canonical: `${BASE}/en/services`,
    hreflang: [
      { lang: 'en', href: `${BASE}/en/services` },
      { lang: 'es', href: `${BASE}/servicios` },
      { lang: 'ca', href: `${BASE}/ca/serveis` },
    ],
  },

  // Legal pages
  '/privacidad': {
    title: 'Política de Privacidad | NRRO — Navarro Tax & Legal',
    description: 'Política de privacidad de Navarro Tax & Legal. Información sobre el tratamiento de datos personales conforme al RGPD.',
    canonical: `${BASE}/privacidad`,
  },
  '/aviso-legal': {
    title: 'Aviso Legal | NRRO — Navarro Tax & Legal',
    description: 'Aviso legal de Navarro Tax & Legal (NRRO). Datos identificativos, condiciones de uso y responsabilidad del sitio web nrro.es.',
    canonical: `${BASE}/aviso-legal`,
  },
  '/cookies': {
    title: 'Política de Cookies | NRRO — Navarro Tax & Legal',
    description: 'Política de cookies de Navarro Tax & Legal. Información sobre las cookies utilizadas en nrro.es y cómo gestionarlas.',
    canonical: `${BASE}/cookies`,
  },
  '/condiciones-contratacion': {
    title: 'Condiciones de Contratación | NRRO — Navarro Tax & Legal',
    description: 'Condiciones generales de contratación de los servicios de Navarro Tax & Legal.',
    canonical: `${BASE}/condiciones-contratacion`,
  },
};

/**
 * Get SEO data for a given path. Falls back to defaults.
 */
export function getSeoDataForPath(path: string): SeoRouteData {
  // Normalize: remove trailing slash except for root
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '');
  
  if (seoRouteMap[normalized]) {
    return seoRouteMap[normalized];
  }

  // Fallback for blog posts
  if (normalized.startsWith('/blog/')) {
    return {
      title: 'Blog — Navarro Tax & Legal | NRRO',
      description: 'Artículos y guías sobre fiscalidad, derecho mercantil, laboral y empresa familiar.',
      canonical: `${BASE}${normalized}`,
      schemaType: 'Article',
    };
  }

  // Fallback for EN blog
  if (normalized.startsWith('/en/blog/')) {
    return {
      title: 'Blog — Navarro Tax & Legal | NRRO',
      description: 'Articles and guides on taxation, corporate law, labor law and family business.',
      canonical: `${BASE}${normalized}`,
      schemaType: 'Article',
    };
  }

  // Generic fallback
  return {
    title: 'NRRO | Navarro Tax & Legal — Asesoría Fiscal y Legal en Barcelona',
    description: 'Asesoría fiscal, contable, laboral y legal en Barcelona. Más de 25 años de experiencia con empresas y familias empresarias.',
    canonical: `${BASE}${normalized}`,
  };
}
