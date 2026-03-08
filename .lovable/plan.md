

## Plan: Indicador visual de Firecrawl en la tabla de blog

### Resumen

Añadir un icono/badge en la tabla de artículos que indique si un artículo fue generado con investigación de Firecrawl. Al hacer clic, se abre un popover mostrando las fuentes consultadas.

### Cambios

**1. `src/hooks/useBlogSearch.ts`**
- Añadir `research_sources` al tipo `BlogPostResult` (como `any[] | null`)
- Nota: el RPC `search_blog_posts` puede que no devuelva este campo; si no lo hace, se hará una consulta directa o se ajustará el RPC

**2. `src/pages/admin/AdminBlog.tsx`**
- En la columna "Título" de cada fila, añadir un icono pequeño (🔍 o `Globe` de lucide) junto al título cuando `post.research_sources` tenga elementos
- Al hacer clic en el icono, abrir un `Popover` que muestre:
  - Número de fuentes consultadas
  - Lista de fuentes con título y URL (enlace externo)
  - Texto tipo: "Investigación Firecrawl · 5 fuentes"

**3. Verificar que el RPC devuelve `research_sources`**
- Si el RPC `search_blog_posts` no incluye este campo, se añadirá al SELECT de la función SQL o se hará un fetch separado al expandir

### Diseño visual

- Badge discreto al lado del título: icono `Globe` en azul/teal con tooltip "Generado con Firecrawl"
- Al clic: Popover con lista de fuentes (título clicable → URL externa)
- Estilo consistente con el design system existente (slate palette, border-slate-200)

### Alcance
- 2 archivos frontend modificados
- Posible 1 migración SQL si el RPC necesita actualización

