
## Herramienta de Auditoría de Marketing Digital y SEO

### Resumen

Crear una aplicacion completa de auditoria de marketing digital y SEO integrada en el panel de administracion existente, accesible desde `/admin/marketing-audit`. La herramienta permite introducir una URL, ejecutar un analisis automatizado via Firecrawl + analisis client-side, y mostrar resultados con puntuaciones visuales, checklists interactivos, graficos radar y exportacion PDF.

### Arquitectura general

```text
+------------------------------------------+
|  /admin/marketing-audit                  |
|  +--------------------------------------+|
|  | URL Input + "Auditar" button         ||
|  +--------------------------------------+|
|  | Global Score (0-100) + Radar Chart   ||
|  +--------------------------------------+|
|  | Tabs:                                ||
|  |  SEO On-Page | SEO Tecnico |         ||
|  |  Contenido | UX/CRO | Analitica |   ||
|  |  Presencia Digital | Legal           ||
|  |  Each tab: checklist + score         ||
|  +--------------------------------------+|
|  | Quick Wins | Recomendaciones         ||
|  +--------------------------------------+|
|  | [Exportar PDF]                       ||
|  +--------------------------------------+|
+------------------------------------------+
```

### Nuevos archivos a crear

**Pagina principal:**
- `src/pages/admin/AdminMarketingAudit.tsx` — Pagina principal con input de URL, puntuacion global, pestanas de categorias, graficos y exportacion

**Componentes:**
- `src/components/admin/marketing-audit/AuditDashboard.tsx` — Dashboard con score global, radar chart y resumen
- `src/components/admin/marketing-audit/AuditCategoryTab.tsx` — Componente reutilizable para cada pestana de categoria con checklist
- `src/components/admin/marketing-audit/AuditChecklistItem.tsx` — Item individual del checklist con estados (correcto/mejorable/falta), notas y puntuacion
- `src/components/admin/marketing-audit/AuditRadarChart.tsx` — Grafico radar con Recharts comparando las 7 categorias
- `src/components/admin/marketing-audit/AuditScoreCard.tsx` — Tarjeta de puntuacion con codigo de colores (rojo/amarillo/verde)
- `src/components/admin/marketing-audit/AuditQuickWins.tsx` — Seccion de Quick Wins con las 10 acciones de mayor impacto
- `src/components/admin/marketing-audit/AuditRecommendations.tsx` — Recomendaciones a medio y largo plazo
- `src/components/admin/marketing-audit/AuditPdfExport.tsx` — Boton y logica de exportacion PDF

**Logica y tipos:**
- `src/lib/marketingAuditTypes.ts` — Tipos TypeScript para categorias, items, estados, puntuaciones
- `src/lib/marketingAuditChecklist.ts` — Definicion de todas las categorias y sus items con pesos y descripciones
- `src/lib/marketingAuditAnalyzer.ts` — Logica de analisis automatico del HTML scrapeado (detectar meta tags, headers, schema, SSL, etc.)
- `src/lib/marketingAuditPdf.ts` — Generacion del informe PDF exportable
- `src/hooks/useMarketingAudit.ts` — Hook principal que orquesta el scraping (via Firecrawl), analisis y estado

**Edge Function:**
- `supabase/functions/marketing-audit/index.ts` — Edge Function que usa Firecrawl para scrapear la URL objetivo y devolver HTML + metadata para analisis client-side

**Base de datos (migracion):**
- Tabla `marketing_audits` para persistir auditorias: id, url, created_at, updated_at, global_score, category_scores (jsonb), checklist_data (jsonb), notes (jsonb), quick_wins (jsonb), created_by (uuid)

### Detalle de las 7 categorias

Cada categoria tiene un peso en la puntuacion global y contiene items con 3 estados posibles:

1. **SEO On-Page** (20%) — 10 items: title tags, meta descriptions, encabezados H1-H6, keywords, URLs amigables, alt tags, enlaces internos, canonical, schema markup, contenido duplicado
2. **SEO Tecnico** (20%) — 11 items: Core Web Vitals, mobile-friendly, SSL, sitemap XML, robots.txt, errores 404, indexacion, hreflang, compresion, lazy loading, formatos imagen
3. **Contenido y Copywriting** (15%) — 7 items: calidad contenido, legibilidad, CTAs, propuesta valor, blog/frecuencia, evergreen, multimedia
4. **UX y Conversion (CRO)** (15%) — 8 items: navegacion, formularios, velocidad interaccion, responsive, botones CTA, chat, trust signals, pagina 404
5. **Analitica y Tracking** (10%) — 7 items: GA4, GTM, Meta Pixel, LinkedIn tag, eventos/conversiones, Search Console, Hotjar/Clarity
6. **Presencia Digital y Off-Page** (10%) — 6 items: Google Business, NAP, redes sociales, backlinks, menciones, directorios
7. **Legal y Compliance** (10%) — 4 items: aviso legal, privacidad RGPD, cookies banner, consentimiento formularios

### Flujo de uso

1. El usuario introduce una URL y pulsa "Auditar"
2. Se llama a la Edge Function `marketing-audit` que scrapea via Firecrawl (formatos: html, links, markdown)
3. El analyzer client-side procesa el HTML para auto-detectar items (meta tags, headers, schema, scripts de analytics, SSL, etc.)
4. Los items auto-detectados se marcan automaticamente; los demas quedan como "pendiente" para revision manual
5. El usuario puede cambiar el estado de cualquier item y anadir notas
6. Las puntuaciones se recalculan en tiempo real
7. Se generan Quick Wins automaticamente basados en items fallidos con mayor peso
8. El usuario puede exportar el informe completo a PDF
9. La auditoria se guarda en Supabase para historico

### Analisis automatico (lo que se puede detectar del HTML)

Del scraping con Firecrawl se puede auto-detectar:
- Title tag (existencia, longitud)
- Meta description (existencia, longitud)
- Estructura H1-H6 (cantidad, jerarquia)
- Alt tags en imagenes
- Canonical tags
- Schema markup (JSON-LD)
- SSL (URL empieza con https)
- Scripts de GA4, GTM, Meta Pixel, LinkedIn, Hotjar/Clarity
- Sitemap.xml y robots.txt (via fetch adicional)
- Open Graph tags
- Hreflang tags
- Aviso legal, privacidad, cookies (deteccion de links en footer)

Items que requieren revision manual:
- Core Web Vitals (se puede sugerir usar PageSpeed Insights)
- Calidad de backlinks
- Google Business Profile
- Coherencia NAP
- Frecuencia de publicacion del blog

### Integracion en el admin

- Anadir ruta `/admin/marketing-audit` en `App.tsx`
- Anadir entrada "Auditoría Web" en la seccion Marketing del sidebar (`AdminSidebar.tsx`)
- Usar el icono `Search` o `ScanLine` de lucide-react

### Exportacion PDF

Usar html2canvas + jsPDF para generar un PDF profesional con:
- Portada con logo, URL auditada y fecha
- Resumen ejecutivo con puntuacion global y radar chart
- Desglose por categoria con checklist y notas
- Seccion Quick Wins
- Recomendaciones priorizadas

### Diseno visual

- Fondo oscuro con acentos en azul corporativo (consistente con el admin existente)
- Cards con bordes sutiles y sombras
- Codigo de colores: rojo (#ef4444) para 0-49, amarillo (#eab308) para 50-74, verde (#22c55e) para 75-100
- Animaciones sutiles en las barras de progreso
- Radar chart con area semitransparente azul
