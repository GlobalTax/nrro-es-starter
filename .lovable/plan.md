

## Plan: Integrar Firecrawl en la generación de artículos del blog

### Problema actual

El sistema genera artículos a partir de **temas predefinidos estáticos** (`TOPIC_TEMPLATES`) sin investigar contenido real. Los artículos carecen de contexto actual, referencias a novedades legales y benchmarking con otros despachos.

### Solución

Añadir una **fase de investigación con Firecrawl** antes de la generación, para que cada artículo se base en contenido real y actualizado.

### Arquitectura

```text
┌─────────────────────┐
│  auto-generate-blog  │
│  (orquestador)       │
└──────────┬──────────┘
           │ 1. Selecciona tema
           ▼
┌─────────────────────┐
│  NUEVA FASE:        │
│  Firecrawl Research  │
│  - Busca 3-5 fuentes│
│  - Extrae contenido │
│  - Resume contexto  │
└──────────┬──────────┘
           │ 2. Pasa research como contexto
           ▼
┌─────────────────────┐
│  generate-blog-article│
│  (genera con contexto)│
└─────────────────────┘
```

### Cambios concretos

**1. `supabase/functions/generate-blog-article/index.ts`**

- Añadir parámetro opcional `researchContext?: string` al input
- Inyectar el research context en el system prompt de Claude para que genere artículos basados en datos reales
- El prompt incluirá: "Basa tu artículo en la siguiente investigación actual: {researchContext}"

**2. `supabase/functions/auto-generate-blog/index.ts`**

- Añadir función `researchTopic()` que usa Firecrawl Search API para buscar contenido relevante
- Para cada tema, buscar en fuentes legales/fiscales españolas (ej: "novedades fiscales empresas familiares España 2026")
- Usar `FIRECRAWL_API_KEY` (ya disponible como secret)
- Llamar a Firecrawl Search con `limit: 5`, `lang: "es"` y `country: "ES"`
- Compilar un resumen de las fuentes encontradas (títulos, extractos, URLs)
- Pasar este research context a `generate-blog-article`
- Añadir manejo de errores: si Firecrawl falla, continuar sin research (fallback graceful)

**3. Búsquedas inteligentes por categoría**

Configurar queries de búsqueda específicas por categoría:
- **Fiscal**: "novedades fiscales España {year}", "reforma tributaria empresas"
- **Mercantil**: "gobierno corporativo empresa familiar España", "operaciones M&A España"
- **Laboral**: "reforma laboral España {year}", "novedades derecho laboral"
- **Corporativo**: "compliance empresas España", "RGPD novedades"

Las queries se construirán dinámicamente combinando el tema seleccionado con palabras clave de la categoría.

**4. Almacenar fuentes en el artículo**

- Guardar las URLs de las fuentes investigadas en un nuevo campo `research_sources` (jsonb) en `blog_posts`
- Migración SQL: `ALTER TABLE blog_posts ADD COLUMN research_sources jsonb DEFAULT '[]'`

### Flujo de la función `researchTopic()`

```text
1. Construir query: "{topic} España {year} despacho abogados"
2. Firecrawl Search → 5 resultados con scrapeOptions: { formats: ['markdown'] }
3. Para cada resultado: extraer title + primeros 500 chars del markdown
4. Compilar en un string de contexto (~2000 tokens max)
5. Retornar { context: string, sources: [{url, title}] }
```

### Redespliegue

- Redesplegar `generate-blog-article` y `auto-generate-blog`

### Alcance

- 2 edge functions modificadas
- 1 migración SQL (nuevo campo `research_sources`)
- Sin cambios en frontend (el campo research_sources se puede mostrar opcionalmente después)

