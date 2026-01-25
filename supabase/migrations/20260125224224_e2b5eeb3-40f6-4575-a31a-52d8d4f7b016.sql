-- Insertar navarro como empresa principal del sitio español
INSERT INTO public.topbar_group_companies 
  (name, url, logo_url, is_current, is_active, position, source_site)
VALUES 
  ('navarro', 'https://nrro.es', NULL, true, true, 0, 'es');

-- Activar Audit|m para que aparezca en el dropdown
UPDATE public.topbar_group_companies
SET is_active = true, position = 1
WHERE source_site = 'es' AND name = 'Audit | m';

-- Actualizar posición de global.nrro.es si existe
UPDATE public.topbar_group_companies
SET is_active = true, position = 2
WHERE source_site = 'es' AND url LIKE '%global.nrro.es%';

-- Insertar Capittal para el sitio español
INSERT INTO public.topbar_group_companies 
  (name, url, logo_url, is_current, is_active, position, source_site)
VALUES 
  ('Capittal | Transacciones', 'https://capittal.es', NULL, false, true, 3, 'es');