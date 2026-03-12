

## Problem

Line 8 in `index.html` has a corrupted CSP meta tag -- the `content` attribute and closing `/>` are duplicated/triplicated on the same line, causing the raw CSP text to render visibly on the page.

## Fix

Replace line 8 with a single, clean CSP meta tag:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://*.supabase.co https://cdn.gpteng.co https://*.lovableproject.com https://www.googletagmanager.com https://www.google-analytics.com https://consent.cookiebot.com https://assets.apollo.io https://datafa.st https://analytics.ahrefs.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' data: blob: https://*.supabase.co wss://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.gpteng.co https://*.lovableproject.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google.com https://*.google-analytics.com https://consent.cookiebot.com https://*.apollo.io https://datafa.st https://analytics.ahrefs.com; frame-src 'self' https://*.lovableproject.com https://consentcdn.cookiebot.com https://www.googletagmanager.com; worker-src 'self' blob:;" />
```

### Scope
- 1 file: `index.html` (line 8 only)

