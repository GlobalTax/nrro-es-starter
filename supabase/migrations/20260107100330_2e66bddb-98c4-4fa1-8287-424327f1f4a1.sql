-- Activate all Spanish services that are currently inactive
UPDATE public.services 
SET is_active = true 
WHERE source_site = 'es' 
AND is_active = false;

-- Move "Valoración de Empresas" to international domain
UPDATE public.services 
SET source_site = 'int' 
WHERE slug_es = 'valoracion-de-empresas';