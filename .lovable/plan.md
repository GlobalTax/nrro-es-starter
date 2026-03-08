

## Plan: Panel de configuración de fuentes Firecrawl por categoría

### Resumen
Crear un panel dentro de la pestaña "Automatización" del blog que permita configurar sitios web y fuentes específicas que Firecrawl debe consultar para cada categoría (Fiscal, Mercantil, Laboral, Corporativo). La edge function `auto-generate-blog` leerá estas fuentes configuradas para hacer búsquedas más dirigidas.

### Cambios

**1. Nueva tabla `blog_research_sources`**
- Campos: `id`, `category`, `site_url`, `site_name`, `is_enabled`, `priority` (1-5), `created_at`
- RLS: acceso solo para autenticados
- Almacena los sitios web que Firecrawl debe priorizar por categoría

**2. Nuevo componente `FirecrawlSourcesPanel.tsx`**
- Ubicación: `src/components/admin/blog/FirecrawlSourcesPanel.tsx`
- UI: Card con tabs por categoría (Fiscal, Mercantil, Laboral, Corporativo)
- Cada tab muestra lista de sitios configurados con: nombre, URL, toggle habilitado/deshabilitado, botón eliminar
- Formulario para añadir nuevos sitios (nombre + URL)
- Precargado con sitios por defecto (BOE, Expansión, Cinco Días, El Economista, etc.)

**3. Integración en `BlogAutomationPanel.tsx`**
- Añadir nueva tab "Fuentes Firecrawl" (icono Globe) al TabsList existente dentro del panel de automatización
- El contenido renderiza `<FirecrawlSourcesPanel />`

**4. Hook `useBlogResearchSources.ts`**
- CRUD para la tabla `blog_research_sources`
- Queries: listar por categoría, añadir, eliminar, toggle habilitado

**5. Actualizar edge function `auto-generate-blog`**
- En `researchTopic()`, leer los sitios configurados de la tabla `blog_research_sources`
- Usar `site:domain.com` en las queries de Firecrawl para dirigir la búsqueda a los sitios configurados
- Fallback: si no hay sitios configurados, usar el comportamiento actual (búsqueda general)

### Sitios por defecto sugeridos
- **Fiscal**: boe.es, agenciatributaria.es, expansion.com, cincodias.elpais.com
- **Mercantil**: elderecho.com, lawyerpress.com, legaltoday.com
- **Laboral**: mites.gob.es, noticias.juridicas.com, iberley.es
- **Corporativo**: cuatrecasas.com/es/blog, garrigues.com/es_ES/noticia

### Alcance
- 1 migración SQL (nueva tabla)
- 2 archivos frontend nuevos (componente + hook)
- 1 archivo frontend modificado (BlogAutomationPanel)
- 1 edge function modificada (auto-generate-blog)

