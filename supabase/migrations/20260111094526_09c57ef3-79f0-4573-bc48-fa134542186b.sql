-- 1. Activar servicios inactivos de nrro.es
UPDATE services SET is_active = true WHERE id IN (
  '6b1d1739-498c-4b04-b62f-6d938967b452',  -- Empresa familiar
  'aad590af-b60c-4e10-a9f3-749b6e8f46d3',  -- Asesoramiento Contable y Laboral
  '3db42c4b-9802-41d6-947e-20ec6454ffb8',  -- Herencias y Sucesiones
  'aa837d66-ad69-4228-8678-0af397897bcd',  -- Procedimiento Tributario
  '00d946ed-2f78-4d55-be5f-3188192b7cb8',  -- Conflicto de Socios
  'f982dd90-1f86-4b23-b52b-aaada5eb8fd1'   -- Procesal Civil
);

-- 2. Crear servicio de Internacionalización de Empresas
INSERT INTO services (
  name_es, slug_es, area_es, description_es, icon_name, 
  source_site, is_active, display_order, features, typical_clients
) VALUES (
  'Internacionalización de Empresas',
  'internacionalizacion-empresas',
  'Corporate',
  'Acompañamos a empresas españolas en su expansión internacional y a inversores extranjeros que desean operar en España. Asesoramos en la selección de estructuras legales óptimas, fiscalidad internacional, convenios de doble imposición, precios de transferencia y establecimiento permanente. Facilitamos una entrada fluida a nuevos mercados minimizando riesgos fiscales y legales.',
  'Globe',
  'es',
  true,
  12,
  ARRAY['Estructuras internacionales', 'Fiscalidad internacional', 'Convenios de doble imposición', 'Precios de transferencia', 'Establecimiento permanente', 'Inversión extranjera en España'],
  ARRAY['Empresas en expansión internacional', 'Inversores extranjeros', 'Multinacionales', 'Startups con vocación global']
);

-- 3. Actualizar descripciones y contenido de todos los servicios de nrro.es

-- Empresa Familiar
UPDATE services SET 
  description_es = 'Somos especialistas en empresa familiar. Asesoramos en todas las fases del ciclo vital: desde la planificación de la sucesión generacional hasta la venta del negocio. Estructuramos protocolos familiares, pactos de socios y diseñamos la fiscalidad óptima para proteger el patrimonio. Nuestro enfoque combina rigor técnico con sensibilidad hacia las dinámicas familiares que hacen único cada caso.',
  features = ARRAY['Protocolo familiar', 'Sucesión generacional', 'Pactos de socios', 'Planificación fiscal', 'Gobierno corporativo', 'Venta de empresa familiar'],
  typical_clients = ARRAY['Empresas familiares', 'Fundadores y sucesores', 'Family offices', 'Holdings familiares'],
  benefits = 'Garantiza la continuidad de tu empresa familiar con una sucesión ordenada y fiscalmente optimizada. Protege el patrimonio y alinea los intereses de todas las generaciones.',
  display_order = 1
WHERE id = '6b1d1739-498c-4b04-b62f-6d938967b452';

-- Compraventa de Empresas (M&A)
UPDATE services SET 
  description_es = 'Acompañamos a vendedores y compradores en todo el proceso de M&A: desde la valoración inicial hasta el cierre de la operación. Realizamos due diligence fiscal, legal y financiera, estructuramos la operación de forma fiscalmente eficiente, negociamos los contratos de compraventa y garantizamos una transición ordenada. Más de 200 operaciones cerradas con éxito avalan nuestra experiencia.',
  features = ARRAY['Due diligence integral', 'Valoración de empresas', 'Estructuración fiscal', 'Negociación de contratos', 'Cierre de operaciones', 'Post-deal integration'],
  typical_clients = ARRAY['Empresarios vendedores', 'Inversores y fondos', 'Grupos empresariales', 'Private equity'],
  benefits = 'Maximiza el valor de tu empresa en la venta o asegura una adquisición sólida con due diligence rigurosa y estructuración fiscal óptima.',
  display_order = 2
WHERE slug_es = 'compraventa-empresas';

-- Asesoramiento Fiscal
UPDATE services SET 
  description_es = 'Ofrecemos asesoramiento fiscal integral, estratégico y adaptado a la realidad de cada empresa. Planificamos la carga tributaria, optimizamos estructuras societarias, gestionamos procedimientos con la Administración Tributaria y asesoramos en fiscalidad internacional. Nuestro objetivo es anticiparnos, minimizar riesgos y garantizar el cumplimiento normativo en un entorno cada vez más complejo.',
  features = ARRAY['Planificación fiscal', 'Optimización tributaria', 'Fiscalidad internacional', 'Cumplimiento normativo', 'Reestructuraciones fiscales', 'Consultas vinculantes'],
  typical_clients = ARRAY['Empresas medianas y grandes', 'Grupos empresariales', 'Empresas internacionales', 'Patrimonios familiares'],
  benefits = 'Reduce tu carga fiscal de forma legal y segura, anticipándote a los cambios normativos y minimizando riesgos ante la Administración.',
  display_order = 3
