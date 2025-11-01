-- Actualizar teléfono y email en todos los servicios existentes

-- Actualizar los 6 servicios recién creados
UPDATE public.services
SET metodologia = jsonb_set(
  jsonb_set(
    metodologia,
    '{contacto,telefono}',
    '"934593600"'
  ),
  '{contacto,email}',
  '"info@nrro.es"'
)
WHERE slug IN (
  'procedimiento-tributario',
  'conflicto-socios',
  'capital-riesgo',
  'internacionalizacion',
  'procesal-civil',
  'valoracion-empresas'
);

-- Actualizar también los servicios que ya existían y tienen metodología
UPDATE public.services
SET metodologia = jsonb_set(
  jsonb_set(
    metodologia,
    '{contacto,telefono}',
    '"934593600"'
  ),
  '{contacto,email}',
  '"info@nrro.es"'
)
WHERE metodologia IS NOT NULL
AND metodologia ? 'contacto'
AND slug NOT IN (
  'procedimiento-tributario',
  'conflicto-socios',
  'capital-riesgo',
  'internacionalizacion',
  'procesal-civil',
  'valoracion-empresas'
);