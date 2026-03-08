

## Audit: robots.txt, sitemap y rutas públicas

### Estado actual de robots.txt ✅
- Correctamente bloquea `/admin/` y `/presentation-preview/`
- Apunta a ambos sitemaps (estático y dinámico)
- Incluye referencia a `llms.txt`
- **Sin problemas detectados**

### Problemas detectados en el Sitemap

He cruzado las rutas de `App.tsx` (lo que existe), `seoRouteMap.ts` (lo que tiene SEO) y `regenerate-sitemap` (lo que se indexa). Hay gaps importantes:

#### A. Rutas en App.tsx que FALTAN en el sitemap (no se indexan)

| Ruta | Tipo | Impacto |
|------|------|---------|
| `/estrategia`, `/ca/estrategia`, `/en/strategy` | Estática trilingüe | Alto — página de negocio |
| `/sectores`, `/ca/sectors`, `/en/sectors` | Estática trilingüe | Alto — página de negocio |
| `/recursos`, `/ca/recursos`, `/en/resources` | Estática trilingüe | Alto — lead magnet |
| `/set-up-company-spain` | Landing EN | Alto — conversión internacional |
| `/en/set-up-company-spain` | Landing EN | Alto — duplicado intencional |
| `/crear-empresa-espana` | Landing ES | Alto — conversión |
| `/ca/crear-empresa-espanya` | Landing CA | Medio |
| `/en/company-setup-calculator` | Landing EN | Alto — herramienta interactiva |
| `/en/nie-spain-foreigners` | Landing EN | Alto — búsqueda internacional |
| `/en/startup-company-setup-spain` | Landing EN | Alto — nicho startup |
| `/en/fast-company-registration-spain` | Landing EN | Alto — nicho express |
| `/es/abogados-herencias-barcelona` | Landing ES | Alto — local SEO |
| `/canal-denuncias` | Legal | Bajo — obligación legal, no SEO |

#### B. Rutas en sitemap que NO existen en App.tsx (404 potenciales)

| Ruta en sitemap | Problema |
|-----------------|----------|
| `/es/contacto` | No hay ruta — el contacto es `/contacto` |
| `/es/orientacion-global` | No hay ruta en App.tsx |
| `/es/compliance-penal` | No hay ruta en App.tsx |
| `/es/due-diligence` | No hay ruta en App.tsx |
| `/es/proteccion-datos-rgpd` | No hay ruta en App.tsx |
| `/es/segunda-oportunidad` | No hay ruta en App.tsx |
| `/es/constitucion-sociedades` | No hay ruta en App.tsx |
| `/es/sobre-navarro` | No hay ruta en App.tsx |
| `/en/services/accounting-and-labor-consulting` | No hay ruta en App.tsx |

**Nota**: Estas 9 rutas están en `seoRouteMap` y en `serviceLandingPages` del sitemap, pero nunca se crearon como `<Route>` en App.tsx. Los bots las indexan pero dan 404 o fallback genérico.

### Plan de corrección

**1. Añadir rutas faltantes al sitemap** (`regenerate-sitemap/index.ts`)

- Añadir a `staticRoutes`: `estrategia`, `sectores`, `recursos`
- Añadir a `serviceLandingPages`: las 7 landings EN de company setup + `abogados-herencias-barcelona` + `canal-denuncias`

**2. Limpiar rutas fantasma del sitemap**

- Eliminar de `serviceLandingPages` las 9 rutas que no tienen `<Route>` en App.tsx (o marcar para crear las páginas en el futuro)

**3. Redesplegar la Edge Function**

- Tras los cambios, redesplegar `regenerate-sitemap` para que el próximo sitemap generado sea correcto

**Archivos a modificar:**
- `supabase/functions/regenerate-sitemap/index.ts` — añadir rutas faltantes y eliminar fantasma

**Sin cambios en:**
- `robots.txt` — está correcto
- `seoRouteMap.ts` — las entradas extra no causan daño (solo sirven si se crean las rutas)

