-- Insert 5 service pages with complete content

-- 1. Empresa Familiar
INSERT INTO public.services (
  name,
  slug,
  description,
  area,
  icon_name,
  features,
  typical_clients,
  is_active,
  display_order,
  metodologia,
  servicios_transversales,
  stats,
  meta_title,
  meta_description
) VALUES (
  'Empresa Familiar',
  'empresa-familiar',
  'Asesoramiento integral para empresas familiares en transición generacional, protocolo familiar y gobierno corporativo.',
  'Legal',
  'Users',
  ARRAY[
    'Protocolo Familiar',
    'Sucesión Generacional',
    'Gobierno Corporativo',
    'Planificación Fiscal Familiar',
    'Resolución de Conflictos',
    'Valoración de Participaciones'
  ],
  ARRAY[
    'Empresas familiares de 2ª y 3ª generación',
    'Fundadores planificando sucesión',
    'Consejos de familia',
    'Holdings familiares'
  ],
  true,
  1,
  jsonb_build_object(
    'overline', 'CÓMO TRABAJAMOS',
    'titulos', ARRAY['Asesoramiento', 'Empresa Familiar'],
    'contacto', jsonb_build_object('telefono', '+34 93 XXX XX XX', 'email', 'info@navarrotaxlegal.com'),
    'introduccion', 'En Navarro Tax & Legal entendemos que las empresas familiares tienen necesidades únicas que requieren un enfoque especializado y sensible.',
    'pilares', jsonb_build_array(
      jsonb_build_object('numero', 1, 'titulo', 'Diagnóstico Inicial', 'puntos', ARRAY['Análisis de la estructura familiar y empresarial', 'Identificación de riesgos y oportunidades', 'Evaluación de objetivos generacionales']),
      jsonb_build_object('numero', 2, 'titulo', 'Protocolo Familiar', 'puntos', ARRAY['Diseño de reglas de gobierno', 'Definición de órganos de decisión', 'Mecanismos de resolución de conflictos']),
      jsonb_build_object('numero', 3, 'titulo', 'Implementación', 'puntos', ARRAY['Acompañamiento en la transición', 'Formación de las nuevas generaciones', 'Seguimiento y actualización continua'])
    )
  ),
  jsonb_build_array(
    jsonb_build_object('titulo', 'Fiscalidad de la Sucesión', 'contenido', 'Optimización fiscal en la transmisión de participaciones y planificación del Impuesto de Sucesiones.'),
    jsonb_build_object('titulo', 'Valoración de Empresas', 'contenido', 'Valoración independiente de la empresa familiar para procesos de compraventa o transmisión.')
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'EMPRESAS FAMILIARES ASESORADAS', 'value', '150+', 'description', 'Clientes activos'),
    jsonb_build_object('label', 'PROTOCOLOS IMPLEMENTADOS', 'value', '80+', 'description', 'En los últimos 10 años'),
    jsonb_build_object('label', 'TASA DE ÉXITO', 'value', '95%', 'description', 'En transiciones generacionales')
  ),
  'Empresa Familiar - Protocolo y Sucesión | Navarro Tax & Legal',
  'Asesoramiento especializado para empresas familiares: protocolo familiar, sucesión generacional y gobierno corporativo en Barcelona.'
);

