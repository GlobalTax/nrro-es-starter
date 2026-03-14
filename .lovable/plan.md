

## Plan: Update inline SEO script in `index.html`

Replace the current minified inline script (lines 18-37) with the user's improved version that:

1. Adds `id="hreflang-xdefault"` to the x-default link (line 18) so it can be updated dynamically
2. Uses clearer variable names and fixes the `basePath` logic — current version has a bug where stripping `/ca` from `/ca` yields empty string instead of `/`, causing `hreflang-es` to point to `https://nrro.es` (no slash)
3. Also updates `og:locale` dynamically based on language prefix

### Changes

**File: `index.html`** — Replace lines 14-37:

```html
<link rel="canonical" href="https://nrro.es/" id="canonical-tag" />
<link rel="alternate" hreflang="es" href="https://nrro.es/" id="hreflang-es" />
<link rel="alternate" hreflang="ca" href="https://nrro.es/ca/" id="hreflang-ca" />
<link rel="alternate" hreflang="en" href="https://nrro.es/en/" id="hreflang-en" />
<link rel="alternate" hreflang="x-default" href="https://nrro.es/" id="hreflang-xdefault" />
<script>
(function() {
  var BASE = 'https://nrro.es';
  var raw  = window.location.pathname;
  var path = raw === '/' ? '' : raw.replace(/\/+$/, '');
  var canon = BASE + path;
  var cl = document.getElementById('canonical-tag');
  if (cl) cl.href = canon;
  var ogurl = document.querySelector('meta[property="og:url"]');
  if (ogurl) ogurl.content = canon;
  var isCA = path.startsWith('/ca');
  var isEN = path.startsWith('/en');
  var basePath = isCA ? (path.replace(/^\/ca/, '') || '/') : isEN ? (path.replace(/^\/en/, '') || '/') : (path || '/');
  var esHref = BASE + basePath;
  var caHref = BASE + '/ca' + (basePath === '/' ? '' : basePath);
  var enHref = BASE + '/en' + (basePath === '/' ? '' : basePath);
  document.getElementById('hreflang-es').href = esHref;
  document.getElementById('hreflang-ca').href = caHref;
  document.getElementById('hreflang-en').href = enHref;
  document.getElementById('hreflang-xdefault').href = esHref;
  var ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.content = isCA ? 'ca_ES' : isEN ? 'en_US' : 'es_ES';
})();
</script>
```

### Scope
- 1 file: `index.html` (lines 14-37)

