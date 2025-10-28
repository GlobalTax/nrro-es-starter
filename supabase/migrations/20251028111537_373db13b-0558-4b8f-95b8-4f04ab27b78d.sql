-- Actualizar textos del hero y SEO para el servicio de Empresa Familiar
UPDATE services 
SET 
  name = 'Planifica el futuro Con decisiones hoy.',
  description = 'Asesoramos a grupos de empresas y empresas familiares en sus decisiones clave: fiscalidad, sucesión, estructura societaria y compraventa de empresas.',
  meta_title = 'Planifica el futuro - Asesoramiento Empresa Familiar | Navarro Tax & Legal',
  meta_description = 'Asesoramos a grupos de empresas y empresas familiares en sus decisiones clave: fiscalidad, sucesión, estructura societaria y compraventa de empresas.',
  updated_at = NOW()
WHERE slug = 'empresa-familiar';