WHERE slug_es = 'asesoramiento-fiscal';

-- Mercantil y Derecho Societario
UPDATE services SET 
  description_es = 'Asesoramiento jurídico integral en derecho mercantil y societario. Constituimos y reestructuramos sociedades, redactamos pactos de socios, gestionamos órganos de gobierno, asesoramos en ampliaciones de capital y operaciones corporativas. Combinamos rigor técnico con visión empresarial para proteger los intereses de nuestros clientes en todas sus operaciones.',
  features = ARRAY['Constitución de sociedades', 'Pactos de socios', 'Gobierno corporativo', 'Ampliaciones de capital', 'Reestructuraciones', 'Secretaría del consejo'],
  typical_clients = ARRAY['Sociedades mercantiles', 'Startups y scaleups', 'Holdings', 'Grupos empresariales'],
  benefits = 'Estructura tu empresa con seguridad jurídica, protegiendo tus intereses y anticipando conflictos con socios e inversores.',
  display_order = 4
WHERE slug_es = 'mercantil-derecho-societario';

-- Asesoramiento Contable y Laboral
UPDATE services SET 
  description_es = 'Servicio integral que combina gestión contable, fiscal y laboral con enfoque estratégico. Llevamos la contabilidad, elaboramos estados financieros, gestionamos nóminas y seguros sociales, y asesoramos en relaciones laborales. Ofrecemos información financiera clara y oportuna para la toma de decisiones, garantizando el cumplimiento de todas las obligaciones legales.',
  features = ARRAY['Contabilidad externa', 'Estados financieros', 'Gestión de nóminas', 'Seguros sociales', 'Contratos laborales', 'Reporting financiero'],
  typical_clients = ARRAY['PYMES', 'Startups', 'Empresas en crecimiento', 'Filiales de multinacionales'],
  benefits = 'Externaliza tu gestión contable y laboral con profesionales especializados, liberando tiempo para centrarte en tu negocio.',
  display_order = 5
WHERE id = 'aad590af-b60c-4e10-a9f3-749b6e8f46d3';

-- Procedimiento Tributario
UPDATE services SET 
  description_es = 'Defendemos a empresas y particulares ante la Administración Tributaria. Representación en inspecciones fiscales, recursos de reposición y reclamaciones económico-administrativas. Interponemos recursos contencioso-administrativos y asesoramos en procedimientos sancionadores. Nuestra experiencia y conocimiento técnico maximizan las posibilidades de éxito en cada caso.',
  features = ARRAY['Inspecciones fiscales', 'Recursos y reclamaciones', 'Contencioso-administrativo', 'Procedimientos sancionadores', 'Aplazamientos y fraccionamientos', 'Acuerdos con la AEAT'],
  typical_clients = ARRAY['Empresas inspeccionadas', 'Contribuyentes con litigios', 'Patrimonios en revisión', 'Sociedades con contingencias'],
  benefits = 'Defiende tus derechos ante Hacienda con especialistas en procedimiento tributario y maximiza tus posibilidades de éxito.',
  display_order = 6
WHERE id = 'aa837d66-ad69-4228-8678-0af397897bcd';

-- Conflicto de Socios
UPDATE services SET 
  description_es = 'Resolución de disputas societarias mediante negociación, mediación o vía judicial. Defendemos tus intereses en conflictos de socios, impugnación de acuerdos sociales, exclusión y separación de socios, y disolución de sociedades. Buscamos siempre la solución más eficiente, priorizando el acuerdo cuando es posible y litigando cuando es necesario.',
  features = ARRAY['Conflictos entre socios', 'Impugnación de acuerdos', 'Exclusión de socios', 'Separación de socios', 'Disolución societaria', 'Mediación mercantil'],
  typical_clients = ARRAY['Socios minoritarios', 'Socios mayoritarios', 'Empresas familiares en conflicto', 'Joint ventures'],
  benefits = 'Resuelve conflictos societarios protegiendo tu inversión y tus derechos como socio, con la estrategia más eficiente para cada caso.',
  display_order = 7
WHERE id = '00d946ed-2f78-4d55-be5f-3188192b7cb8';

-- Capital Riesgo
UPDATE services SET 
  description_es = 'Asesoramiento integral en operaciones de venture capital y private equity. Acompañamos a emprendedores e inversores en rondas de financiación: term sheets, due diligence, pactos de socios, estructuras de inversión y desinversión. Nuestra experiencia en el ecosistema startup garantiza operaciones bien estructuradas y alineadas con los intereses de todas las partes.',
  features = ARRAY['Rondas de financiación', 'Term sheets', 'Due diligence', 'Pactos de inversores', 'Estructuras de inversión', 'Exit y desinversión'],
  typical_clients = ARRAY['Startups y scaleups', 'Business angels', 'Venture capital', 'Private equity'],
  benefits = 'Cierra tu ronda de financiación con seguridad jurídica, protegiendo tus intereses como fundador o inversor.',
  display_order = 8
