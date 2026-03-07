

## Revisión y optimización de los 5 procesos manuales con IA

### Estado actual

| Proceso | Función | Claude | Problema principal |
|---|---|---|---|
| Generar artículo con prompt | `generate-blog-article` | ✅ | Funciona bien. Prompt mejorable |
| Analizar contenido de blog | `analyze-blog-content` | ✅ | Funciona bien. Sin mejoras críticas |
| Auditoría SEO de página | `audit-page` | ✅ | Pide JSON como texto libre (frágil) |
| Auditoría SEO en lote | `batch-audit-pages` | ✅ (indirecto) | Sin mejoras propias, depende de `audit-page` |
| Marketing Audit externo | `marketing-audit` | **❌** | Solo scraping Firecrawl. Todo el análisis es regex client-side |

### Hallazgos clave

**1. `marketing-audit` — SIN IA (el más crítico)**
La función solo scrapea con Firecrawl y devuelve HTML/links/robots/sitemap crudos. Todo el análisis se hace en `marketingAuditAnalyzer.ts` con regex. Hay **~20 items con `autoDetectable: false`** (content-quality, readability, CTAs, value-proposition, navigation, trust-signals, etc.) que quedan siempre en `pending` porque ningún regex puede evaluarlos.

**2. `audit-page` — Parsing JSON frágil**
Pide a Claude que devuelva JSON como texto libre y luego hace `JSON.parse()`. Si Claude añade explicaciones o markdown, falla. Debería usar tool calling como las otras funciones.

**3. `generate-blog-article` — OK pero con timeout ajustado**
Hace 2 llamadas a Claude (generación + refinamiento) + 1 imagen con Gemini. Timeout de 30s por llamada es justo. El flujo es sólido.

**4. `analyze-blog-content` — OK, sin cambios necesarios**
Usa tool calling correctamente, genera imagen. Funcional.

**5. `batch-audit-pages` — OK, delegado**
Solo orquesta llamadas a `audit-page`. Mejorará automáticamente al mejorar `audit-page`.

---

### Plan de implementación

#### Cambio 1: Añadir Claude al marketing-audit (mayor impacto)

Modificar `marketing-audit/index.ts` para que después del scraping con Firecrawl, envíe el contenido a Claude y obtenga evaluaciones de los items no autodetectables.

- Añadir `callClaudeWithFallback` al edge function
- Claude evaluará los ~20 items cualitativos: content-quality, readability, CTAs, value-proposition, navigation, trust-signals, blog-frequency, evergreen, cta-buttons, custom-404, etc.
- Devolver los resultados de Claude junto con los datos scrapeados en un nuevo campo `aiAnalysis`
- Actualizar `useMarketingAudit.ts` para integrar el `aiAnalysis` en los items del checklist que tienen `autoDetectable: false`
- Actualizar `marketingAuditAnalyzer.ts` para mezclar análisis regex + análisis de Claude

#### Cambio 2: Migrar audit-page a tool calling

Cambiar `audit-page/index.ts` para usar tool calling en vez de pedir JSON como texto libre:

- Reemplazar `callClaudeTextWithFallback` por `callClaudeWithFallback` con tool_use
- Definir un tool `audit_result` con schema tipado (seo_score, content_score, structure_score, issues, recommendations)
- Eliminar el parsing manual de JSON y el fallback con scores estáticos

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `supabase/functions/marketing-audit/index.ts` | Añadir Claude para análisis cualitativo de items no autodetectables |
| `src/hooks/useMarketingAudit.ts` | Integrar `aiAnalysis` del backend en el checklist |
| `src/lib/marketingAuditAnalyzer.ts` | Añadir función para aplicar resultados de Claude a items `autoDetectable: false` |
| `supabase/functions/audit-page/index.ts` | Migrar de JSON libre a tool calling |

