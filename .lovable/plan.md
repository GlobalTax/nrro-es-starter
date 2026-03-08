

## Plan: Redisenar la intranet al estilo Apollo.io

Tras analizar Apollo.io (login, dashboard screenshots, Dribbble shots del equipo de Apollo), las diferencias principales con tu intranet actual son:

### Cambios de diseno Apollo.io

**1. Sidebar (AdminSidebar.tsx)**
- Fondo: cambiar de `slate-900` a un azul oscuro profundo (`#1B1F3B` / navy) como Apollo
- Active state: pill con fondo `indigo-500/15` y borde izquierdo `indigo-400` (en vez de `white/10`)
- Hover: mas sutil, `white/[0.04]`
- Logo area: mas compacta, con icono tipo snowflake como Apollo
- Separadores: mas sutiles, `white/[0.04]`
- Font sizes: ligeramente mas pequenos para mayor densidad

**2. Header (AdminHeader.tsx)**
- Anadir barra de busqueda global tipo Command Palette (Cmd+K) centrada, estilo Apollo
- Fondo blanco puro (sin backdrop-blur), borde inferior mas sutil
- Notificaciones y perfil a la derecha, mas compactos

**3. Dashboard (AdminDashboard.tsx)**
- KPI cards: borde mas sutil, icono a la izquierda inline (no en circulo), estilo Apollo data cards
- Tipografia: valores grandes bold, labels en gris claro small

**4. Theme (admin-theme.ts)**
- Actualizar colores primarios: navy sidebar, indigo accents
- Anadir constantes Apollo-specific

**5. AdminComponents.tsx**
- Cards: shadow-none, border `gray-100`, hover border `gray-200`
- Tables: header row mas compacto, sin uppercase, font-medium gris
- Badges: mas redondeados (pill style)

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/admin/AdminSidebar.tsx` | Navy bg, indigo active states, compactar |
| `src/components/admin/AdminHeader.tsx` | Command search bar, cleaner layout |
| `src/components/admin/AdminLayout.tsx` | Ajuste bg content area |
| `src/components/admin/ui/admin-theme.ts` | Navy/indigo palette |
| `src/components/admin/ui/AdminComponents.tsx` | Cards/tables mas Apollo |
| `src/pages/admin/AdminDashboard.tsx` | KPI cards estilo Apollo |

No se crean archivos nuevos. No hay cambios en la web publica.

