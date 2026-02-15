

## Plan: Desplegar y corregir el sistema de sitemap

### Problema

La Edge Function `generate-sitemap` (la correcta, con logica multi-dominio) nunca fue desplegada. La funcion `regenerate-sitemap` esta desplegada pero genera todas las URLs con `int.nrro.es` en lugar de `nrro.es`, y tiene un bug con `slug_ca` en blog_posts.

### Solucion (2 pasos)

---

#### Paso 1: Desplegar `generate-sitemap`

La funcion ya tiene el codigo correcto. Solo necesita ser desplegada. Esto hara que `SitemapXML.tsx` funcione correctamente, sirviendo un sitemap dinamico correcto segun el dominio.

No se requieren cambios de codigo — solo despliegue.

---

#### Paso 2: Corregir `regenerate-sitemap`

Actualizar la funcion `regenerate-sitemap` para que:
1. Acepte un parametro `domain` (default: `nrro.es`) para generar el sitemap correcto
2. Elimine la referencia a `slug_ca` en blog_posts (no existe en la tabla)
3. Use la misma logica multi-dominio que `generate-sitemap`

Alternativa mas simple: hacer que `regenerate-sitemap` llame internamente a `generate-sitemap` para generar el XML y luego lo suba a Storage, evitando duplicacion de logica.

---

### Detalles tecnicos

#### Cambio en `regenerate-sitemap/index.ts`

- Reemplazar `const BASE_URL = 'https://int.nrro.es'` por logica de deteccion de dominio
- Eliminar `slug_ca` de la query de blog_posts (linea 204: cambiar `slug_es, slug_ca, slug_en` a `slug_es, slug_en`)
- Generar dos sitemaps separados y subir ambos a Storage (o uno principal para nrro.es)

#### Verificacion post-despliegue

Tras el despliegue, verificar que:
- `GET /functions/v1/generate-sitemap?domain=nrro.es` devuelve XML con URLs de `nrro.es`
- `GET /functions/v1/generate-sitemap?domain=int.nrro.es` devuelve XML con URLs de `int.nrro.es`

