
-- Corregir label vacío en topbar_links (es)
UPDATE public.topbar_links
SET label = 'Trabaja con nosotros'
WHERE href = '/carreras' AND source_site = 'es';

-- Establecer navarro como empresa actual para el sitio español
UPDATE public.topbar_group_companies
SET is_current = true
WHERE url = 'https://nrro.es' AND source_site = 'es';

-- Activar empresas para el sitio internacional
UPDATE public.topbar_group_companies
SET is_active = true
WHERE source_site = 'int';

-- Resetear is_current para el sitio internacional
UPDATE public.topbar_group_companies
SET is_current = false
WHERE source_site = 'int';

-- Establecer global.nrro.es como empresa actual en el sitio internacional
UPDATE public.topbar_group_companies
SET is_current = true
WHERE url LIKE '%global.nrro.es%' AND source_site = 'int';
