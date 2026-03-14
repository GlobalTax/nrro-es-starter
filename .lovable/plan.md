

## Audit and Improve Home Page for AI Readability

### Current State

**What's already good:**
- `index.html` has static **Organization** and **LegalService** JSON-LD schemas with correct data (name, address, phone, email, social links, services catalog)
- `OrganizationSchema` component also injects these dynamically via Layout (duplicating the static ones)
- Home page has proper H1 (hero title), H2s for sections (about, stats, services, technology, clients, blog)
- Meta tags (title, description, OG, Twitter) are all present

**Issues found:**
1. **Duplicate schemas**: `index.html` has static Organization + LegalService schemas, and `OrganizationSchema.tsx` injects them again dynamically on every page — with **inconsistent data** (different addresses: "Av. Diagonal 640" vs "Ausiàs March 36", different founding dates: "2010" vs "1998")
2. **No FAQPage schema on home page**: Other landing pages have FAQSchema but the home page does not
3. **H2 headings use decorative mono/uppercase styling** — structurally correct but content is generic overline text (e.g. "Datos clave"), not descriptive H2s that an AI can parse as section summaries
4. **No `<noscript>` fallback** — all home page content is JS-rendered, so crawlers without JS see nothing beyond the static schemas

### Plan

#### 1. Remove duplicate OrganizationSchema component
- Remove `OrganizationSchema` from `Layout.tsx` since `index.html` already has the canonical static schemas
- Delete or deprecate `src/components/seo/OrganizationSchema.tsx` (it has outdated/conflicting data)

#### 2. Fix data consistency in static schemas
- Update `index.html` Organization schema: ensure `foundingDate`, `address`, `numberOfEmployees`, and `sameAs` match the LegalService schema and the rest of the site (use the canonical data: Ausiàs March 36, 1998, 60 employees)

#### 3. Add descriptive H2 headings on home page
- Change the section H2s from generic overline labels to descriptive headings that communicate what the section is about. For example:
  - Stats section: "NRRO en cifras" → keep as overline, add a real H2 like "Datos clave de la firma"
  - Services section: Add an H2 like "Servicios destacados"
  - Technology section: Add an H2 like "Tecnología e innovación"
  - Blog section: Add an H2 like "Últimas publicaciones"

#### 4. Add FAQPage schema to the home page
- Add a `FAQSchema` component to `Home.tsx` with 5-6 key FAQs about the firm (what services, who you serve, where located, languages, how to contact)

#### 5. Add `<noscript>` block to `index.html`
- Add a `<noscript>` tag inside `<body>` with plain HTML summarizing: firm name, what it does, services offered, address, phone, email — so non-JS crawlers get essential content

### Files to modify
- `index.html` — fix schema consistency, add `<noscript>` block
- `src/components/layout/Layout.tsx` — remove `OrganizationSchema` import and usage
- `src/pages/Home.tsx` — add FAQSchema, improve H2 headings
- `src/components/seo/OrganizationSchema.tsx` — delete (or keep but stop using)

