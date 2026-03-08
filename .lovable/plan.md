

## Plan: Eliminar módulo Empleados

El módulo de Empleados (7 registros, equipo pequeño) se elimina de la UI admin. Las tablas en Supabase se mantienen intactas.

### Cambios

**1. Sidebar** — `AdminSidebar.tsx`
- Eliminar el item `{ path: '/admin/empleados', ... }` de la sección "Equipo"
- Si "Ofertas" queda solo, renombrar el grupo o moverlo a otra sección

**2. Dashboard** — `AdminDashboard.tsx`  
- Eliminar la KPI card "Empleados activos" que enlaza a `/admin/empleados`
- Actualizar `useDashboardStats.ts` para no consultar la tabla empleados

**3. Eliminar archivos**
- `src/pages/admin/AdminEmpleados.tsx`
- `src/components/admin/empleados/EmpleadosTable.tsx`
- `src/components/admin/empleados/EmpleadoDetailSheet.tsx`
- `src/hooks/useEmpleados.ts`

**4. Verificar dependencias**
- `EmpleadoDetailSheet.tsx` importa `useNominas` (ya stub) — se elimina con el archivo
- La ruta `/admin/empleados` no existe en `App.tsx` (ya fue removida), solo queda el enlace en sidebar

**Nota**: No se toca la tabla `empleados` en Supabase. Solo se quita el acceso desde la UI.

