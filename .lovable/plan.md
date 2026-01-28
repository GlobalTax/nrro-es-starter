
## Plan: Activar Apollo.io sin restricción GDPR

### Problema

El script de Apollo.io en `index.html` (líneas 40-57) está configurado con:
- `data-cookieconsent="marketing"` 
- `type="text/plain"`

Estos atributos hacen que **Cookiebot bloquee la ejecución del script** hasta que el usuario acepte explícitamente las cookies de marketing. Por eso Apollo lo marca como "Inactive".

### Solución

Eliminar los atributos de bloqueo para que Apollo se cargue automáticamente (igual que en capittal.es).

**Antes:**
```html
<script data-cookieconsent="marketing" type="text/plain">
```

**Después:**
```html
<script>
```

---

### Cambios Técnicos

| Archivo | Cambio |
|---------|--------|
| `index.html` | Quitar `data-cookieconsent="marketing"` y `type="text/plain"` del script de Apollo (línea 41) |

---

### Código Final

```html
<!-- Apollo.io Website Tracker (sin restricción GDPR) -->
<script>
  (function() {
    if (!navigator.onLine || window.location.pathname.startsWith('/admin')) {
      return;
    }
    var n=Math.random().toString(36).substring(7),
        o=document.createElement("script");
    o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
    o.async=!0;
    o.defer=!0;
    o.onerror=function(){ console.debug('[Apollo] Tracker no disponible'); };
    o.onload=function(){
      window.trackingFunctions.onLoad({appId:"663335e26da5c703001459c7"})
    };
    document.head.appendChild(o)
  })();
</script>
```

---

### Resultado Esperado

Después de publicar este cambio:
1. Apollo.io se cargará en todas las visitas a nrro.es y global.nrro.es
2. En el dashboard de Apollo, ambos sitios deberían cambiar de **Inactive** → **Active**
3. Se mantendrá la lógica de excluir rutas `/admin`
