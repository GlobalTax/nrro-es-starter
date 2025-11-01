-- Insert initial KPIs data for home page
INSERT INTO page_content (page_key, section_key, content, is_active, display_order)
VALUES (
  'home',
  'kpis',
  '{"stats": [
    {"label": "Abogados y profesionales", "value": "+70"},
    {"label": "Clientes Recurrentes", "value": "87%"},
    {"label": "Áreas de Práctica", "value": "10"},
    {"label": "Cliente Internacional", "value": "40%"}
  ]}'::jsonb,
  true,
  0
)
ON CONFLICT DO NOTHING;