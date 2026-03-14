

## Plan: SPA Indexation Fix — Prerender Cache, SEO Debug & Route Registry

### Current State Summary

After thorough codebase review:

- **`seo-prerender` edge function** already exists (520 lines) — generates full HTML with meta, schemas, hreflang for bot consumption. It has an inline route map but no caching, no health scoring, no admin auth.
- **`generate-sitemap`** already exists — generates XML with hreflang from static routes + DB (services, blog, case studies, landings). No admin auth required.
- **`regenerate-sitemap`** also exists — uploads to storage.
- **`<noscript>` block** already present in `index.html` (lines 301-320).
- **`React.lazy()`** is NOT used anywhere — nothing to remove.
- **`onClick + navigate()`** on public pages: NOT found. All instances are in admin components (`AdminHeader`, `AdminLogin`, `LandingDetailPage`, `AuditQuickActions`) or are URL-normalization redirects in detail pages (`BlogDetail`, `ServiceDetail`, `CaseStudyDetail`). No conversion needed.
- **`robots.txt`** does NOT currently block `/admin/`.
- **Route metadata** is duplicated across: `index.html` inline script (R map), `seo-prerender` inline routes, and `regenerate-sitemap` static arrays.

### What Needs to Be Built

#### 1. Centralized Route Registry — `src/data/siteRoutes.ts`

Single source of truth for all ~80 public indexable routes. Each entry:
```typescript
interface SiteRoute {
  path: string;
  title: string;
  description: string;
  h1: string;
  internalLinks: string[];
  lastmod?: string;
  priority: string;
  changefreq: string;
  lang: 'es' | 'ca' | 'en';
  hreflangGroup?: string; // groups es/ca/en variants
}
```
Consolidated from the existing `index.html` R map, `seo-prerender` routes, and `regenerate-sitemap` static arrays.

#### 2. `prerender_cache` Database Table

```sql
CREATE TABLE public.prerender_cache (
  path TEXT PRIMARY KEY,
  html_snapshot TEXT,
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  h2s JSONB DEFAULT '[]',
  internal_links JSONB DEFAULT '[]',
  internal_link_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  rendered_at TIMESTAMPTZ,
  source TEXT DEFAULT 'registry', -- 'fetched' | 'registry'
  health TEXT DEFAULT 'red', -- 'green' | 'yellow' | 'red'
  extraction_notes JSONB DEFAULT '[]',
  full_record BOOLEAN DEFAULT false
);
```

RLS: service role read/write, admin role read, anonymous blocked.

#### 3. Enhanced `prerender` Edge Function — `supabase/functions/prerender/index.ts`

New function (separate from existing `seo-prerender`) that:
- Accepts `?path=/some-page`, optional `?refresh=true`, `?bulk=true`
- Requires admin auth (via `verify-admin-session` pattern)
- Validates path (must start with `/`, no `@`, `//`, `\`, no protocol schemes) — SSRF prevention
- Fetches the published site URL via HTTP GET
- Parses HTML response with regex: extracts title, meta description, H1, H2s, internal links
- Falls back to route registry metadata when SPA shell is detected (empty `<div id="root">`)
- Stores results in `prerender_cache` table
- Computes health: green (title + desc + H1 + links), yellow (some missing), red (critical missing)
- Records source per field ("fetched" vs "registry fallback")
- Rate limited: 5 bulk/hour, 60 individual/hour (tracked via `rate_limit_tracking` table)
- Bulk mode scans all routes from registry

#### 4. Updated `generate-sitemap` Edge Function

Modify to optionally import from the centralized route registry (via direct embed since edge functions can't import from `src/`). Add admin auth check. The function remains a generation tool — `robots.txt` still points to static `/sitemap.xml`.

#### 5. SEO Debug Admin Page — `/admin/seo-debug`

New page with:
- **Single page inspector**: input a path → calls `prerender` function → displays title/desc/H1/H2s/links with health badge and extraction notes
- **Crawl coverage panel**: table of all routes from `prerender_cache` showing health status, present/missing fields, last scan date, with per-row refresh and bulk scan button
- **Sitemap regeneration button**: calls `regenerate-sitemap` function

Uses existing admin patterns: `ProtectedRoute`, `AdminLayout`, role check via `useAdminAuth`.

#### 6. `robots.txt` Update

Add:
```
Disallow: /admin/
```
Keep all existing rules.

#### 7. CORS Headers

Update both new and modified edge functions to include full Lovable CORS headers:
```
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version
```

#### 8. `noscript` Enhancement

The existing `<noscript>` block already has firm name, description, services, and contact. Enhance it with internal `<a>` links to key pages (servicios, contacto, blog, equipo, etc.) to give crawlers link discovery.

### Items NOT Needed (already done)

- `React.lazy()` removal — not used anywhere
- Public page `onClick→navigate` conversion — no instances found on public pages
- `<noscript>` creation — already exists (will enhance with links)

### Files to Create/Modify

| Action | File |
|--------|------|
| Create | `src/data/siteRoutes.ts` |
| Create | `supabase/functions/prerender/index.ts` |
| Create | `src/pages/admin/AdminSeoDebug.tsx` |
| Create | DB migration for `prerender_cache` table |
| Modify | `src/App.tsx` — add `/admin/seo-debug` route |
| Modify | `public/robots.txt` — add `Disallow: /admin/` |
| Modify | `index.html` — enhance `<noscript>` with `<a>` links |
| Modify | `supabase/functions/generate-sitemap/index.ts` — add admin auth |
| Modify | `supabase/functions/regenerate-sitemap/index.ts` — align with route registry |
| Modify | Edge function CORS headers |

### Navigation Audit Results (No Changes Needed)

All `navigate()` calls in public pages are URL-normalization redirects (replacing slug mismatches), not click handlers. The `LanguageSelector` uses `navigate()` for language switching, which is correct behavior. All `onClick+navigate` patterns are inside admin components behind auth.

