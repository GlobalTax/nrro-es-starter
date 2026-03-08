

## Plan: Corregir errores de generación automática de blog

### Problema identificado

Los logs del edge function `auto-generate-blog` muestran **3 tipos de errores activos** que impiden la generación de artículos:

1. **`invalid input value for enum site_source: "domestic"`** -- El campo `source_site` en `blog_posts` usa un enum `site_source` con valores `{es, int, audit}`. La versión desplegada del edge function asigna valores como `"domestic"` o `"international"` que el enum no acepta.

2. **`invalid input value for enum site_source: "international"`** -- Mismo problema, variante del valor.

3. **`unsupported Unicode escape sequence`** -- El contenido generado por la IA contiene secuencias Unicode inválidas (`\uXXXX` mal formadas) que Postgres rechaza al insertar.

### Causa raíz

El código local en `auto-generate-blog/index.ts` hardcodea `source_site: "es"` (línea 412), lo que es correcto. Sin embargo, **la versión desplegada** es diferente y usa un campo `source_site` dinámico que puede devolver valores inválidos. Al redesplegar con las correcciones, se resolverán ambos problemas.

Adicionalmente, falta sanitización del contenido generado por IA para evitar secuencias Unicode rotas.

### Cambios

**1. `supabase/functions/auto-generate-blog/index.ts`**

- Añadir función `sanitizeSourceSite()` que mapee cualquier valor a un enum válido:
  - `"domestic"`, `"es"`, `"nacional"`, `null` → `"es"`
  - `"international"`, `"int"`, `"global"` → `"int"`
  - Cualquier otro → `"es"` (fallback seguro)

- Añadir función `sanitizeContent()` que limpie secuencias Unicode inválidas del contenido HTML antes de insertar en la BD (regex para eliminar `\uXXXX` malformadas y caracteres de control).

- Aplicar `sanitizeSourceSite()` al campo `source_site` antes del insert (línea ~412).

- Aplicar `sanitizeContent()` a `content_es`, `content_en`, `excerpt_es`, `excerpt_en` antes del insert.

**2. Redesplegar** ambos edge functions (`auto-generate-blog`).

### Alcance

- Solo se modifica `supabase/functions/auto-generate-blog/index.ts`
- No hay cambios en el frontend
- Se redespliega la función para que el código local (corregido) reemplace la versión desplegada divergente