-- 2. Compraventa de Empresas
INSERT INTO public.services (
  name,
  slug,
  description,
  area,
  icon_name,
  features,
  typical_clients,
  is_active,
  display_order,
  metodologia,
  servicios_transversales,
  stats,
  meta_title,
  meta_description
) VALUES (
  'Compraventa de Empresas',
  'compraventa-empresas',
  'Asesoramiento integral en operaciones de M&A: due diligence, valoración, negociación y estructuración fiscal de la operación.',
  'Legal',
  'Building2',
  ARRAY[
    'Due Diligence Legal y Fiscal',
    'Valoración de Empresas',
    'Negociación de Contratos',
    'Estructuración Fiscal Óptima',
    'Cierre de Operaciones',
    'Post-merger Integration'
  ],
  ARRAY[
    'Compradores estratégicos',
    'Vendedores de PYMES',
    'Fondos de inversión',
    'Family offices'
  ],
  true,
  2,
  jsonb_build_object(
    'overline', 'CÓMO TRABAJAMOS',
    'titulos', ARRAY['Compraventa', 'de Empresas'],
    'contacto', jsonb_build_object('telefono', '+34 93 XXX XX XX', 'email', 'info@navarrotaxlegal.com'),
    'introduccion', 'Acompañamos a nuestros clientes en todas las fases de la operación de compraventa, desde la fase preliminar hasta el cierre y más allá.',
    'pilares', jsonb_build_array(
      jsonb_build_object('numero', 1, 'titulo', 'Fase Preparatoria', 'puntos', ARRAY['Análisis estratégico de la operación', 'Valoración preliminar', 'Identificación de riesgos fiscales y legales']),
      jsonb_build_object('numero', 2, 'titulo', 'Due Diligence', 'puntos', ARRAY['Revisión exhaustiva legal, fiscal y contable', 'Informe detallado de hallazgos', 'Cuantificación de contingencias']),
      jsonb_build_object('numero', 3, 'titulo', 'Negociación y Cierre', 'puntos', ARRAY['Estructuración óptima de la operación', 'Negociación de términos contractuales', 'Gestión del proceso de cierre'])
    )
  ),
  jsonb_build_array(
    jsonb_build_object('titulo', 'Financiación de Operaciones', 'contenido', 'Asesoramiento en la búsqueda y estructuración de financiación bancaria o alternativa para la operación.'),
    jsonb_build_object('titulo', 'Earn-out y Price Adjustments', 'contenido', 'Diseño de mecanismos de ajuste de precio y earn-out vinculados a resultados futuros.')
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'OPERACIONES CERRADAS', 'value', '120+', 'description', 'En los últimos 15 años'),
    jsonb_build_object('label', 'VOLUMEN MEDIO', 'value', '5M€', 'description', 'Por operación'),
    jsonb_build_object('label', 'SECTORES', 'value', '20+', 'description', 'Diferentes industrias')
  ),
  'Compraventa de Empresas - M&A | Navarro Tax & Legal',
  'Asesoramiento en compraventa de empresas: due diligence, valoración, negociación y estructuración fiscal en Barcelona.'
);

-- 3. Asesoramiento Fiscal
INSERT INTO public.services (
  name,
  slug,
  description,
  area,
  icon_name,
  features,
  typical_clients,
  is_active,
  display_order,
  metodologia,
  servicios_transversales,
  stats,
  meta_title,
  meta_description
) VALUES (
  'Asesoramiento Fiscal',
  'asesoramiento-fiscal',
  'Planificación fiscal estratégica, declaraciones de impuestos, inspecciones tributarias y recursos ante la Administración.',
  'Fiscal',
  'Calculator',
  ARRAY[
    'Planificación Fiscal Estratégica',
    'Declaraciones de Impuestos',
    'Inspecciones Tributarias',
    'Recursos y Reclamaciones',
    'Fiscalidad Internacional',
    'Compliance Fiscal'
  ],
  ARRAY[
    'Autónomos y profesionales',
    'PYMES de todos los sectores',
    'Empresas familiares',
    'Holdings y grupos empresariales'
  ],
  true,
  3,
  jsonb_build_object(
    'overline', 'CÓMO TRABAJAMOS',
    'titulos', ARRAY['Asesoramiento', 'Fiscal'],
    'contacto', jsonb_build_object('telefono', '+34 93 XXX XX XX', 'email', 'info@navarrotaxlegal.com'),
    'introduccion', 'Nuestro enfoque fiscal va más allá del cumplimiento: buscamos optimizar la carga tributaria dentro del marco legal vigente.',
    'pilares', jsonb_build_array(
      jsonb_build_object('numero', 1, 'titulo', 'Análisis Fiscal', 'puntos', ARRAY['Revisión de la situación fiscal actual', 'Identificación de oportunidades de ahorro', 'Detección de riesgos tributarios']),
      jsonb_build_object('numero', 2, 'titulo', 'Planificación', 'puntos', ARRAY['Diseño de estructura fiscal óptima', 'Calendario fiscal personalizado', 'Estrategias de optimización']),
      jsonb_build_object('numero', 3, 'titulo', 'Ejecución y Seguimiento', 'puntos', ARRAY['Presentación de declaraciones', 'Gestión de inspecciones', 'Actualización normativa continua'])
    )
  ),
  jsonb_build_array(
    jsonb_build_object('titulo', 'Fiscalidad de la Inversión', 'contenido', 'Asesoramiento fiscal en inversiones inmobiliarias, financieras y en startups, incluyendo vehículos de inversión.'),
    jsonb_build_object('titulo', 'Precios de Transferencia', 'contenido', 'Documentación y defensa de operaciones vinculadas entre empresas del mismo grupo.')
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'CLIENTES FISCALES', 'value', '400+', 'description', 'Activos'),
    jsonb_build_object('label', 'AHORRO FISCAL MEDIO', 'value', '20%', 'description', 'Optimización legal'),
    jsonb_build_object('label', 'INSPECCIONES RESUELTAS', 'value', '95%', 'description', 'Con éxito')
  ),
  'Asesoramiento Fiscal - Planificación Tributaria | Navarro Tax & Legal',
  'Asesoría fiscal en Barcelona: planificación estratégica, declaraciones, inspecciones y recursos tributarios para empresas y autónomos.'
);

