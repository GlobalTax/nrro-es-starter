

## Vista previa en vivo de la presentacion en el wizard

### Resumen

Crear un componente de preview que renderice las slides de la presentacion directamente en el navegador, dentro del Step 4 del wizard, usando la misma logica HTML/CSS que la Edge Function `generate-presentation-pdf`. Esto permite al usuario ver como quedara la presentacion antes de generar el PDF.

### Arquitectura

La Edge Function contiene una funcion `generateHTML()` de ~1300 lineas que produce HTML completo con CSS embebido. La estrategia es:

1. Extraer la logica de generacion de HTML a un archivo compartido en el frontend
2. Renderizar el HTML resultante en un iframe escalado dentro del Step 4
3. El usuario ve un carrusel de slides navegable antes de hacer clic en "Generar PDF"

### Archivos nuevos

**`src/lib/generatePresentationHTML.ts`**
- Portar la funcion `generateHTML()` y todos los datos estaticos (taglines, traducciones, diferenciadores, KPIs, valores, logos SVG, CTAs, etc.) desde `supabase/functions/generate-presentation-pdf/index.ts`
- Exportar como `generatePresentationHTML(params)` que acepta los mismos campos que el wizard ya tiene en estado
- Adaptar los tipos (usar los mismos interfaces `ServiceSummary`, `TeamMemberSummary`, etc. que ya existen en `useGeneratedPresentations.ts`)

**`src/components/admin/presentations/PresentationSlidePreview.tsx`**
- Componente que recibe los datos del wizard y genera el HTML con `generatePresentationHTML()`
- Renderiza un iframe con `srcDoc={html}` escalado al contenedor (similar a `PresentationPreview.tsx`)
- Incluye navegacion entre slides (anterior/siguiente) contando las paginas `.page` del HTML
- Controles: flechas de navegacion, indicador de pagina actual (e.g. "3 / 12"), zoom in/out opcional
- El iframe se escala con `transform: scale()` para caber en el espacio del dialog (~500px de ancho)

### Cambios en archivos existentes

**`src/components/admin/presentations/PresentationBuilderDialog.tsx`**
- Importar `PresentationSlidePreview`
- En el Step 4, reemplazar el bloque estatico de resumen (lineas 731-869) por dos secciones:
  1. La tarjeta de puntuacion de calidad (mantener tal cual, lineas 733-771)
  2. El nuevo componente `PresentationSlidePreview` que recibe todos los estados del wizard como props
- El resumen textual (cliente, servicios, equipo, etc.) se puede mover debajo del preview o dentro de un Collapsible

### Detalles tecnicos

**Escalado del iframe:**
```text
+----------------------------------+
|  Dialog (~700px ancho)           |
|  +----------------------------+  |
|  | Quality Score Card         |  |
|  +----------------------------+  |
|  | +------------------------+ |  |
|  | | iframe (srcDoc)        | |  |
|  | | 1920x1080 o 210x297mm  | |  |
|  | | scale(0.33)            | |  |
|  | +------------------------+ |  |
|  | [<]  Slide 3 / 12  [>]    |  |
|  +----------------------------+  |
|  | Resumen (collapsible)      |  |
|  +----------------------------+  |
+----------------------------------+
```

- Para formato horizontal (1920x1080): escalar a ~600px de ancho -> `scale(0.3125)`
- Para formato vertical (210mm/794px x 297mm/1123px): escalar a ~400px de ancho -> `scale(0.50)`
- El contenedor del iframe tiene altura fija proporcional y `overflow: hidden`

**Navegacion entre slides:**
- Inyectar un script en el HTML que expone `window.slideCount` y permite scroll a slide N via `window.goToSlide(n)`
- O alternativamente, usar CSS scroll-snap en el iframe para navegar entre `.page` divs
- Comunicacion iframe <-> parent via `postMessage`

**Datos que se pasan al preview:**
- Todos los estados del wizard ya disponibles: `clientName`, `clientCompany`, `language`, `format`, `presentationType`, `audienceType`, `selectedServices`, `selectedTeamMembers`, `selectedCaseStudies`, `includeStats`, `customIntro`, `customTagline`, `ctaType`, `qualityMode`
- Se construye un objeto `GeneratedPresentation` mock con estos datos y se pasa a `generatePresentationHTML()`

### Consideraciones

- La generacion de HTML es puramente en el cliente (sin llamada a la Edge Function), asi que es instantanea
- El HTML generado en preview sera identico al que produce la Edge Function porque usa la misma logica
- Si en el futuro se modifica la Edge Function, habra que sincronizar `generatePresentationHTML.ts` -- alternativamente se podria hacer que la Edge Function tambien use este archivo compartido, pero eso requiere cambiar la arquitectura de deploy
- El preview se regenera cada vez que el usuario llega al Step 4 o cambia configuracion

