

## Plan: Cambiar tipografía de la intranet de Inter a General Sans

### Cambios

**1. `src/styles/admin-tokens.css`** — Reemplazar `'Inter'` por `'General Sans'` en la variable `--admin-font-family`

**2. `src/components/admin/ui/admin-theme.ts`** — Cambiar `fontFamily` de `'Inter'` a `'General Sans'`

**3. `index.html`** — Eliminar la importación de Google Fonts `Inter` (ya no es necesaria; General Sans se carga localmente desde `public/fonts/`)

Mantenemos los mismos pesos (300 Light, 400 Regular, 500 Medium, 600 Semibold) que ya están disponibles en los archivos `@font-face` de General Sans.