-- 4. Mercantil y Derecho Societario
INSERT INTO public.services (
  name,
  slug,
  description,
  area,
  icon_name,
  features,
  typical_clients,
  is_active,
  display_order,
  metodologia,
  servicios_transversales,
  stats,
  meta_title,
  meta_description
) VALUES (
  'Mercantil y Derecho Societario',
  'mercantil-derecho-societario',
  'Asesoramiento integral en derecho de sociedades: constitución, modificaciones estatutarias, juntas, fusiones y disoluciones.',
  'Legal',
  'Briefcase',
  ARRAY[
    'Constitución de Sociedades',
    'Modificaciones Estatutarias',
    'Juntas y Asambleas',
    'Fusiones y Escisiones',
    'Aumentos y Reducciones de Capital',
    'Disolución y Liquidación'
  ],
  ARRAY[
    'Emprendedores y startups',
    'PYMES en crecimiento',
    'Empresas en reestructuración',
    'Grupos empresariales'
  ],
  true,
  4,
  jsonb_build_object(
    'overline', 'CÓMO TRABAJAMOS',
    'titulos', ARRAY['Mercantil y', 'Derecho Societario'],
    'contacto', jsonb_build_object('telefono', '+34 93 XXX XX XX', 'email', 'info@navarrotaxlegal.com'),
    'introduccion', 'Proporcionamos asesoramiento jurídico integral en todas las áreas del derecho mercantil y societario, con un enfoque práctico y orientado a resultados.',
    'pilares', jsonb_build_array(
      jsonb_build_object('numero', 1, 'titulo', 'Constitución y Estructura', 'puntos', ARRAY['Elección de forma societaria óptima', 'Redacción de estatutos y pactos', 'Tramitación y puesta en marcha']),
      jsonb_build_object('numero', 2, 'titulo', 'Gobierno Corporativo', 'puntos', ARRAY['Organización de juntas y asambleas', 'Libros societarios y compliance', 'Relaciones entre socios']),
      jsonb_build_object('numero', 3, 'titulo', 'Operaciones Societarias', 'puntos', ARRAY['Modificaciones de capital y estructura', 'Fusiones, escisiones y transformaciones', 'Disolución y liquidación'])
    )
  ),
  jsonb_build_array(
    jsonb_build_object('titulo', 'Pactos de Socios', 'contenido', 'Diseño y redacción de pactos parasociales para regular relaciones entre socios y prevenir conflictos futuros.'),
    jsonb_build_object('titulo', 'Compliance Corporativo', 'contenido', 'Implementación de sistemas de prevención de riesgos penales y cumplimiento normativo corporativo.')
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'SOCIEDADES CONSTITUIDAS', 'value', '200+', 'description', 'En los últimos 5 años'),
    jsonb_build_object('label', 'OPERACIONES SOCIETARIAS', 'value', '300+', 'description', 'Modificaciones y reestructuraciones'),
    jsonb_build_object('label', 'EXPERIENCIA', 'value', '25+', 'description', 'Años en derecho mercantil')
  ),
  'Derecho Mercantil y Societario | Navarro Tax & Legal',
  'Asesoría mercantil en Barcelona: constitución de sociedades, modificaciones estatutarias, fusiones y derecho societario.'
);

