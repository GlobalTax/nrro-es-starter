

## Diagnosis

### Issue 1: UTF-8 Encoding
The file content in Lovable's editor shows correct UTF-8 characters (ó, í, é, —). The mojibake (`AsesorÃa`, `PlanificaciÃ³n`) happens when the served file is interpreted as Latin-1. The `<meta charset="UTF-8" />` tag is present (line 4), which is correct. The fix is to **recreate the file from scratch** in Lovable to force the editor to save it with a proper UTF-8 BOM/encoding.

**Action**: Delete `index.html`, create a new one with identical content. Lovable's file creation always uses UTF-8.

### Issue 2: Static Canonical for Bots
The static HTML at line 14 has `href="https://nrro.es/"` — bots that don't execute JavaScript (or read the raw HTML) see the homepage canonical for every page. The inline script (line 88-92) fixes this client-side, but that requires JS execution.

**This cannot be fully solved from Lovable alone.** The `seo-prerender` Edge Function already returns correct per-route canonicals — the gap is that the **Cloudflare Worker** must route bot traffic to it. However, we can add one improvement: **embed the canonical directly in the static HTML using a server-side approach**.

Since we can't do true SSR, the pragmatic fix is:
- Ensure the `seo-prerender` Edge Function is deployed and returning correct HTML (it is)
- The Cloudflare Worker must be configured to intercept bot UA and proxy to the Edge Function

### Plan

1. **Recreate `index.html`** — Copy all content, delete file, create new file with identical content to force UTF-8 encoding
2. **No structural changes needed** — The inline script and seo-prerender function are correctly implemented; the encoding fix is the only actionable item from Lovable's side

### What you need to verify externally (Cloudflare)
- Worker route `nrro.es/*` is active
- `PUBLIC_HOST` variable is `nrro.es` (not `nvrro.es`)
- Bot User-Agent list includes `Googlebot`, `AhrefsBot`, `bingbot`
- Worker proxies to the `seo-prerender` Edge Function URL

