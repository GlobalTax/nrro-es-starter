

## Automatización del Marketing Audit

### Situación actual

El Marketing Audit es 100% manual: el admin introduce una URL, la Edge Function `marketing-audit` scrapea con Firecrawl, y toda la lógica de análisis (checklist de 50+ items, scores, quick wins, recommendations) se ejecuta **en el cliente** via `marketingAuditAnalyzer.ts` y `marketingAuditChecklist.ts`. Los resultados se guardan opcionalmente en `marketing_audits`.

La tabla `contact_leads` **no tiene campo de URL/website**, por lo que necesitamos añadirlo para el trigger automático.

### Plan de implementación

**1. Migración SQL**

- Añadir columna `website` (TEXT, nullable) a `contact_leads`
- Crear tabla `audit_schedule` para gestionar URLs a auditar periódicamente:

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | Identificador |
| `url` | text | URL a auditar |
| `label` | text | Nombre/etiqueta del cliente |
| `frequency` | text | `weekly` / `monthly` |
| `is_active` | boolean | Activo/inactivo |
| `last_audit_at` | timestamptz | Última auditoría ejecutada |
| `created_by` | uuid | Admin que lo programó |

**2. Nueva Edge Function `auto-marketing-audit`**

Mover la lógica de análisis (actualmente client-side en `marketingAuditAnalyzer.ts` y `marketingAuditChecklist.ts`) al servidor para poder ejecutarla sin intervención del admin:

- Recibe una URL (desde CRON o trigger)
- Llama a Firecrawl para scrapear
- Ejecuta la misma lógica de checklist y scoring server-side
- Guarda el resultado directamente en `marketing_audits`
- Soporta dos modos: `cron` (audita todas las URLs activas en `audit_schedule`) y `single` (audita una URL específica, usado por el trigger de nuevo lead)

**3. CRON semanal**

Programar con `pg_cron` una llamada semanal (domingos a las 4:00 AM) a `auto-marketing-audit` en modo `cron`, que:

- Lee todas las entradas activas de `audit_schedule` cuya `last_audit_at` haya expirado según su `frequency`
- Audita cada URL secuencialmente
- Actualiza `last_audit_at`

**4. Trigger por nuevo lead**

Crear un trigger en `contact_leads` que cuando se inserte un registro con `website` no nulo, llame a `auto-marketing-audit` en modo `single` con esa URL. Esto genera automáticamente un informe para el prospecto.

**5. UI de gestión en Admin**

Crear una sección en el panel de Marketing Audit para gestionar las URLs programadas:

- Tabla con URLs activas, frecuencia, último audit y score
- Botones para añadir/editar/desactivar URLs
- Link al resultado de la última auditoría

### Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| Migración SQL | `website` en contact_leads + tabla `audit_schedule` + trigger |
| `supabase/functions/auto-marketing-audit/index.ts` | Nueva Edge Function con lógica de análisis server-side |
| `supabase/config.toml` | Añadir config para `auto-marketing-audit` |
| `src/components/admin/marketing-audit/AuditScheduleManager.tsx` | UI para gestionar URLs programadas |
| `src/pages/admin/AdminMarketingAudit.tsx` | Integrar pestaña de auditorías programadas |
| `src/hooks/useAuditSchedule.ts` | Hook CRUD para `audit_schedule` |

### Consideraciones

- La lógica de `marketingAuditAnalyzer.ts` y `marketingAuditChecklist.ts` se duplicará (adaptada) en la Edge Function para ejecutarse server-side. El código cliente se mantiene para auditorías manuales interactivas.
- El CRON procesará URLs secuencialmente con delay entre cada una para respetar rate limits de Firecrawl.
- El trigger de nuevo lead es asíncrono (`net.http_post`) para no bloquear la inserción del formulario.

