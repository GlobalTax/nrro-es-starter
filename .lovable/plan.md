

## Hero con mosaico de fotos del equipo

### Objetivo
Crear un componente hero que muestre las fotos de todos los miembros del equipo en un grid/mosaico visual similar a la imagen de referencia, con fotos en escala de grises y efecto hover.

### Componente: `TeamMosaicHero`

**Archivo nuevo**: `src/components/team/TeamMosaicHero.tsx`

- Carga los miembros del equipo desde Supabase usando el hook `useTeamMembers`
- Muestra las fotos en un **CSS Grid responsivo** (8 columnas en desktop, 5 en tablet, 3 en mobile)
- Cada foto se presenta en formato cuadrado (`aspect-square`) con `object-cover`
- Fotos en **escala de grises** por defecto, con color al hacer hover (como ya hacen las `TeamMemberCard`)
- Sin espacios entre fotos (gap-0) para lograr el efecto mosaico compacto de la imagen de referencia
- Overlay con gradiente oscuro para superponer texto (titulo + subtitulo + CTA)

### Estructura visual

```text
+--------------------------------------------------+
|  [foto][foto][foto][foto][foto][foto][foto][foto] |
|  [foto][foto][foto][foto][foto][foto][foto][foto] |
|  [foto][foto][foto][foto][foto][foto][foto][foto] |
|  [foto][foto][foto][foto][foto][foto][foto][foto] |
|                                                    |
|        === Overlay con texto ===                   |
|        "Nuestro equipo"                            |
|        "33 profesionales a tu servicio"             |
|        [Contacta con nosotros]                     |
+--------------------------------------------------+
```

### Detalles tecnicos

1. **Datos**: Se reutiliza `useTeamMembers(language)` del hook existente
2. **Grid CSS**: `grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-0`
3. **Fotos**: `grayscale hover:grayscale-0 transition-all duration-300`
4. **Overlay**: Gradiente `bg-gradient-to-t from-black/70 via-black/30 to-transparent` posicionado absolute sobre el grid
5. **Texto**: Blanco sobre el overlay, centrado en la parte inferior
6. **Animacion**: Fade-in con framer-motion al cargar
7. **Fallback**: Si un miembro no tiene foto, se muestra su inicial (como en `TeamMemberCard`)

### Integracion

Se podra usar en cualquier pagina importando el componente. No se cambiara ninguna pagina existente automaticamente — se dejara listo para que lo integres donde prefieras (por ejemplo, en la pagina `/equipo` o en la home).
