-- Actualizar el background del hero a "dark" en la landing de herencias
UPDATE landing_pages
SET 
  sections = jsonb_set(
    sections,
    '{0,props,background}',
    '"dark"'::jsonb
  ),
  updated_at = now()
WHERE slug = 'abogados-herencias-barcelona';