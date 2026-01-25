-- ===========================================
-- Add source_site column to TopBar tables
-- ===========================================

-- 1. Add source_site column to each table
ALTER TABLE public.topbar_config 
ADD COLUMN source_site text NOT NULL DEFAULT 'es';

ALTER TABLE public.topbar_links 
ADD COLUMN source_site text NOT NULL DEFAULT 'es';

ALTER TABLE public.topbar_group_companies 
ADD COLUMN source_site text NOT NULL DEFAULT 'es';

-- 2. Mark existing records as 'int' (they are from international site)
UPDATE public.topbar_config SET source_site = 'int';
UPDATE public.topbar_links SET source_site = 'int';
UPDATE public.topbar_group_companies SET source_site = 'int';

-- 3. Create config for Spanish site (nrro.es)
INSERT INTO public.topbar_config (phone_number, phone_link, show_language_selector, show_search, source_site)
VALUES ('+34 932 123 456', 'tel:+34932123456', true, false, 'es');

-- 4. Create links for Spanish site
INSERT INTO public.topbar_links (label, href, is_external, position, is_active, source_site) VALUES
('Trabaja con nosotros', '/carreras', false, 1, true, 'es'),
('Blog', '/blog', false, 2, true, 'es'),
('Contacto', '/contacto', false, 3, true, 'es');

-- 5. Copy group companies for Spanish site (with nrro.es as current)
INSERT INTO public.topbar_group_companies (name, url, logo_url, is_current, position, is_active, source_site)
SELECT name, url, logo_url, 
  CASE WHEN url ILIKE '%nrro.es%' AND url NOT ILIKE '%global%' AND url NOT ILIKE '%int%' THEN true ELSE false END as is_current,
  position, is_active, 'es' as source_site
FROM public.topbar_group_companies
WHERE source_site = 'int';

-- 6. Ensure global.nrro.es is current for int site
UPDATE public.topbar_group_companies 
SET is_current = (url ILIKE '%global.nrro.es%' OR url ILIKE '%int.nrro.es%')
WHERE source_site = 'int';