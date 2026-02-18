

## Añadir URLs de blog al sitemap dinámicamente

### Estado actual

Las dos Edge Functions (`generate-sitemap` y `regenerate-sitemap`) **ya consultan la tabla `blog_posts`** y generan URLs dinamicas con `hreflang` ES/EN. Esto ya funciona correctamente.

El archivo estatico `public/sitemap.xml` sirve como fallback inmediato pero **no incluye URLs individuales de articulos**.

### Plan

1. **Actualizar `public/sitemap.xml`** con las ~30 URLs de blog posts publicados actualmente (ES + EN donde exista `slug_en`), con `priority 0.6`, `changefreq yearly`, y `hreflang` alternates.

2. **Forzar regeneracion del sitemap dinamico** invocando la edge function `regenerate-sitemap` para que el sitemap almacenado en Storage este actualizado con los ultimos articulos.

### Detalles tecnicos

- Se añadiran las URLs de los ~30 articulos publicados al XML estatico con formato:
  ```xml
  <url>
    <loc>https://nrro.es/blog/slug-del-articulo</loc>
    <lastmod>2026-01-22</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="es" href="https://nrro.es/blog/slug-es"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://nrro.es/en/blog/slug-en"/>
  </url>
  ```
- Solo se incluiran articulos con `status = 'published'`
- Los articulos sin `slug_en` solo tendran la URL en español
- Se mantendra la coherencia con la logica de `source_site` ya implementada en las edge functions

