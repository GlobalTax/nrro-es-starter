

## Update robots.txt with AI crawler rules

Update `public/robots.txt` to add specific directives for AI crawlers:

- **GPTBot**: Allow full access (permits OpenAI's crawler)
- **Google-Extended**: Disallow all (blocks Google's AI training crawler while keeping regular Googlebot access)

### Changes

**File: `public/robots.txt`**
Replace the current content with:
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Disallow: /

Sitemap: https://capittal.es/sitemap.xml
```

The existing Sitemap directive is preserved at the bottom per standard convention.

