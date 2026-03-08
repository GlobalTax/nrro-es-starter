

## Fase B: Consolidar todos los leads en una sola vista

### Situación actual

- `contact_leads` ya tiene un campo `lead_source` (text, nullable) — perfecto para distinguir el origen del lead.
- Existen 3 Edge Functions que escriben en tablas separadas:
  - `submit-company-setup-lead` → `company_setup_leads` (0 registros)
  - `process-ley-beckham-lead` → `ley_beckham_leads` (0 registros)
  - `submit-demo-orquest-kairoshr` → `demo_requests` (0 registros)
- Los formularios públicos (`CompanySetupForm.tsx`, `LeyBeckhamContactForm.tsx`, `DemoFormModal.tsx`) invocan esas Edge Functions.

### Plan

#### 1. Actualizar las 3 Edge Functions para escribir en `contact_leads`

Cada Edge Function, además de (o en lugar de) insertar en su tabla original, insertará en `contact_leads` con:
- `lead_source` = `"company_setup"` / `"ley_beckham"` / `"demo_request"`
- `subject` = texto descriptivo automático (ej: "Solicitud constitución empresa" / "Consulta Ley Beckham" / "Demo Orquest/KairosHR")
- `message` = resumen estructurado de los datos del formulario
- Campos comunes: `name`, `email`, `phone`, `company`

Esto consolida todo en una sola tabla sin romper los formularios públicos.

#### 2. Añadir filtro por `lead_source` en la UI de Contactos

- **`ContactLeadFilters.tsx`**: Añadir un Select de "Tipo" con opciones: Todos, Contacto directo, Company Setup, Ley Beckham, Demo Request.
- **`ContactLeadFiltersState`**: Añadir campo `leadSource`.
- **`useContactLeads.ts`**: Filtrar por `lead_source` cuando se seleccione.

#### 3. Mostrar badge de tipo en la tabla

- **`ContactLeadsTable.tsx`**: Añadir un badge/chip junto al nombre del lead mostrando su tipo (color-coded).

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `supabase/functions/submit-company-setup-lead/index.ts` | Insertar también en `contact_leads` con `lead_source: 'company_setup'` |
| `supabase/functions/process-ley-beckham-lead/index.ts` | Insertar también en `contact_leads` con `lead_source: 'ley_beckham'` |
| `supabase/functions/submit-demo-orquest-kairoshr/index.ts` | Insertar también en `contact_leads` con `lead_source: 'demo_request'` |
| `src/components/admin/contact-leads/ContactLeadFilters.tsx` | Añadir select de tipo/lead_source |
| `src/hooks/useContactLeads.ts` | Añadir filtro `leadSource` en la query |
| `src/components/admin/contact-leads/ContactLeadsTable.tsx` | Badge de tipo de lead |

No se eliminan las tablas originales (datos seguros). Solo se añade la escritura dual para que todo aparezca en una sola bandeja.

