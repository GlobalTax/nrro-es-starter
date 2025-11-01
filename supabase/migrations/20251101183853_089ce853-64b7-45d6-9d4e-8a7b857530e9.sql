-- Insert initial hero content for About page
INSERT INTO page_content (page_key, section_key, content, is_active, display_order)
VALUES (
  'about',
  'hero',
  '{
    "overline": "NOSOTROS",
    "title": "25 años de experiencia. Un proyecto personal.",
    "subtitle": "De Garrigues a obn.es, y ahora navarro. Experiencia consolidada, servicio personalizado, máxima ilusión."
  }'::jsonb,
  true,
  0
)
ON CONFLICT DO NOTHING;