# Sistema de Diseño - Intranet Admin

Este documento describe el sistema de diseño unificado para todas las secciones de la intranet (CRM, HR, Marketing, Administración).

## Colores

### Base
| Token | Valor | Uso |
|-------|-------|-----|
| `--intranet-bg` | `#F9FAFB` | Fondo general |
| `--intranet-card` | `#FFFFFF` | Fondo de cards |
| `--intranet-border` | `#E5E7EB` | Bordes |
| `--intranet-text-primary` | `#111827` | Texto principal |
| `--intranet-text-secondary` | `#6B7280` | Texto secundario |

### Estados
| Estado | Background | Texto | Borde | Uso |
|--------|------------|-------|-------|-----|
| Active | `#ECFDF5` | `#059669` | `#A7F3D0` | Activo, alto, éxito |
| Medium | `#FEF3C7` | `#D97706` | `#FCD34D` | Pendiente, medio |
| Low | `#F3F4F6` | `#6B7280` | `#D1D5DB` | Inactivo, bajo |
| Urgent | `#FEF2F2` | `#DC2626` | `#FECACA` | Urgente, error |
| Info | `#DBEAFE` | `#2563EB` | `#93C5FD` | Información |

## Tipografía

- **Familia**: Inter (400, 500, 600)
- **Tamaños**:
  - `xs`: 12px - Etiquetas, metadata
  - `sm`: 14px - Texto secundario, cuerpo de tabla
  - `base`: 16px - Texto normal
  - `lg`: 18px - Títulos de página
  - `xl`: 20px - Títulos destacados
  - `2xl`: 24px - Números grandes en stats

## Espaciado

Grid de 8px:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px

## Border Radius

- `sm`: 4px
- `md`: 6px (default para cards y badges)
- `lg`: 8px
- `xl`: 12px

## Componentes

### AdminPageHeader
```tsx
<AdminPageHeader 
  title="Título de Página" 
  description="Descripción opcional"
  actions={<Button>Acción</Button>}
/>
```

### AdminStatsCard
```tsx
<AdminStatsCard 
  label="Total Leads" 
  value={42}
  icon={<Users className="h-5 w-5" />}
  trend={{ value: 12, isPositive: true }}
/>
```

### AdminCard
```tsx
<AdminCard padding="md" hover>
  Contenido de la tarjeta
</AdminCard>
```

### AdminBadge
```tsx
<AdminBadge variant="active">Activo</AdminBadge>
<AdminBadge variant="pending">Pendiente</AdminBadge>
<AdminBadge variant="urgent">Urgente</AdminBadge>
```

### AdminTable (con zebra striping)
```tsx
<AdminTable>
  <AdminTableHeader>
    <tr>
      <AdminTableHead sortable>Nombre</AdminTableHead>
      <AdminTableHead>Estado</AdminTableHead>
    </tr>
  </AdminTableHeader>
  <AdminTableBody>
    <AdminTableRow>
      <AdminTableCell>Item 1</AdminTableCell>
      <AdminTableCell><AdminBadge variant="active">Activo</AdminBadge></AdminTableCell>
    </AdminTableRow>
  </AdminTableBody>
</AdminTable>
```

## Uso del Theme en TypeScript

```tsx
import { 
  adminTheme,
  getStatusStyles,
  getStatusClasses,
  getPriorityStyles,
  getPriorityClasses
} from '@/components/admin/ui/admin-theme';

// Obtener estilos de estado
const styles = getStatusStyles('active');
// { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', label: 'Activo', ... }

// Obtener clases Tailwind
const classes = getStatusClasses('active');
// "bg-emerald-50 text-emerald-700 border-emerald-200"
```

## Clases CSS Utilitarias

```css
.admin-layout      /* Aplica fuente Inter y fondo general */
.admin-card        /* Card estándar con padding 24px */
.admin-card-sm     /* Card con padding 16px */
.admin-badge       /* Badge base */
.admin-badge-active, .admin-badge-medium, .admin-badge-low, .admin-badge-urgent
.admin-stats-card  /* Stats card */
.admin-page-title  /* Título 18px semibold */
.admin-page-description /* Descripción 14px regular */
.admin-button-primary   /* Botón primario bg-gray-900 */
.admin-button-secondary /* Botón secundario outline */
.admin-input       /* Input estándar */
.admin-divider     /* Línea divisoria */
```

## Patrones de Diseño

### Tabla con Zebra Striping
```tsx
<AdminTableBody>
  {/* Las filas impares tienen bg-gray-50/50 */}
  {/* Las filas pares tienen bg-white */}
  {/* Hover: bg-gray-100/50 */}
</AdminTableBody>
```

### Stats Grid
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <AdminStatsCard ... />
  <AdminStatsCard ... />
  <AdminStatsCard ... />
  <AdminStatsCard ... />
</div>
```

### Filter Bar
```tsx
<AdminFilterBar>
  <Select>...</Select>
  <Select>...</Select>
  <Input placeholder="Buscar..." />
</AdminFilterBar>
```
