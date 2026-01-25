-- Reactivar todos los servicios del sitio español
UPDATE public.services
SET is_active = true
WHERE source_site = 'es';