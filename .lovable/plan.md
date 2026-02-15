

## Plan: Enriquecer Schema markup con LegalService

### Situacion actual

Ya existe un componente `OrganizationSchema.tsx` que inyecta un JSON-LD de tipo `Organization` en todas las paginas (via `Layout.tsx` y `LandingLayout.tsx`). Este schema es correcto pero generico.

### Que hay que hacer

Ampliar `OrganizationSchema.tsx` para anadir un **segundo schema** de tipo `LegalService` que complementa al `Organization` existente. Esto mejora el SEO local y la visibilidad en Google para busquedas de servicios legales/fiscales en Barcelona.

### Cambios

#### Archivo: `src/components/seo/OrganizationSchema.tsx`

Anadir un segundo bloque JSON-LD con `@type: "LegalService"` que incluye:

- Datos del negocio actualizados (direccion: Ausias March 36, Principal, 08010)
- `numberOfEmployees`: 60
- `foundingDate`: "1998"
- `priceRange`: "$$"
- `openingHours`: "Mo-Fr 09:00-18:00"
- `areaServed`: Barcelona
- `hasOfferCatalog` con los 5 servicios principales (Fiscal, Contable, Laboral, Legal, Fiscalidad Internacional)
- `sameAs` con LinkedIn e Instagram desde settings

El schema se inyecta como un script separado con `id="legalservice-schema"`, usando el mismo patron de `useEffect` + cleanup que ya usa el schema de Organization.

### Nota sobre la direccion

Tu prompt indica "Ausias March 36, Principal, 08010" pero el schema actual tiene "Av. Diagonal 640, 2o 1a, 08017". Se usara la direccion de tu prompt para el nuevo schema. Si necesitas actualizar tambien el schema Organization, indicalo.

### Detalles tecnicos

- Un solo archivo modificado: `src/components/seo/OrganizationSchema.tsx`
- Se anade un segundo `useEffect` o se extiende el existente para crear dos scripts JSON-LD
- No se instala ninguna dependencia
- No se modifican otros componentes

