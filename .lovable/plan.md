

## Plan: Corregir la tipografía de la intranet — cargar Inter

### Problema
La hoja de estilos `admin-tokens.css` y `admin-theme.ts` definen `'Inter'` como fuente de la intranet, pero **Inter nunca se carga**. En `index.html` línea 72, solo se importan `Plus Jakarta Sans` y `Roboto Mono`. El navegador cae al fallback `system-ui`.

### Solución

**1 solo archivo: `index.html` (línea 72)**

Añadir `Inter:wght@300;400;500;600` al `<link>` de Google Fonts existente. Los pesos 300 (Light) y 400 (Regular) son los principales según el design system; 500 y 600 se usan en badges y botones.

Cambiar línea 72 de:
```
family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Roboto+Mono:wght@300;400;500;600;700
```
a:
```
family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Roboto+Mono:wght@300;400;500;600;700
```

No se tocan más archivos. La definición en `admin-tokens.css` y `admin-theme.ts` ya es correcta.

