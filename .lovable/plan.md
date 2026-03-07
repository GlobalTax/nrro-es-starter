

## Instalar DataFast analytics

Dos cambios en `index.html`:

1. **Anadir el script** de DataFast en el `<head>`, despues de los otros trackers (Apollo), con `defer`:
```html
<script defer data-website-id="dfid_nO0AVDjmkidRALtVwnkii" data-domain="nrro.es" src="https://datafa.st/js/script.js"></script>
```

2. **Actualizar CSP** para permitir `https://datafa.st` en `script-src` y `connect-src`.

Tambien actualizar la CSP en `vite.config.ts` (cabeceras del dev server) para consistencia.

| Archivo | Cambio |
|---|---|
| `index.html` | Anadir script + actualizar CSP meta tag |
| `vite.config.ts` | Anadir `https://datafa.st` a CSP headers |

