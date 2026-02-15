

## Plan: Mejorar la indexacion SEO del dominio nrro.es

### Problema

nrro.es es una SPA (Single Page Application). Google recibe siempre el mismo `index.html` con meta tags genericos para todas las URLs. Solo 3 paginas estan indexadas a pesar de tener +30 rutas.

Causas detectadas:
- `public/sitemap.xml` contiene URLs de `int.nrro.es`, no de `nrro.es`
- `robots.txt` apunta a `nrro.es/sitemap.xml` pero el contenido no corresponde
- `index.html` tiene title y description fijos que no varian por pagina
- No hay prerendering ni SSR

### Solucion propuesta (3 partes)

---

#### Parte 1: Sitemap XML dinamico por dominio

**Archivo: Edge Function `generate-sitemap`**

Crear una Edge Function que genere el sitemap XML automaticamente:
- Detecta el dominio (nrro.es vs int.nrro.es) desde el header `Host`
- Incluye todas las rutas publicas del dominio correspondiente (es/ca/en para nrro.es, en para int.nrro.es)
- Incluye rutas dinamicas consultando Supabase: servicios, blog posts, casos de exito, recursos, landings
- Devuelve XML con Content-Type correcto

**Archivo: `public/sitemap.xml` y `src/pages/SitemapXML.tsx`**

Reemplazar el contenido estatico. La ruta `/sitemap.xml` redirigira a la Edge Function.

---

#### Parte 2: Robots.txt dinamico

**Archivo: `public/robots.txt`**

Actualizar para que el Sitemap apunte a la URL correcta segun el dominio. Como `robots.txt` es estatico en Lovable, se dejara con la URL base `https://nrro.es/sitemap.xml` y se creara tambien una version para int.

---

#### Parte 3: Meta tags para crawlers (Open Graph / SEO)

**Archivo: Edge Function `render-meta`** (opcional, mas avanzado)

Crear una Edge Function que actue como "proxy de meta tags":
- Recibe la URL de la pagina
- Busca en una tabla `site_pages` o genera los meta tags correctos para esa ruta
- Devuelve un HTML minimo con los meta tags correctos que los crawlers (Google, Twitter, Facebook) pueden leer

Alternativa mas simple: **mejorar el `index.html`** con meta tags mas descriptivos y confiar en que Googlebot ejecuta el JS del componente `Meta.tsx` (que ya funciona correctamente).

---

### Detalles tecnicos

#### Edge Function `generate-sitemap`

```text
Request: GET /functions/v1/generate-sitemap?domain=nrro.es
Response: Content-Type: application/xml

Logica:
1. Rutas estaticas hardcoded (/, /servicios, /equipo, /blog, etc.)
2. Query a Supabase: services (slug, source_site), blog_posts (slug), case_studies (slug), landings (slug, is_published)
3. Genera XML con <url>, <loc>, <lastmod>, <priority>
4. Filtra por source_site segun dominio
```

#### Cambios en SitemapXML.tsx

```text
En lugar de redirigir a Storage, llamar a la Edge Function:
- Detectar dominio actual
- Fetch a la Edge Function con el dominio como parametro
- Servir el XML o redirigir
```

#### Actualizacion de public/sitemap.xml

Generar un sitemap estatico completo con TODAS las rutas conocidas de nrro.es como fallback, incluyendo:
- Rutas principales en espanol (/, /servicios, /equipo, /blog, /contacto, etc.)
- Rutas en catalan (/ca/, /ca/serveis, etc.)
- Rutas en ingles (/en/, /en/services, etc.)
- Landings especiales (/ley-beckham, /orquest-kairoshr, etc.)
- Paginas legales (/privacidad, /aviso-legal, /cookies, /condiciones-contratacion)

#### Actualizacion de robots.txt

```text
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://nrro.es/sitemap.xml
```

### Impacto esperado

- Google descubrira todas las rutas del sitio via el sitemap completo
- Las URLs del sitemap corresponderian al dominio correcto
- Se bloquean las rutas de admin para evitar indexacion innecesaria
- El componente Meta.tsx existente seguira haciendo su trabajo con los meta tags dinamicos una vez Googlebot renderice el JS

### Orden de implementacion

1. Actualizar `public/sitemap.xml` con todas las URLs de nrro.es (impacto inmediato)
2. Actualizar `public/robots.txt` con Disallow para /admin/
3. Crear Edge Function `generate-sitemap` para generacion dinamica
4. Actualizar `SitemapXML.tsx` para usar la Edge Function