WHERE slug_es = 'capital-riesgo';

-- Procesal Civil
UPDATE services SET 
  description_es = 'Defensa judicial en procedimientos civiles: reclamaciones de cantidad, ejecuciones, impago de rentas, responsabilidad civil y resolución de contratos. Representación especializada ante juzgados y tribunales en todas las instancias. Analizamos cada caso para determinar la estrategia procesal más efectiva y proteger los intereses de nuestros clientes.',
  features = ARRAY['Reclamaciones de cantidad', 'Ejecuciones', 'Responsabilidad civil', 'Resolución de contratos', 'Impago de rentas', 'Recursos de apelación'],
  typical_clients = ARRAY['Empresas con impagos', 'Arrendadores', 'Acreedores', 'Empresas en litigio'],
  benefits = 'Recupera tus créditos y defiende tus intereses en los tribunales con especialistas en litigación civil y mercantil.',
  display_order = 9
WHERE id = 'f982dd90-1f86-4b23-b52b-aaada5eb8fd1';

-- Valoración de Empresas
UPDATE services SET 
  description_es = 'Valoraciones financieras y económicas de empresas para operaciones de M&A, sucesiones, conflictos societarios y procesos judiciales. Utilizamos metodologías reconocidas internacionalmente (DCF, múltiplos comparables, patrimonio neto) y elaboramos informes periciales homologados. Valoraciones rigurosas que resisten el escrutinio de terceros y tribunales.',
  features = ARRAY['Valoración DCF', 'Múltiplos comparables', 'Patrimonio neto ajustado', 'Informes periciales', 'Fairness opinions', 'Valoración de intangibles'],
  typical_clients = ARRAY['Empresas en venta', 'Herencias y sucesiones', 'Conflictos societarios', 'Procesos judiciales'],
  benefits = 'Obtén una valoración rigurosa y defendible de tu empresa, respaldada por metodología profesional y experiencia sectorial.',
  display_order = 10
WHERE slug_es = 'valoracion-empresas';

-- Herencias y Sucesiones
UPDATE services SET 
  description_es = 'Tramitación integral de herencias y sucesiones en Cataluña. Asesoramos en la planificación sucesoria en vida, gestionamos la aceptación de herencia, declaramos el impuesto de sucesiones y donaciones, y resolvemos conflictos entre herederos. Conocemos las particularidades del derecho civil catalán para optimizar fiscalmente cada sucesión.',
  features = ARRAY['Planificación sucesoria', 'Aceptación de herencia', 'Impuesto de sucesiones', 'Donaciones', 'Conflictos hereditarios', 'Testamentos y legados'],
  typical_clients = ARRAY['Herederos', 'Familias con patrimonio', 'Empresarios', 'No residentes con bienes en España'],
  benefits = 'Gestiona tu herencia con tranquilidad, optimizando la fiscalidad y evitando conflictos familiares con asesoramiento especializado.',
  display_order = 11
WHERE id = '3db42c4b-9802-41d6-947e-20ec6454ffb8';

-- Constitución de Empresas en España (ya activo, mejorar descripción)
UPDATE services SET 
  description_es = 'Constituimos tu empresa en España de forma rápida y segura. Asesoramos en la elección del tipo societario óptimo (SL, SA, sucursal), tramitamos la constitución ante notario y Registro Mercantil, obtenemos el NIF y gestionamos el alta en Hacienda y Seguridad Social. Servicio integral para inversores extranjeros y emprendedores.',
  features = ARRAY['Constitución de SL y SA', 'Sucursales y filiales', 'Alta fiscal y laboral', 'Obtención de NIF', 'Domiciliación social', 'Asesoramiento inicial'],
  typical_clients = ARRAY['Inversores extranjeros', 'Emprendedores', 'Startups', 'Multinacionales'],
  benefits = 'Constituye tu empresa en España sin complicaciones, con todos los trámites resueltos y asesoramiento fiscal desde el primer día.',
  display_order = 13
WHERE slug_es = 'constitucion-empresas-espana';

-- Corporate Legal Services (ya activo, mejorar descripción)
UPDATE services SET 
  description_es = 'Servicios jurídicos corporativos para empresas que necesitan asesoramiento legal continuado. Actuamos como departamento jurídico externo, gestionamos contratos, asuntos societarios, compliance y relaciones con terceros. Un equipo multidisciplinar a tu disposición para resolver cualquier cuestión legal de forma ágil y eficiente.',
  features = ARRAY['Asesoramiento continuado', 'Contratos mercantiles', 'Compliance corporativo', 'Secretaría societaria', 'Gestión de reclamaciones', 'Negociación con terceros'],
  typical_clients = ARRAY['Empresas sin departamento jurídico', 'PYMES en crecimiento', 'Filiales de multinacionales', 'Startups y scaleups'],
  benefits = 'Dispón de un departamento jurídico externo especializado, sin los costes fijos de un equipo interno.',
  display_order = 14
WHERE slug_es = 'corporate-legal-services';