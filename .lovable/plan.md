

## Sistema de caché para traducciones — Plan

### Problema actual
La función `translate-content` llama a Google Translate API para cada string individualmente, sin verificar si ya se tradujo antes. En traducciones masivas (blog, noticias, servicios, casos) se repiten textos comunes (nombres de servicios, categorías, frases recurrentes).

### Solución: tabla `translation_cache` en Supabase

Crear una tabla que almacene traducciones ya realizadas, indexada por hash del texto fuente + idiomas. La función `translate-content` consulta la caché antes de llamar a Google.

### Implementación

**1. Migración SQL — tabla `translation_cache`**

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | Identificador |
| `source_hash` | text | SHA-256 del texto fuente (para búsqueda rápida) |
| `source_lang` | text | Idioma origen (es) |
| `target_lang` | text | Idioma destino (ca/en) |
| `source_text` | text | Texto original |
| `translated_text` | text | Texto traducido |
| `created_at` | timestamptz | Fecha de creación |
| `last_used_at` | timestamptz | Última vez que se usó (para limpieza) |
| `hit_count` | integer | Veces que se reutilizó |

- Índice único en `(source_hash, source_lang, target_lang)`
- RLS: solo accesible desde service_role (las edge functions usan service role key)
- Función de limpieza automática para entradas sin uso en 90 días

**2. Modificar `translate-content/index.ts`**

- Antes de llamar a Google Translate, generar hash del texto y buscar en `translation_cache`
- Si existe: devolver la traducción cacheada y actualizar `last_used_at` + `hit_count`
- Si no existe: llamar a Google Translate, guardar resultado en caché, y devolver
- Usar el cliente Supabase con service_role_key para acceder a la tabla
- La lógica de caché se aplica solo a strings individuales (dentro de `translateValue`), no a objetos completos

**3. Estadísticas de caché en el dashboard**

- Ampliar `useAIUsageStats` para incluir métricas de caché: total entradas, hits totales, ratio de ahorro estimado
- Añadir una tarjeta extra en `AIUsageStatsWidget` con icono Database mostrando "Traducciones cacheadas" y hits

### Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| Migración SQL | Crear tabla `translation_cache` con índice y políticas |
| `supabase/functions/translate-content/index.ts` | Añadir lógica de caché con lookup + insert |
| `src/hooks/useAIUsageStats.ts` | Añadir query de stats de caché |
| `src/components/admin/AIUsageStatsWidget.tsx` | Añadir tarjeta de caché |

### Beneficio esperado
Tras la primera traducción masiva, las traducciones repetidas (títulos de servicios, categorías, frases comunes) se servirán desde la base de datos sin coste de API, reduciendo significativamente las llamadas a Google Translate.

