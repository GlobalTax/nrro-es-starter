

## Plan: Optimizar title tags y meta descriptions por pagina

### Situacion actual

Todas las paginas YA tienen el componente `<Meta>` integrado y funcionando. Los valores se leen de las traducciones en `public/locales/{es,ca,en}/common.json`. No hace falta instalar nada ni anadir `<Helmet>` — el sistema actual ya es equivalente.

**Nota importante sobre las URLs**: Las rutas mencionadas en tu prompt (`/es/solucion-fiscal`, `/es/orientacion-global`, `/es/sobre-navarro`) no existen en la app. Las rutas reales son:

| URL solicitada | Ruta real en la app |
|---|---|
| `/es/solucion-fiscal` | `/servicios` (listado de servicios) |
| `/es/orientacion-global` | Servicio dinamico via `/servicios/:slug` |
| `/es/sobre-navarro` | `/nosotros` |
| `/es/equipo` | `/equipo` |
| `/blog` | `/blog` |
| `/ley-beckham` | `/ley-beckham` |
| `/en/` | `/en` |

### Que hay que cambiar

Solo actualizar los textos de las claves de traduccion `meta.title` y `meta.description` en los 3 archivos de locales para que sean mas descriptivos y optimizados para SEO.

---

### Cambios concretos

#### Archivo: `public/locales/es/common.json`

| Clave | Valor actual | Nuevo valor |
|---|---|---|
| `index.meta.title` | "Navarro Tax Legal \| Asesoria Fiscal y Legal para Empresas Familiares" | "NRRO - Asesoria Fiscal y Legal en Barcelona \| +25 Anos" |
| `index.meta.description` | "Asesoramiento estrategico, fiscal y legal..." | "Asesoria fiscal, contable, laboral y legal para empresas en Barcelona. +25 anos de experiencia, +60 profesionales. Primera consulta gratuita." |
| `services.meta.title` | "Servicios" | "Asesoria Fiscal en Barcelona \| Servicios para Empresas y Autonomos" |
| `services.meta.description` | (actual) | "Asesor fiscal en Barcelona para empresas, autonomos y particulares. IRPF, IVA, Impuesto de Sociedades, planificacion fiscal internacional. +25 anos. Consulta gratuita." |
| `about.meta.title` | "Nosotros - Navarro Tax Legal" | "Sobre NRRO \| Asesoria Lider en Barcelona \| +60 Profesionales" |
| `about.meta.description` | "25 anos de experiencia..." | "NRRO - Navarro Tax & Legal, despacho multidisciplinar en Barcelona con +25 anos de experiencia. +60 profesionales especializados en fiscal, legal, laboral y mercantil." |
| `team.meta.title` | "Equipo" | "Nuestro Equipo \| +60 Profesionales \| NRRO Navarro Tax & Legal" |
| `team.meta.description` | (actual) | "Conoce al equipo de NRRO: abogados, asesores fiscales, economistas y profesionales especializados al servicio de empresas y particulares en Barcelona." |
| `blog.meta.title` | "Blog - NRRO" | "Blog Fiscal y Legal \| Novedades 2026 \| NRRO Barcelona" |
| `blog.meta.description` | (actual) | "Articulos sobre novedades fiscales, laborales y legales en Espana. Guias practicas para empresas, autonomos y particulares en Barcelona." |
| `leyBeckham.seo.title` | "Ley Beckham - Regimen Fiscal Especial..." | "Ley Beckham 2026 \| Regimen Impatriados Espana \| NRRO Barcelona" |
| `leyBeckham.seo.description` | (actual) | "Expertos en Ley Beckham en Barcelona. Asesoramiento completo para profesionales extranjeros: requisitos, ventajas fiscales, solicitud y planificacion." |

#### Archivo: `public/locales/en/common.json`

| Clave | Nuevo valor |
|---|---|
| `index.meta.title` | "NRRO - Tax & Legal Advisory in Barcelona \| 25+ Years Experience" |
| `index.meta.description` | "Tax, accounting, and legal advisory firm in Barcelona for businesses and individuals. Beckham Law, international taxation, company formation. Free consultation." |
| `team.meta.title` | "Our Team \| 60+ Professionals \| NRRO Navarro Tax & Legal" |
| `blog.meta.title` | "Tax & Legal Blog \| Latest Updates \| NRRO Barcelona" |

#### Archivo: `public/locales/ca/common.json`

Mismas claves actualizadas con equivalentes en catalan (ajustados al contexto linguistico).

---

### Detalles tecnicos

- No se instala ninguna libreria nueva
- No se modifica ningun componente `.tsx`
- Solo se editan 3 archivos JSON de traducciones
- El componente `Meta.tsx` existente ya aplica estos valores automaticamente al DOM
- Los canonical URLs se generan automaticamente via `useAlternateUrls` segun la ruta actual

