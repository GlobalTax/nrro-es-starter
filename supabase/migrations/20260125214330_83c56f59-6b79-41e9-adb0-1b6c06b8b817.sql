-- Restaurar enlaces del TopBar para el sitio español
INSERT INTO public.topbar_links (label, href, is_external, is_active, position, source_site)
VALUES 
  ('Trabaja con nosotros', '/carreras', false, true, 1, 'es'),
  ('Blog', '/blog', false, true, 2, 'es'),
  ('Contacto', '/contacto', false, true, 3, 'es');

-- Limpiar enlaces de prueba del sitio internacional y reactivar los correctos
UPDATE public.topbar_links
SET is_active = true
WHERE source_site = 'int' AND href IN ('/set-up-in-spain', '/blog');

DELETE FROM public.topbar_links 
WHERE source_site = 'int' AND label = 'New Link';