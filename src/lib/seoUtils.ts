// Base domain for all SEO purposes
export const BASE_DOMAIN = "https://nrro.es";

export const getBaseUrl = () => BASE_DOMAIN;

export const getBreadcrumbUrl = (path: string) => {
  const base = getBaseUrl();
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
};

// Versiones y fechas de actualización centralizadas para páginas legales
export const legalVersions = {
  lastUpdate: "12 de noviembre de 2025",
  lastUpdateISO: "2025-11-12",
};

// Breadcrumbs predefinidos para páginas legales
export const legalBreadcrumbs = {
  legal: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Aviso Legal", url: getBreadcrumbUrl("/aviso-legal") }
  ],
  privacy: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Legal", url: getBreadcrumbUrl("/aviso-legal") },
    { name: "Política de Privacidad", url: getBreadcrumbUrl("/privacy") }
  ],
  cookies: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Legal", url: getBreadcrumbUrl("/aviso-legal") },
    { name: "Política de Cookies", url: getBreadcrumbUrl("/cookies") }
  ],
  terms: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Legal", url: getBreadcrumbUrl("/aviso-legal") },
    { name: "Condiciones de Contratación", url: getBreadcrumbUrl("/condiciones-contratacion") }
  ]
};

// Breadcrumbs predefinidos para páginas principales
export const mainBreadcrumbs = {
  services: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Servicios", url: getBreadcrumbUrl("/servicios") }
  ],
  blog: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Blog", url: getBreadcrumbUrl("/blog") }
  ],
  caseStudies: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Casos de Éxito", url: getBreadcrumbUrl("/casos-exito") }
  ],
  team: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Equipo", url: getBreadcrumbUrl("/equipo") }
  ],
  about: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Nosotros", url: getBreadcrumbUrl("/nosotros") }
  ],
  leyBeckham: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Servicios", url: getBreadcrumbUrl("/servicios") },
    { name: "Ley Beckham", url: getBreadcrumbUrl("/ley-beckham") }
  ],
  careers: [
    { name: "Inicio", url: getBreadcrumbUrl("/") },
    { name: "Únete al Equipo", url: getBreadcrumbUrl("/careers") }
  ]
};

// Helper para crear breadcrumbs dinámicos (para páginas de detalle)
export const createDynamicBreadcrumb = (
  parentPath: { name: string; url: string }[],
  currentName: string
) => {
  return [...parentPath, { name: currentName, url: window.location.href }];
};
