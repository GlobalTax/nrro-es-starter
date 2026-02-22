
## Exportar presentacion en ingles desde el wizard

### Situacion actual

El wizard ya tiene un selector de idioma (es/en/ca) en el Step 1, y toda la infraestructura multilingue esta lista:

- `generatePresentationHTML.ts` tiene TODOS los textos estaticos traducidos (taglines, diferenciadores, KPIs, valores, metodologia, CTAs, traducciones UI) en es/en/ca
- Los hooks `useServicesSearch`, `useTeamMembers` y `useCaseStudies` ya aceptan `language` y devuelven datos localizados desde la BD
- El wizard ya pasa `language` a estos hooks (lineas 123-125)

### Problema

Cuando el usuario selecciona servicios, equipo o casos en un idioma (ej. espanol) y luego cambia el idioma a ingles, los items **ya seleccionados** conservan los textos del idioma original porque se almacenan como copia en el estado (`selectedServices`, `selectedTeamMembers`, `selectedCaseStudies`).

### Solucion

Actualizar `PresentationBuilderDialog.tsx` para re-sincronizar los textos de los items seleccionados cuando cambie el idioma. Al cambiar `language`, se recalculan los items seleccionados usando los datos recien cargados del hook (que ya vienen en el nuevo idioma).

### Cambios en `PresentationBuilderDialog.tsx`

1. **Importar `useEffect`** (anadirlo al import de React si no esta)

2. **Anadir un `useEffect`** que observe cambios en `language` y en los datos cargados (`services`, `teamMembers.data`, `caseStudies.data`). Cuando cambien:
   - Recorrer `selectedServices` y para cada item, buscar su `id` en el array `services` (ya localizado). Si lo encuentra, actualizar `name`, `area`, `description`, `features`, `benefits` con los valores del nuevo idioma. Si no lo encuentra, mantener el original.
   - Hacer lo mismo con `selectedTeamMembers` cruzando con `teamMembers.data` (actualizar `position`, `bio`, `specialization`)
   - Hacer lo mismo con `selectedCaseStudies` cruzando con `caseStudies.data` (actualizar `title`, `results_summary`, `challenge`, `solution`)

3. **Sin cambios en la UI**: el selector de idioma ya existe y funciona. Al seleccionar "English", los datos se recargan, el effect re-sincroniza los seleccionados, y el preview se regenera automaticamente en ingles.

### Detalle tecnico del useEffect

```text
useEffect cuando [language, services, teamMembers, caseStudies] cambian:
  - Para cada servicio seleccionado:
      buscar en services[] por id
      si existe -> actualizar name, area, description, features, benefits
  - Para cada team member seleccionado:
      buscar en teamMembers[] por id
      si existe -> actualizar position, bio, specialization
  - Para cada case study seleccionado:
      buscar en caseStudies[] por id
      si existe -> actualizar title, results_summary, challenge, solution
```

### Archivos afectados

- `src/components/admin/presentations/PresentationBuilderDialog.tsx` -- unico archivo a modificar

### Sin cambios en

- `src/lib/generatePresentationHTML.ts` -- ya soporta es/en/ca
- `supabase/functions/generate-presentation-pdf/index.ts` -- ya genera en el idioma indicado
- Hooks de datos -- ya aceptan `language`
- Base de datos -- columnas multilingues ya existen
