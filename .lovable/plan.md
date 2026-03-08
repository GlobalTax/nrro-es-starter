

## Plan: Eliminar títulos en bold de la intranet

El usuario quiere que no haya títulos en negrita en la intranet. Hay dos ámbitos:

### 1. Sidebar (`AdminSidebar.tsx`)
- Section headers: `font-semibold` → `font-medium`
- Logo "nrroCRM": `font-semibold` → `font-medium`

### 2. Páginas admin (content area)
Cambiar `font-bold` y `font-semibold` a `font-medium` en títulos `<h1>`, `<CardTitle>`, y números de stats en los siguientes archivos:

| Archivo | Instancias aprox. |
|---------|-------------------|
| `AdminSidebar.tsx` | 3 |
| `LandingDashboard.tsx` | ~5 |
| `AdminMarketingAudit.tsx` | 1 |
| `AdminResources.tsx` | 4 |
| `AdminJobPositions.tsx` | 2 |
| `AdminContactLeads.tsx` | ~5 |
| + otros 4 archivos admin | ~10 |

**Regla**: `font-bold` → `font-medium`, `font-semibold` → `font-medium` en todos los títulos y headings de `src/pages/admin/` y `src/components/admin/`.

Los números de estadísticas grandes (stats cards) también pasarán a `font-medium` para mantener consistencia.

