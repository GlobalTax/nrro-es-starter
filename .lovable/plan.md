

## Plan: Resolver los problemas criticos de SEO de nrro.es

La auditoria identifica problemas reales y urgentes. Algunos se pueden resolver directamente en Lovable, otros requieren acciones fuera de la plataforma (DNS, Google Business, LinkedIn). Este plan separa ambos claramente.

---

### Contexto: Que ya existe vs. que dice la auditoria

La auditoria indica que no existen sitemap.xml ni robots.txt, pero **ambos ya existen** en `public/` con 75+ URLs y directivas correctas. El problema real es que **Googlebot puede no estar accediendo a ellos correctamente** desde el dominio publicado, o que el sitemap contiene URLs que devuelven HTML vacio (el problema SPA).

Tambien existen componentes de Schema markup (OrganizationSchema, LegalServiceSchema, ArticleSchema, FAQSchema, BreadcrumbSchema, ServiceSchema), pero todos se inyectan via JavaScript client-side, que es exactamente el problema.

---

### ACCION 1: Prerender para bots (el bloqueante #1)

Crear una **Edge Function de prerendering** que detecte user-agents de bots (Googlebot, Bingbot, Twitterbot, facebookexternalhit, LinkedInBot) y les sirva HTML pre-renderizado con meta tags, schema markup y contenido visible.

**Enfoque tecnico:**
- Nueva Edge Function `prerender` que recibe la URL solicitada
- Para bots: genera HTML estatico con los meta tags correctos para esa ruta (title, description, OG, canonical, hreflang, schema JSON-LD) usando un mapa de rutas predefinido
- Para usuarios normales: redirige a la SPA normal
- Esto requiere configuracion DNS/proxy externa (Cloudflare Worker o similar) para interceptar requests de bots, lo cual **no se puede hacer desde Lovable directamente**

**Alternativa viable en Lovable:** Mejorar el `index.html` base y crear una Edge Function que genere paginas HTML completas para cada ruta que los bots puedan consumir directamente via el sitemap.

**Archivos a crear:**
- `supabase/functions/seo-prerender/index.ts` — Genera HTML estatico con meta tags correctos por ruta

**Archivos a modificar:**
- `index.html` — Mejorar meta tags por defecto, anadir schema JSON-LD estatico de la organizacion directamente en el HTML (no via JS)

---

### ACCION 2: Inyectar schema y meta tags en index.html (impacto inmediato)

Mover el schema JSON-LD de OrganizationSchema y LegalServiceSchema **directamente al index.html** como scripts estaticos. Googlebot los vera sin necesidad de ejecutar JavaScript.

**Cambios en `index.html`:**
- Anadir `<script type="application/ld+json">` con OrganizationSchema
- Anadir `<script type="application/ld+json">` con LegalServiceSchema
- Mejorar la meta description por defecto
- Anadir canonical tag estatico: `<link rel="canonical" href="https://nrro.es/">`
- Anadir hreflang tags estaticos para la homepage
- Anadir `<html lang="es">` (actualmente dice `lang="en"`)

---

### ACCION 3: Corregir el lang del HTML

Actualmente `index.html` tiene `<html lang="en">` cuando deberia ser `<html lang="es">`. El componente Meta lo cambia via JS, pero los bots ven "en".

**Archivo:** `index.html` linea 2

---

### ACCION 4: Crear Edge Function de prerender por ruta

Una Edge Function que, dado un path, devuelve un HTML completo con:
- Title tag unico para esa pagina
- Meta description unica
- Canonical URL
- Hreflang tags
- OG/Twitter tags
- Schema JSON-LD relevante (Organization + page-specific)
- Contenido basico en texto plano

Esto permitiria que el sitemap apunte a URLs que devuelven HTML real para bots.

**Archivo a crear:**
- `supabase/functions/seo-prerender/index.ts`
- `src/lib/seoRouteMap.ts` — Mapa de todas las rutas con sus meta tags (title, description, schema type)

---

### ACCION 5: Actualizar sitemap.xml con lastmod reales

Cambiar todos los `<lastmod>2026-02-15</lastmod>` a fechas reales o al menos variadas. Google penaliza sitemaps donde todas las fechas son identicas.

**Archivo:** `public/sitemap.xml`

---

### ACCIONES QUE REQUIEREN TRABAJO FUERA DE LOVABLE

Estas son criticas pero no se pueden implementar en el codigo:

1. **Redirecciones 301 de obn.es a nrro.es** — Requiere acceso al DNS/hosting de obn.es. Configurar redirecciones 301 para cada URL.

2. **SSL de www.nrro.es** — Requiere configuracion en el proveedor DNS/CDN (Cloudflare, etc.) para emitir certificado SSL para el subdominio www y configurar redireccion www -> sin-www.

3. **Google Business Profile** — Crear y verificar un perfil en Google Business con:
   - Nombre: "Navarro Tax & Legal" o "NRRO - Navarro Tax & Legal"
   - Direccion: Ausias March 36, Principal, 08010 Barcelona
   - Telefono: +34 93 459 36 00
   - Web: https://nrro.es
   - Categoria: "Asesoria fiscal" + "Asesoria juridica"

4. **Migrar LinkedIn de OBN a NRRO** — Actualizar la pagina de empresa en LinkedIn.

5. **Prerender service** — Contratar un servicio como prerender.io o configurar un Cloudflare Worker que intercepte requests de bots y sirva la Edge Function de prerender. Esto es lo que realmente resolveria el problema SPA para SEO.

---

### Resumen de archivos

| Archivo | Accion |
|---|---|
| `index.html` | Corregir lang, anadir schema JSON-LD estatico, mejorar meta tags |
| `supabase/functions/seo-prerender/index.ts` | Crear Edge Function de prerendering por ruta |
| `src/lib/seoRouteMap.ts` | Mapa de rutas con meta tags para prerender |
| `public/sitemap.xml` | Actualizar lastmod con fechas variadas |
| `supabase/config.toml` | Registrar nueva Edge Function |

### Prioridad de implementacion

1. Corregir `index.html` (lang, schema estatico) — impacto inmediato, minimo esfuerzo
2. Crear `seo-prerender` Edge Function — base para servir HTML a bots
3. Actualizar sitemap — mejora incremental
4. Documentar acciones externas (obn.es 301s, SSL www, GBP, LinkedIn) como checklist para el equipo

