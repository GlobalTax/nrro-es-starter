

## Plan: Fix All Canonicals Pointing to Homepage

### Problem
The static `index.html` has `<link rel="canonical" href="https://nrro.es/" />` hardcoded. For crawlers that don't execute React (like AhrefsBot), **every page reports its canonical as the homepage**, causing 287 "duplicate pages without canonical" errors.

The existing `Meta.tsx` component correctly updates canonicals via React, but this only works after JS execution — too late for many crawlers.

### Solution: Add Inline Script to `index.html`

**File: `index.html`** (lines 13-18)

Add `id` attributes to canonical and hreflang links, then add an inline `<script>` immediately after them that:
- Reads `window.location.pathname`
- Updates the canonical to `https://nrro.es{pathname}`
- Updates hreflang links dynamically based on whether the path starts with `/ca/`, `/en/`, or neither
- Updates `og:url` meta tag

This runs **before React loads**, so even crawlers that execute minimal JS will get correct canonicals. For crawlers that execute zero JS, the static fallback remains (unavoidable in an SPA without SSR/prerendering).

```html
<!-- Canonical & Hreflang -->
<link rel="canonical" href="https://nrro.es/" id="canonical-tag" />
<link rel="alternate" hreflang="es" href="https://nrro.es/" id="hreflang-es" />
<link rel="alternate" hreflang="ca" href="https://nrro.es/ca/" id="hreflang-ca" />
<link rel="alternate" hreflang="en" href="https://nrro.es/en/" id="hreflang-en" />
<link rel="alternate" hreflang="x-default" href="https://nrro.es/" />

<script>
(function(){
  var p=location.pathname.replace(/\/+$/,'')||'/';
  var b='https://nrro.es';
  var c=b+(p==='/'?'':p);
  var d=document;
  var cl=d.getElementById('canonical-tag');
  if(cl)cl.href=c;
  var og=d.querySelector('meta[property="og:url"]');
  if(og)og.content=c;
  var isCA=p.startsWith('/ca'),isEN=p.startsWith('/en');
  var es=isCA?p.replace('/ca',''):isEN?p.replace('/en',''):p;
  var ca=isCA?p:'/ca'+(p==='/'?'':p);
  var en=isEN?p:'/en'+(p==='/'?'':p);
  var he=d.getElementById('hreflang-es');if(he)he.href=b+es;
  var hc=d.getElementById('hreflang-ca');if(hc)hc.href=b+ca;
  var hn=d.getElementById('hreflang-en');if(hn)hn.href=b+en;
})();
</script>
```

No other files need changes — `Meta.tsx` already normalizes `window.location.origin` to `BASE_DOMAIN` for React-rendered pages. The CSP already allows `'unsafe-inline'` scripts.

### Scope
- 1 file modified: `index.html` (lines 13-18 replaced with canonical/hreflang links + inline script)

### Expected Impact
- Crawlers executing minimal JS will see correct per-page canonicals
- Hreflang tags will correctly reflect the current language variant
- Health score should improve significantly on next Ahrefs crawl

