

## Revisión de procesos con IA — Estado actual

### Inventario completo de Edge Functions con IA

| Función | Usa IA | Modelo | Claude | Tipo | Estado |
|---|---|---|---|---|---|
| `generate-blog-article` | Texto + Imagen | Claude + Gemini (img) | ✅ | Manual + Auto | OK |
| `analyze-blog-content` | Texto + Imagen | Claude + Gemini (img) | ✅ | Manual | OK |
| `audit-page` | Texto | Claude + fallback Gateway | ✅ | Manual | OK |
| `auto-generate-news` | Texto | Claude + fallback Gateway | ✅ | Automático (CRON) | OK |
| `auto-generate-blog` | Delega a `generate-blog-article` | Claude (indirecto) | ✅ | Automático (CRON) | OK |
| `auto-marketing-audit` | **No usa IA** | Solo reglas + Firecrawl | ❌ | Auto (CRON + trigger) | **Mejorable** |
| `translate-content` | **Google Translate API** | No LLM | ❌ | Manual | **Mejorable** |
| `translate-*-to-catalan/english` (×6) | Probablemente Google Translate | No LLM | ❌ | Manual/CRON | **Mejorable** |
| `generate-proposal-pdf` | **No usa IA** | Solo template | ❌ | Manual | **Mejorable** |
| `generate-presentation-pdf` | **No usa IA** | Solo template | ❌ | Manual | **Mejorable** |

### Procesos que NO usan Claude y son mejorables

**1. `auto-marketing-audit` — Análisis sin IA**
Actualmente usa solo reglas heurísticas (regex para meta tags, SSL check, etc.). No pasa el contenido scrapeado por un LLM para análisis cualitativo. Mientras que `audit-page` (manual) sí usa Claude para análisis profundo, la versión automatizada no lo hace — genera scores más superficiales.

**Mejora**: Añadir Claude al flujo de `auto-marketing-audit` para análisis cualitativo del contenido, calidad del copy, y detección de problemas que las reglas no captan.

**2. `translate-content` — Google Translate en vez de Claude**
Usa Google Translate API para traducciones. Claude produce traducciones significativamente mejores en contexto legal/fiscal, manteniendo terminología y tono profesional.

**Mejora**: Migrar traducciones a Claude como primario, Google Translate como fallback (más rápido/barato para volumen alto).

**3. `generate-proposal-pdf` y `generate-presentation-pdf` — Sin generación inteligente**
Generan PDFs desde datos estáticos/templates. No usan IA para personalizar el contenido narrativo.

**Mejora**: Usar Claude para generar textos personalizados (intro, propuesta de valor, resumen ejecutivo) basados en datos del cliente.

### Plan de implementación

**Fase 1: `auto-marketing-audit` + Claude** (mayor impacto)
- Añadir `callClaudeTextWithFallback` al `auto-marketing-audit`
- Después del scraping con Firecrawl, enviar el contenido a Claude para análisis cualitativo
- Enriquecer los items del checklist que no son autodetectables (content quality, readability, CTAs, value proposition, etc.) con el análisis de Claude
- Mantener las reglas heurísticas para detección técnica rápida

**Fase 2: Traducciones con Claude**
- Modificar `translate-content` para usar Claude como traductor primario
- Mantener Google Translate como fallback para volumen alto o rate limits
- Adaptar las 6 funciones de traducción específicas (blog, news, case studies, services × ca/en)

**Fase 3: PDFs inteligentes** (opcional)
- Añadir generación de texto narrativo con Claude a `generate-proposal-pdf`
- Personalizar intros, resúmenes y propuestas de valor según datos del cliente

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `supabase/functions/auto-marketing-audit/index.ts` | Añadir Claude para análisis cualitativo post-scraping |
| `supabase/functions/translate-content/index.ts` | Claude como traductor primario, Google Translate como fallback |
| `supabase/functions/translate-*-to-*/index.ts` (×6) | Idem si usan Google Translate directamente |
| `supabase/functions/generate-proposal-pdf/index.ts` | Claude para textos personalizados (Fase 3) |
| `supabase/functions/generate-presentation-pdf/index.ts` | Claude para narrativa personalizada (Fase 3) |

