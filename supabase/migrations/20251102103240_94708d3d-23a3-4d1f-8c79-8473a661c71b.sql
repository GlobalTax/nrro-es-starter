-- Primero limpiamos las vacantes de ejemplo existentes
DELETE FROM public.job_positions;

-- Insertamos las nuevas vacantes con departamentos correctos
INSERT INTO public.job_positions (
  title, slug, department, location, contract_type, working_hours,
  salary_range, description, requirements, responsibilities,
  status, is_featured, display_order, published_at
) VALUES
-- 1. FISCALIDAD
(
  'Asesor Fiscal Senior',
  'asesor-fiscal-senior',
  'FISCALIDAD',
  'Barcelona',
  'Indefinido',
  'Completa',
  '45.000€ - 55.000€',
  'Buscamos un Asesor Fiscal Senior con experiencia en asesoramiento integral a empresas y particulares. Formarás parte de un equipo dinámico trabajando en proyectos desafiantes del área fiscal.',
  ARRAY['Grado en Derecho, ADE o Económicas', 'Mínimo 5 años de experiencia en asesoría fiscal', 'Conocimientos avanzados de normativa fiscal española', 'Dominio de herramientas de gestión fiscal'],
  ARRAY['Asesoramiento fiscal integral a cartera de clientes', 'Elaboración y revisión de declaraciones fiscales', 'Planificación fiscal estratégica', 'Representación ante la administración tributaria'],
  'published',
  true,
  1,
  now()
),
-- 2. CONTABILIDAD
(
  'Contable Senior',
  'contable-senior',
  'CONTABILIDAD',
  'Madrid',
  'Indefinido',
  'Completa',
  '35.000€ - 42.000€',
  'Incorporación de Contable Senior para gestión contable integral de cartera de clientes. Excelente oportunidad para desarrollar tu carrera en una firma de prestigio.',
  ARRAY['Grado en ADE, Economía o similar', 'Mínimo 4 años de experiencia en contabilidad', 'Conocimientos de A3, Sage o similar', 'Nivel avanzado de Excel'],
  ARRAY['Supervisión de cierres contables mensuales y anuales', 'Coordinación con clientes y auditoría', 'Elaboración de estados financieros', 'Apoyo en procesos de due diligence'],
  'published',
  true,
  2,
  now()
),
-- 3. LABORAL
(
  'Abogado Laboralista',
  'abogado-laboralista',
  'LABORAL',
  'Híbrido',
  'Indefinido',
  'Completa',
  '40.000€ - 50.000€',
  'Incorporación de Abogado especializado en Derecho Laboral para asesoramiento integral en relaciones laborales, negociación colectiva y gestión de conflictos.',
  ARRAY['Licenciatura en Derecho', 'Mínimo 3 años de experiencia en derecho laboral', 'Conocimiento profundo del Estatuto de los Trabajadores', 'Experiencia en litigios laborales'],
  ARRAY['Asesoramiento en relaciones laborales', 'Redacción de contratos y acuerdos laborales', 'Gestión de despidos y sanciones disciplinarias', 'Representación en juicios laborales'],
  'published',
  true,
  3,
  now()
),
-- 4. M&A
(
  'Consultor M&A',
  'consultor-ma',
  'M&A',
  'Barcelona',
  'Indefinido',
  'Completa',
  '50.000€ - 65.000€',
  'Buscamos un profesional con visión estratégica para liderar operaciones de M&A, asesorando a clientes en fusiones, adquisiciones y reestructuraciones empresariales complejas.',
  ARRAY['Licenciatura en Derecho, ADE o Economía', 'Mínimo 5 años de experiencia en M&A', 'Inglés nivel avanzado (C1)', 'Experiencia en transacciones internacionales'],
  ARRAY['Due diligence legal y financiero en operaciones M&A', 'Asesoramiento en valoraciones empresariales', 'Redacción y negociación de contratos de compraventa', 'Coordinación con equipos multidisciplinares'],
  'published',
  true,
  4,
  now()
),
-- 5. SERVICIOS GLOBALES
(
  'Coordinador de Servicios Globales',
  'coordinador-servicios-globales',
  'SERVICIOS GLOBALES',
  'Madrid',
  'Indefinido',
  'Completa',
  '38.000€ - 48.000€',
  'Oportunidad para coordinar servicios transversales a nivel global, actuando como nexo entre diferentes áreas de la firma y gestionando proyectos multidisciplinares.',
  ARRAY['Grado universitario (Derecho, ADE, o similar)', 'Experiencia mínima de 3 años en coordinación de proyectos', 'Inglés nivel avanzado', 'Excelentes habilidades de comunicación'],
  ARRAY['Coordinación de proyectos entre diferentes áreas', 'Gestión de servicios transversales', 'Elaboración de reportes de seguimiento', 'Apoyo a la dirección en iniciativas estratégicas'],
  'published',
  false,
  5,
  now()
),
-- 6. LEGAL
(
  'Abogado Mercantilista',
  'abogado-mercantilista',
  'LEGAL',
  'Barcelona',
  'Indefinido',
  'Completa',
  '42.000€ - 52.000€',
  'Incorporación de Abogado con especialización en Derecho Mercantil para asesoramiento a empresas en operaciones comerciales, gobierno corporativo y cumplimiento normativo.',
  ARRAY['Licenciatura en Derecho', 'Mínimo 4 años de experiencia en derecho mercantil', 'Conocimientos de derecho societario', 'Valorable Máster en Asesoría Jurídica de Empresas'],
  ARRAY['Asesoramiento en derecho societario y mercantil', 'Redacción de estatutos y acuerdos sociales', 'Gestión de operaciones corporativas', 'Cumplimiento normativo (compliance)'],
  'published',
  true,
  6,
  now()
),
-- 7. MERCANTIL
(
  'Asesor Jurídico Mercantil',
  'asesor-juridico-mercantil',
  'MERCANTIL',
  'Híbrido',
  'Indefinido',
  'Completa',
  '38.000€ - 46.000€',
  'Buscamos Asesor Jurídico especializado en Derecho Mercantil para dar soporte legal a empresas en sus operaciones comerciales diarias y estratégicas.',
  ARRAY['Licenciatura en Derecho', 'Experiencia de 2-4 años en derecho mercantil', 'Conocimientos de contratación mercantil', 'Capacidad analítica y de síntesis'],
  ARRAY['Revisión y redacción de contratos mercantiles', 'Asesoramiento en operaciones comerciales', 'Apoyo en negociaciones comerciales', 'Análisis de riesgos legales'],
  'published',
  false,
  7,
  now()
);