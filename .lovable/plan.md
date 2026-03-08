

## Plan: Redisenar la intranet al estilo del screenshot (sidebar blanco, flat nav)

El screenshot muestra un estilo muy diferente al Apollo oscuro actual. Es un sidebar **blanco** con navegacion plana y secciones visibles, sin collapsibles.

### Cambios principales

**1. AdminSidebar.tsx — Reescritura completa**
- Fondo: blanco (`bg-white`) con borde derecho sutil
- Logo: "nrroCRM" en texto simple arriba a la izquierda
- Secciones: headers en gris uppercase pequeño (PRINCIPAL, CONTACTOS, PRODUCTIVIDAD, CONFIGURACIÓN, IA & ACADEMIA, ACCIONES RÁPIDAS) — sin collapsibles, siempre visibles
- Items: texto gris oscuro, icono a la izquierda, sin indentación extra
- Active state: fondo indigo/azul claro sutil, texto bold
- Mas items de navegación visibles (Casos, Escrituras, Propuestas, Personas Físicas, Empresas, Tareas, Time Tracking, Cuotas Recurrentes, Calendario, Salas, Panel Ocupación, Equipos, Documentos, Usuarios del Sistema, Integraciones, Reportes, Academia, Admin Academia, Asistente IA, Admin IA)
- Sección "Acciones Rápidas" al fondo con items prefijados con `+`
- "Asistente IA" en la parte inferior como item fijo

**2. AdminHeader.tsx — Adaptar**
- Mantener search bar pero alinear con el estilo del screenshot (borde mas sutil)
- Zona derecha: notificaciones, reloj, usuario con badge "partner"

**3. AdminLayout.tsx — Ajuste menor**
- Content area sigue siendo `bg-gray-50` — sin cambios relevantes

**4. admin-theme.ts — Actualizar palette**
- Sidebar colors: blanco, bordes gray-200, text gray-700

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/admin/AdminSidebar.tsx` | Reescritura: sidebar blanco, flat sections, mas items |
| `src/components/admin/AdminHeader.tsx` | Ajustes menores de estilo |
| `src/components/admin/AdminLayout.tsx` | Ajuste sidebar width/bg |
| `src/components/admin/ui/admin-theme.ts` | Palette sidebar blanco |

**Nota**: Los nuevos items de navegación (Casos, Escrituras, etc.) apuntarán a rutas placeholder (`/admin/cases`, `/admin/deeds`, etc.) que aún no existen — se crearán como páginas en blanco con un mensaje "Próximamente" para evitar 404s.

