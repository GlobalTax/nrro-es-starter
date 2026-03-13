

## Diagnóstico: "Duplicate pages without canonical" — NRRO (Health Score 3)

### El problema

Ahrefs reporta **287 URLs con errores de 297 totales** — casi todo el sitio. El issue principal es **"Duplicate pages without canonical"**, y además crawled: 0 en el último crawl, lo que indica que **el crawler de Ahrefs no puede renderizar las páginas (SPA sin SSR)**.

### Causa raíz

El sitio es una **SPA React** que gestiona los canonicals y meta tags vía JavaScript (`Meta.tsx`), inyectándolos dinámicamente con `document.createElement`. Esto significa:

1. **El HTML inicial servido NO contiene `<link rel="canonical">`** — solo se añade tras la ejecución de JavaScript
2. **Los crawlers que no ejecutan JS** (como Ahrefs) ven el HTML vacío del `index.html`, sin canonical, sin meta description, sin hreflang
3. El sistema de **prerendering** (`seo-prerender` Edge Function) existe y SÍ incluye canonicals correctos, pero solo funciona si hay un proxy (Cloudflare Worker) que detecte bots y les sirva el HTML prerenderizado

### Lo que ya funciona bien

- `Meta.tsx` genera canonicals correctos dinámicamente para navegadores
- `seo-prerender` Edge Function tiene un mapa completo de rutas con canonicals
- Los canonicals usan URLs absolutas con `https://nrro.es`

### Lo que falla

- **No hay canonical en el HTML estático** (`index.html`) — el punto crítico
- Algunas páginas usan `window.location.origin` para el canonical (ej: Team, Terms, Privacy, Insights), lo que genera URLs con el dominio de preview en lugar de `nrro.es`
- El proxy de prerendering puede no estar interceptando el crawler de Ahrefs (crawled: 0 sugiere que no llega a renderizar nada)

### Plan de corrección (3 cambios)

**1. Añadir canonical por defecto en `index.html`**
Incluir un `<link rel="canonical">` genérico en el HTML estático que luego `Meta.tsx` sobrescribirá. Esto asegura que incluso sin JS, hay un canonical presente.

**2. Corregir páginas que usan `window.location.origin`**
Reemplazar `window.location.origin` por `BASE_DOMAIN` (`https://nrro.es`) en las páginas: Team, Terms, Privacy, Insights, y cualquier otra que lo use. Esto evita que en entornos de preview se generen canonicals incorrectos.

**3. Verificar/actualizar el proxy de prerendering para Ahrefs**
El User-Agent del bot de Ahrefs (`AhrefsBot`) debe estar en la lista de bots detectados por el proxy. Si no hay proxy activo (Cloudflare Worker), el prerendering no sirve de nada para crawlers que no ejecutan JS.

### Impacto esperado

- Todas las páginas tendrán canonical en el HTML estático (fix para crawlers sin JS)
- Los canonicals siempre apuntarán a `nrro.es` (no a dominios de preview)
- AhrefsBot recibirá HTML prerenderizado con canonical correcto

