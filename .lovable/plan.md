

## Current State Assessment

All three layers of the SEO canonical fix are already in place:

### Already Done
1. **index.html inline script** (lines 19-37) — Updates canonical, og:url, and hreflang dynamically before React loads, based on `window.location.pathname`. Uses `https://nrro.es` as base.

2. **Meta.tsx normalization** (lines 90-106) — Intercepts all `canonicalUrl` props (including the 17 pages using `window.location.origin`), extracts the pathname, and prepends `BASE_DOMAIN`. Preview domains never leak.

3. **seo-prerender Edge Function** — Has a comprehensive route map with 35+ routes, all with correct `https://nrro.es` canonicals, hreflang, and body content for bots.

### Remaining Gap: AhrefsBot Detection in Proxy

The "crawled: 0" issue means AhrefsBot is not being routed to the seo-prerender function. This is an **external configuration** issue — the Cloudflare Worker (or whatever proxy sits in front of the site) needs to include `AhrefsBot` in its User-Agent detection list.

This cannot be fixed from Lovable — it requires updating the external proxy configuration.

### No Code Changes Needed

The codebase is correctly configured. The Ahrefs Health Score of 3 will improve once:
- The inline script fix (already deployed) takes effect on next crawl
- The external proxy is configured to serve prerendered HTML to AhrefsBot

If you want, I can verify the seo-prerender function is deployed and responding correctly by calling it directly, or help you draft the Cloudflare Worker user-agent detection update.

