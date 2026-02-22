
## Añadir campo "Tagline personalizado" al wizard de presentaciones

### Resumen

El campo `cover_tagline` ya existe en la base de datos, en el hook (`useGeneratedPresentations.ts`) y en la Edge Function (`generate-presentation-pdf`). La Edge Function ya prioriza el tagline personalizado sobre el automatico. Solo falta exponer el campo en el wizard UI.

### Cambios

**Archivo: `PresentationBuilderDialog.tsx`**

1. Añadir estado `customTagline` (junto a los demas estados del Step 1, linea ~108):
   ```ts
   const [customTagline, setCustomTagline] = useState('');
   ```

2. Añadir el campo en el Step 1 (Configuracion), despues del logo del cliente (~linea 506), con un `Input` o `Textarea`:
   - Label: "Tagline de portada (opcional)"
   - Placeholder: "Ej: Asesoramiento integral para la empresa familiar"
   - Texto de ayuda: "Si se deja vacio, se generara automaticamente segun el tipo de presentacion y audiencia"

3. Pasar `cover_tagline: customTagline || undefined` en `handleGenerate` (~linea 245-263), dentro del objeto que se envia a `createMutation.mutateAsync`.

4. Resetear `customTagline` a `''` en `handleClose` (~linea 279-298).

5. Opcionalmente, mostrar el tagline en el Step 4 (Preview) para que el usuario vea que se usara.

### Sin cambios necesarios en

- `useGeneratedPresentations.ts` — ya acepta `cover_tagline`
- `generate-presentation-pdf` Edge Function — ya lo consume con fallback automatico
- Base de datos — la columna `cover_tagline` ya existe
