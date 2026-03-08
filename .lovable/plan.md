

## Plan: Añadir botón de eliminar contactos en la tabla

### Situación actual
- El hook `useDeleteContactLead` ya existe y funciona.
- `handleDelete` ya está definido en `AdminContactLeads.tsx` y se pasa al `ContactLeadDetailSheet`.
- **Falta**: el botón de eliminar en la fila expandida de `ContactLeadsTable` y la confirmación antes de borrar.

### Cambios

**1. `ContactLeadsTable.tsx`** — Añadir callback `onDelete` y botón en la fila expandida
- Añadir `onDelete: (lead: ContactLead) => void` a las props.
- Añadir un botón rojo "Eliminar" con icono `Trash2` en la barra de acciones de la fila expandida (junto a "Responder", "Marcar Respondido", "Ver Detalle").
- Incluir un `AlertDialog` de confirmación para evitar borrados accidentales.

**2. `AdminContactLeads.tsx`** — Pasar `onDelete` a la tabla
- Pasar `onDelete={(lead) => handleDelete(lead.id)}` como prop al componente `ContactLeadsTable`.

Esto permite eliminar contactos tanto desde la fila expandida en la tabla como desde el panel de detalle lateral, con confirmación en ambos casos.

