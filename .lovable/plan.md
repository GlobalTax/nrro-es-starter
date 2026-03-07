

## Migrar a Claude como modelo principal de IA

### Resumen

Reemplazar `openai/gpt-5-nano` por **Claude (Anthropic API directa)** como modelo principal en las 4 edge functions que usan IA para generación de texto. El Lovable AI Gateway se mantiene como **fallback** y para **generación de imágenes** (que Claude no soporta).

### Arquitectura

```text
Texto/Análisis:
  Claude (api.anthropic.com) ──► Si falla ──► Lovable Gateway (gemini-3-flash-preview)

Imágenes:
  Lovable Gateway (gemini-2.5-flash-image) ──► Sin cambio
```

### Paso 1: Añadir secret `ANTHROPIC_API_KEY`

Guardar la API key de Anthropic como secret de Supabase para que las edge functions la tengan disponible.

### Paso 2: Crear helper compartido de IA

Crear un módulo reutilizable que encapsule la lógica de llamada a Claude con fallback al Lovable Gateway:

- Llamar a `https://api.anthropic.com/v1/messages` con el modelo `claude-sonnet-4-20250514`
- Si falla (timeout, error, rate limit): llamar al Lovable AI Gateway con `google/gemini-3-flash-preview`
- Logs claros indicando qué modelo se usó

### Paso 3: Actualizar las 4 edge functions

| Función | Cambio |
|---|---|
| `generate-blog-article` | Claude para texto (×2 llamadas). Imágenes siguen con Gemini |
| `analyze-blog-content` | Claude para análisis. Imágenes siguen con Gemini |
| `audit-page` | Claude para análisis SEO |
| `auto-generate-news` | Claude para generación de noticias |

En cada función, reemplazar las llamadas directas al gateway por el helper con fallback.

### Paso 4: Modelo de Claude a usar

- **Primario**: `claude-sonnet-4-20250514` — mejor relación calidad/coste para generación de contenido
- **Fallback**: `google/gemini-3-flash-preview` via Lovable AI Gateway
- **Imágenes**: `google/gemini-2.5-flash-image-preview` via Lovable AI Gateway (sin cambio)

### Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| Secret `ANTHROPIC_API_KEY` | Añadir via tool |
| `supabase/functions/generate-blog-article/index.ts` | Usar Claude + fallback |
| `supabase/functions/analyze-blog-content/index.ts` | Usar Claude + fallback |
| `supabase/functions/audit-page/index.ts` | Usar Claude + fallback |
| `supabase/functions/auto-generate-news/index.ts` | Usar Claude + fallback |

### Beneficio

- **Mejor calidad** de contenido generado (Claude es superior en redacción en español)
- **Resiliencia**: si Claude falla, el sistema sigue funcionando con Gemini
- **Sin impacto** en generación de imágenes ni en costes del gateway (solo se usa como fallback)

