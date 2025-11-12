export const getBaseUrl = () => "https://nrro.es";

export const getBreadcrumbUrl = (path: string) => {
  const base = getBaseUrl();
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
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
