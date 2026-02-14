

## Integrar TeamMosaicHero en la pagina /equipo

### Cambio

**Archivo: `src/pages/Team.tsx`**

Reemplazar el hero actual (la seccion negra con badge, titulo y subtitulo, lineas ~63-78) por el componente `TeamMosaicHero`, manteniendo todo lo demas (breadcrumb, filtros, grid de tarjetas).

### Que se elimina

La seccion hero actual:
```tsx
<section className="bg-black py-32 md:py-48 text-center">
  ...BadgeHero, h1, p...
</section>
```

### Que se anade

```tsx
import { TeamMosaicHero } from "@/components/team/TeamMosaicHero";

<TeamMosaicHero
  title={t('team.hero.title')}
  subtitle={t('team.hero.subtitle')}
  ctaText={t('cta.contact')}
  ctaLink="/contacto"
/>
```

### Resultado

- El hero pasa a ser el mosaico de fotos del equipo con overlay y texto
- Se reutilizan las traducciones existentes para titulo y subtitulo
- El resto de la pagina (breadcrumb, filtros, grid de tarjetas) permanece sin cambios

