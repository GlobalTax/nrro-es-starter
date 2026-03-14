

## Plan: Update robots.txt for capittal.es domain

### Current State
The `public/robots.txt` file currently:
- Targets specific bots (Googlebot, Bingbot, Twitterbot, facebookexternalhit) individually
- Blocks `/admin/` and `/presentation-preview/` paths
- Points to `nrro.es` domain sitemaps
- Includes LLMs-Txt directive

### Requested Change
Replace entire file with simplified version:
- Single `User-agent: *` directive
- Allow all paths (no Disallow rules)
- Change domain from `nrro.es` to `capittal.es`
- Single sitemap reference: `https://capittal.es/sitemap.xml`
- Remove edge function sitemap and LLMs-Txt

### Impact Analysis
**Removes protections:**
- `/admin/` will become crawlable by bots
- `/presentation-preview/` will become crawlable
- No specific bot targeting

**Domain change:**
- `nrro.es` → `capittal.es` (confirms domain migration or separate project)

### File Modified
- `public/robots.txt` - complete replacement with 4-line version

### Post-deployment Verification
1. Check `https://capittal.es/robots.txt` renders correctly
2. Add sitemap in Google Search Console: Sitemaps → Add `sitemap.xml` → Submit

