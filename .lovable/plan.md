

## Plan: Arreglar el sitemap (hreflang, x-default, y regeneración)

### Problemas identificados

1. **Falta `x-default`** en todas las URLs con alternates (solo homepage lo tiene en el static)
2. **Faltan hreflang pairs** en la mayoría de service landings ES (solo `asesoria-fiscal-barcelona` ↔ `tax-advisor-barcelona` tiene par)
3. **El sitemap estático (`public/sitemap.xml`) está desactualizado** -- no incluye artículos de blog recientes
4. **Duplicación**: el archivo estático y la edge function `regenerate-sitemap` generan contenido diferente

### Cambios

**1. Actualizar `supabase/functions/regenerate-sitemap/index.ts`**
- Añadir `x-default` (apuntando a la versión ES) en todos los bloques con alternates
- Ampliar `hreflangPairs` para incluir más pares ES↔EN de service landings (contable, laboral, mercantil, abogados, etc. donde existan rutas EN equivalentes)
- Añadir news articles dinámicos al sitemap (consultar tabla `news_articles` publicadas)

**2. Actualizar `public/sitemap.xml` (fallback estático)**
- Añadir `x-default` a todas las URLs que tienen alternates
- Añadir hreflang alternates a las service landings ES que los tienen faltando (contable, laboral, mercantil, abogados-barcelona)
- Eliminar las URLs EN/CA standalone duplicadas que ya se generan como alternates en las rutas estáticas (evitar duplicación)

**3. Desplegar y ejecutar regeneración**
- Deploy de la edge function actualizada
- Invocar `regenerate-sitemap` para que suba el sitemap actualizado a Storage con blog posts recientes y hreflang completos
- El archivo en Storage será servido vía `SitemapXML.tsx` → `generate-sitemap` edge function → fallback Storage

### Alcance
- 1 edge function modificada (`regenerate-sitemap`)
- 1 archivo estático actualizado (`public/sitemap.xml`)
- Deploy + invocación para regenerar