-- 5. Asesoramiento Contable y Laboral
INSERT INTO public.services (
  name,
  slug,
  description,
  area,
  icon_name,
  features,
  typical_clients,
  is_active,
  display_order,
  metodologia,
  servicios_transversales,
  stats,
  meta_title,
  meta_description
) VALUES (
  'Asesoramiento Contable y Laboral',
  'asesoramiento-contable-laboral',
  'Gestión integral contable y laboral: contabilidad, auditoría, nóminas, contratos laborales y gestión de recursos humanos.',
  'Contable',
  'ClipboardList',
  ARRAY[
    'Contabilidad Financiera',
    'Auditoría de Cuentas',
    'Nóminas y Seguridad Social',
    'Contratos Laborales',
    'Gestión de RRHH',
    'Relaciones Laborales'
  ],
  ARRAY[
    'Empresas de todos los tamaños',
    'Autónomos con empleados',
    'Startups en crecimiento',
    'Empresas familiares'
  ],
  true,
  5,
  jsonb_build_object(
    'overline', 'CÓMO TRABAJAMOS',
    'titulos', ARRAY['Asesoramiento Contable', 'y Laboral'],
    'contacto', jsonb_build_object('telefono', '+34 93 XXX XX XX', 'email', 'info@navarrotaxlegal.com'),
    'introduccion', 'Ofrecemos un servicio integral de gestión contable y laboral que permite a nuestros clientes centrarse en su negocio mientras nosotros nos ocupamos del resto.',
    'pilares', jsonb_build_array(
      jsonb_build_object('numero', 1, 'titulo', 'Gestión Contable', 'puntos', ARRAY['Contabilidad diaria y cierre de ejercicio', 'Cuentas anuales y auditoría', 'Reporting y análisis financiero']),
      jsonb_build_object('numero', 2, 'titulo', 'Gestión Laboral', 'puntos', ARRAY['Confección de nóminas y seguros sociales', 'Contratos y modificaciones laborales', 'Gestión de altas, bajas y variaciones']),
      jsonb_build_object('numero', 3, 'titulo', 'Consultoría RRHH', 'puntos', ARRAY['Políticas de retribución y beneficios', 'Prevención de riesgos laborales', 'Asesoramiento en conflictos laborales'])
    )
  ),
  jsonb_build_array(
    jsonb_build_object('titulo', 'Digitalización Contable', 'contenido', 'Implementación de software contable y herramientas de gestión para optimizar procesos y mejorar el control financiero.'),
    jsonb_build_object('titulo', 'Outsourcing de RRHH', 'contenido', 'Externalización completa o parcial del departamento de recursos humanos, adaptado a las necesidades de cada empresa.')
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'EMPRESAS GESTIONADAS', 'value', '250+', 'description', 'Clientes activos'),
    jsonb_build_object('label', 'NÓMINAS MENSUALES', 'value', '2.000+', 'description', 'Procesadas'),
    jsonb_build_object('label', 'AUDITORÍAS REALIZADAS', 'value', '100+', 'description', 'En los últimos 5 años')
  ),
  'Asesoría Contable y Laboral | Navarro Tax & Legal',
  'Asesoría contable y laboral en Barcelona: contabilidad, auditoría, nóminas, contratos y gestión de recursos humanos.'
);