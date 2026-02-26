

## Siguiente ronda de mejoras SEO

Hay varias brechas importantes entre las paginas que existen, las rutas configuradas, el sitemap y el sistema de prerendering. Resolverlas mejorara la indexacion y evitara paginas "fantasma".

---

### 1. Pagina HerenciasBarcelona sin ruta

La pagina `HerenciasBarcelona.tsx` existe con contenido SEO completo (H1 optimizado, FAQ, casos reales), pero **no tiene ruta en App.tsx**. Es completamente inaccesible.

**Accion:** Anadir ruta `/es/abogados-herencias-barcelona` en App.tsx.

---

### 2. Paginas sin metadata en seoRouteMap.ts

Estas paginas tienen ruta pero faltan en el mapa de SEO, asi que el prerenderer les sirve metadata generica:

| Ruta | Pagina |
|---|---|
| `/es/abogados-herencias-barcelona` | HerenciasBarcelona (nueva) |
| `/en/company-setup-calculator` | CompanySetupCalculator |
| `/en/nie-spain-foreigners` | NIEServiceSpain |
| `/en/startup-company-setup-spain` | TechStartupSetup |
| `/en/fast-company-registration-spain` | ExpressCompanySetup |
| `/orquest-kairoshr` | OrquestKairosHR |
| `/insights` | Insights |

**Accion:** Anadir entradas con title, description y keywords unicos para cada una en `seoRouteMap.ts`.

---

### 3. Sincronizar Edge Function seo-prerender

La Edge Function tiene su propio mapa de rutas duplicado. Las nuevas rutas del punto 2 deben anadirse tambien ahi, incluyendo `bodyContent` con texto estatico que los bots puedan leer.

**Accion:** Actualizar `supabase/functions/seo-prerender/index.ts` con las rutas nuevas y redesplegar.

---

### 4. Anadir HerenciasBarcelona al sitemap.xml

La pagina de herencias es una landing de alto valor SEO ("abogados herencias barcelona" es un termino con intencion comercial alta). Debe estar en el sitemap con prioridad 0.8.

**Accion:** Anadir entrada en `public/sitemap.xml`.

---

### 5. Actualizar robots.txt

El archivo actual apunta a `https://nrro.es/sitemap.xml` pero falta la referencia al sitemap dinamico. Tambien se puede mejorar con directivas mas especificas.

**Accion:** Revisar y actualizar `public/robots.txt`.

---

### Resumen de archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/App.tsx` | Anadir ruta `/es/abogados-herencias-barcelona` |
| `src/lib/seoRouteMap.ts` | Anadir ~7 rutas con metadata SEO |
| `supabase/functions/seo-prerender/index.ts` | Anadir rutas con bodyContent + redesplegar |
| `public/sitemap.xml` | Anadir herencias y paginas faltantes |
| `public/robots.txt` | Mejoras menores |

### Prioridad

1. Ruta de HerenciasBarcelona (pagina lista, solo falta conectarla)
2. seoRouteMap completo (impacto en prerendering de todas las paginas)
3. Edge Function sync + redeploy
4. Sitemap actualizado

