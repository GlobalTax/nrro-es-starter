import { AuditCategory } from './marketingAuditTypes';

export const createDefaultChecklist = (): AuditCategory[] => [
  {
    id: 'seo-onpage',
    name: 'SEO On-Page',
    icon: 'Search',
    weight: 20,
    score: 0,
    items: [
      { id: 'title-tag', label: 'Title Tag', description: 'Existencia, longitud (50-60 chars) y keywords relevantes', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'meta-description', label: 'Meta Description', description: 'Existencia, longitud (150-160 chars) y call-to-action', status: 'pending', note: '', weight: 8, autoDetectable: true },
      { id: 'headings', label: 'Estructura H1-H6', description: 'H1 único, jerarquía correcta de encabezados', status: 'pending', note: '', weight: 8, autoDetectable: true },
      { id: 'keywords', label: 'Keywords', description: 'Densidad y distribución natural de palabras clave', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'urls', label: 'URLs amigables', description: 'Slug limpio, sin parámetros innecesarios', status: 'pending', note: '', weight: 6, autoDetectable: true },
      { id: 'alt-tags', label: 'Alt Tags en imágenes', description: 'Texto alternativo descriptivo en todas las imágenes', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'internal-links', label: 'Enlaces internos', description: 'Estructura de linking interno coherente', status: 'pending', note: '', weight: 6, autoDetectable: true },
      { id: 'canonical', label: 'Canonical Tags', description: 'Etiqueta canonical correctamente implementada', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'schema', label: 'Schema Markup', description: 'Datos estructurados JSON-LD implementados', status: 'pending', note: '', weight: 8, autoDetectable: true },
      { id: 'duplicate-content', label: 'Contenido duplicado', description: 'Sin contenido duplicado significativo', status: 'pending', note: '', weight: 6, autoDetectable: false },
    ],
  },
  {
    id: 'seo-technical',
    name: 'SEO Técnico',
    icon: 'Settings',
    weight: 20,
    score: 0,
    items: [
      { id: 'core-web-vitals', label: 'Core Web Vitals', description: 'LCP, FID, CLS dentro de umbrales aceptables', status: 'pending', note: '', weight: 9, autoDetectable: false },
      { id: 'mobile-friendly', label: 'Mobile-friendly', description: 'Diseño responsive y usable en móviles', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'ssl', label: 'Certificado SSL', description: 'Conexión HTTPS activa y válida', status: 'pending', note: '', weight: 10, autoDetectable: true },
      { id: 'sitemap', label: 'Sitemap XML', description: 'Existencia y formato correcto del sitemap', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'robots-txt', label: 'Robots.txt', description: 'Archivo robots.txt correctamente configurado', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'errors-404', label: 'Errores 404', description: 'Sin enlaces rotos significativos', status: 'pending', note: '', weight: 6, autoDetectable: false },
      { id: 'indexation', label: 'Indexación', description: 'Páginas correctamente indexadas vs bloqueadas', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'hreflang', label: 'Hreflang', description: 'Etiquetas hreflang para sitios multiidioma', status: 'pending', note: '', weight: 5, autoDetectable: true },
      { id: 'compression', label: 'Compresión', description: 'Gzip/Brotli activado para archivos', status: 'pending', note: '', weight: 6, autoDetectable: false },
      { id: 'lazy-loading', label: 'Lazy Loading', description: 'Carga diferida de imágenes implementada', status: 'pending', note: '', weight: 5, autoDetectable: true },
      { id: 'image-formats', label: 'Formatos de imagen', description: 'Uso de WebP, AVIF u otros formatos modernos', status: 'pending', note: '', weight: 5, autoDetectable: true },
    ],
  },
  {
    id: 'content',
    name: 'Contenido y Copywriting',
    icon: 'FileText',
    weight: 15,
    score: 0,
    items: [
      { id: 'content-quality', label: 'Calidad del contenido', description: 'Contenido útil, original y bien estructurado', status: 'pending', note: '', weight: 9, autoDetectable: false },
      { id: 'readability', label: 'Legibilidad', description: 'Índice de legibilidad adecuado para la audiencia', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'ctas', label: 'CTAs claros', description: 'Llamadas a la acción visibles y persuasivas', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'value-proposition', label: 'Propuesta de valor', description: 'Diferencial visible above the fold', status: 'pending', note: '', weight: 9, autoDetectable: false },
      { id: 'blog-frequency', label: 'Blog / Frecuencia', description: 'Sección de blog con publicación regular', status: 'pending', note: '', weight: 6, autoDetectable: false },
      { id: 'evergreen', label: 'Contenido Evergreen', description: 'Balance entre contenido atemporal y temporal', status: 'pending', note: '', weight: 5, autoDetectable: false },
      { id: 'multimedia', label: 'Multimedia', description: 'Uso de vídeos, infografías e imágenes de calidad', status: 'pending', note: '', weight: 6, autoDetectable: true },
    ],
  },
  {
    id: 'ux-cro',
    name: 'UX y Conversión (CRO)',
    icon: 'MousePointer',
    weight: 15,
    score: 0,
    items: [
      { id: 'navigation', label: 'Navegación', description: 'Menú claro, intuitivo y accesible', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'forms', label: 'Formularios', description: 'Pocos campos, baja fricción, validación clara', status: 'pending', note: '', weight: 7, autoDetectable: true },
      { id: 'interaction-speed', label: 'Velocidad de interacción', description: 'Respuestas rápidas a acciones del usuario', status: 'pending', note: '', weight: 6, autoDetectable: false },
      { id: 'responsive', label: 'Diseño responsive', description: 'Adaptación correcta a todos los dispositivos', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'cta-buttons', label: 'Botones CTA', description: 'Visibles, contrastados y con texto accionable', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'chat', label: 'Chat en vivo', description: 'Chatbot o chat en vivo disponible', status: 'pending', note: '', weight: 4, autoDetectable: true },
      { id: 'trust-signals', label: 'Trust Signals', description: 'Testimonios, logos de clientes, certificaciones', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'custom-404', label: 'Página 404', description: 'Página de error personalizada y útil', status: 'pending', note: '', weight: 3, autoDetectable: false },
    ],
  },
  {
    id: 'analytics',
    name: 'Analítica y Tracking',
    icon: 'BarChart3',
    weight: 10,
    score: 0,
    items: [
      { id: 'ga4', label: 'Google Analytics 4', description: 'GA4 correctamente implementado', status: 'pending', note: '', weight: 10, autoDetectable: true },
      { id: 'gtm', label: 'Google Tag Manager', description: 'GTM configurado y activo', status: 'pending', note: '', weight: 8, autoDetectable: true },
      { id: 'meta-pixel', label: 'Pixel de Meta', description: 'Facebook/Meta Pixel implementado', status: 'pending', note: '', weight: 6, autoDetectable: true },
      { id: 'linkedin-tag', label: 'LinkedIn Insight Tag', description: 'Tag de LinkedIn para seguimiento', status: 'pending', note: '', weight: 5, autoDetectable: true },
      { id: 'events', label: 'Eventos / Conversiones', description: 'Eventos y conversiones configurados', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'search-console', label: 'Search Console', description: 'Google Search Console vinculado', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'heatmaps', label: 'Hotjar / Clarity', description: 'Herramienta de mapas de calor activa', status: 'pending', note: '', weight: 5, autoDetectable: true },
    ],
  },
  {
    id: 'offpage',
    name: 'Presencia Digital y Off-Page',
    icon: 'Globe',
    weight: 10,
    score: 0,
    items: [
      { id: 'google-business', label: 'Google Business', description: 'Perfil de Google Business optimizado', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'nap', label: 'Coherencia NAP', description: 'Nombre, dirección y teléfono consistentes', status: 'pending', note: '', weight: 7, autoDetectable: false },
      { id: 'social-media', label: 'Redes sociales', description: 'Perfiles activos y enlazados desde el sitio', status: 'pending', note: '', weight: 6, autoDetectable: true },
      { id: 'backlinks', label: 'Backlinks', description: 'Cantidad y calidad de dominios referentes', status: 'pending', note: '', weight: 8, autoDetectable: false },
      { id: 'brand-mentions', label: 'Menciones de marca', description: 'Presencia y menciones en medios/blogs', status: 'pending', note: '', weight: 5, autoDetectable: false },
      { id: 'directories', label: 'Directorios', description: 'Presencia en directorios relevantes del sector', status: 'pending', note: '', weight: 4, autoDetectable: false },
    ],
  },
  {
    id: 'legal',
    name: 'Legal y Compliance',
    icon: 'Shield',
    weight: 10,
    score: 0,
    items: [
      { id: 'legal-notice', label: 'Aviso Legal', description: 'Aviso legal completo y accesible', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'privacy-policy', label: 'Política de Privacidad', description: 'Actualizada conforme RGPD/LOPDGDD', status: 'pending', note: '', weight: 10, autoDetectable: true },
      { id: 'cookies-banner', label: 'Banner de Cookies', description: 'Banner funcional con opciones de consentimiento', status: 'pending', note: '', weight: 9, autoDetectable: true },
      { id: 'form-consent', label: 'Consentimiento en formularios', description: 'Checkbox de consentimiento explícito', status: 'pending', note: '', weight: 8, autoDetectable: true },
    ],
  },
];

export const calculateCategoryScore = (items: { status: string; weight: number }[]): number => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedScore = items.reduce((sum, item) => {
    const score = item.status === 'correct' ? 1 : item.status === 'improvable' ? 0.5 : item.status === 'missing' ? 0 : 0.25;
    return sum + score * item.weight;
  }, 0);

  return Math.round((weightedScore / totalWeight) * 100);
};

export const calculateGlobalScore = (categories: { score: number; weight: number }[]): number => {
  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 0;
  return Math.round(categories.reduce((sum, c) => sum + c.score * c.weight, 0) / totalWeight);
};
