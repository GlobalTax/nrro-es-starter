-- Insert 6 new services: Procedimiento Tributario, Conflicto de Socios, Capital Riesgo, Internacionalización, Procesal Civil, Valoración de Empresas

-- 1. Procedimiento Tributario
INSERT INTO public.services (
  name,
  slug,
  area,
  icon_name,
  description,
  features,
  typical_clients,
  benefits,
  meta_title,
  meta_description,
  display_order,
  is_active,
  metodologia,
  servicios_transversales,
  stats
) VALUES (
  'Procedimiento Tributario',
  'procedimiento-tributario',
  'Fiscal',
  'Scale',
  'Defendemos a empresas y particulares en inspecciones, recursos y reclamaciones ante la Administración Tributaria. Representación técnica especializada en procedimientos de comprobación, liquidaciones y contencioso-administrativo fiscal.',
  ARRAY[
    'Representación en inspecciones tributarias y actuaciones de comprobación',
    'Recursos de reposición y reclamaciones económico-administrativas (TEAR/TEAC)',
    'Defensa en contencioso-administrativo ante tribunales de justicia',
    'Tasaciones periciales contradictorias y negociación de liquidaciones',
    'Auditorías fiscales preventivas y regularización voluntaria',
    'Consultas vinculantes ante la Administración Tributaria'
  ],
  ARRAY[
    'Empresas bajo inspección fiscal',
    'Pymes con liquidaciones tributarias desfavorables',
    'Particulares con procedimientos sancionadores',
    'Grupos empresariales con operaciones complejas'
  ],
  'La correcta defensa en un procedimiento tributario puede suponer un ahorro significativo en la cuota tributaria. Nuestro equipo especializado analiza cada caso con rigor técnico, identifica los argumentos jurídicos más sólidos y negocia con la Administración para proteger tus intereses económicos.',
  'Procedimiento Tributario | Defensa Fiscal Especializada | Navarro',
  'Representación especializada en inspecciones, recursos y reclamaciones tributarias. Defendemos tus intereses ante Hacienda con rigor técnico y experiencia contrastada.',
  10,
  true,
  '{
    "overline": "CÓMO TRABAJAMOS",
    "titulos": ["Defensa tributaria integral", "Representación técnica especializada"],
    "contacto": {
      "telefono": "+34 620 27 35 52",
      "email": "tributario@nrro.com"
    },
    "introduccion": "En navarro defendemos a empresas y particulares en procedimientos de inspección, recursos y reclamaciones ante la Administración Tributaria. Nuestro equipo especializado garantiza una defensa técnica rigurosa de tus intereses, minimizando el impacto económico y optimizando el resultado del procedimiento.",
    "pilares": [
      {
        "numero": 1,
        "titulo": "Inspecciones y comprobaciones",
        "puntos": [
          "Representación desde el primer requerimiento hasta el cierre del expediente",
          "Análisis técnico de las pretensiones de la Administración y preparación de alegaciones",
          "Defensa en actas de conformidad, disconformidad y con acuerdo",
          "Negociación de tasaciones periciales contradictorias cuando proceda",
          "Coordinación con asesores externos para fortalecer la defensa"
        ]
      },
      {
        "numero": 2,
        "titulo": "Recursos y reclamaciones",
        "puntos": [
          "Recursos de reposición ante la Administración competente",
          "Reclamaciones económico-administrativas ante TEAR y TEAC",
          "Recursos contencioso-administrativos ante TSJ y Audiencia Nacional",
          "Recursos de casación ante el Tribunal Supremo en casos complejos",
          "Solicitud de suspensión de deudas tributarias durante el procedimiento"
        ]
      },
      {
        "numero": 3,
        "titulo": "Estrategia preventiva",
        "puntos": [
          "Auditorías fiscales preventivas para detectar riesgos antes de inspección",
          "Consultas vinculantes ante la Administración para obtener seguridad jurídica",
          "Regularización voluntaria mediante declaraciones complementarias",
          "Evaluación de criterios administrativos y jurisprudenciales aplicables",
          "Asesoramiento continuo para minimizar contingencias futuras"
        ]
      }
    ]
  }'::jsonb,
  '[
    {
      "titulo": "Auditoría Fiscal Preventiva",
      "contenido": "Revisión exhaustiva de la situación fiscal para identificar riesgos y oportunidades antes de una inspección. Incluye análisis de impuestos directos (IS, IRPF), indirectos (IVA, ITP), retenciones y tributación internacional."
    },
    {
      "titulo": "Consultas Vinculantes",
      "contenido": "Formulación de consultas ante la Dirección General de Tributos o administraciones autonómicas para obtener criterio vinculante sobre operaciones complejas o interpretaciones normativas dudosas."
    }
  ]'::jsonb,
  '[
    {
      "label": "Experiencia",
      "value": "+25 años",
      "description": "Defendiendo contribuyentes ante Hacienda"
    },
    {
      "label": "Procedimientos",
      "value": "300+",
      "description": "Inspecciones y recursos gestionados"
    },
    {
      "label": "Éxito",
      "value": "85%",
      "description": "Casos resueltos favorablemente"
    },
    {
      "label": "Ahorro medio",
      "value": "40%",
      "description": "Reducción sobre liquidaciones iniciales"
    },
    {
      "label": "Abogados",
      "value": "8",
      "description": "Especialistas en derecho tributario"
    },
    {
      "label": "Respuesta",
      "value": "24h",
      "description": "Tiempo de respuesta ante requerimientos urgentes"
    }
  ]'::jsonb
);

-- 2. Conflicto de Socios
INSERT INTO public.services (
  name,
  slug,
  area,
  icon_name,
  description,
  features,
  typical_clients,
  benefits,
  meta_title,
  meta_description,
  display_order,
  is_active,
  metodologia,
  servicios_transversales,
  stats
) VALUES (
  'Conflicto de Socios',
  'conflicto-socios',
  'Legal',
  'UserX',
  'Resolución de disputas entre socios mediante negociación, mediación o vía judicial. Defendemos tus intereses en exclusiones de socios, impugnación de acuerdos, separación y disolución de sociedades.',
  ARRAY[
    'Mediación y negociación para alcanzar acuerdos extrajudiciales',
    'Exclusión e separación de socios por causa justa',
    'Impugnación de acuerdos sociales contrarios a la ley o estatutos',
    'Defensa en procedimientos judiciales de disolución judicial',
    'Valoración de participaciones y determinación del precio de salida',
    'Reestructuración de pactos parasociales y protocolos familiares'
  ],
  ARRAY[
    'Socios mayoritarios y minoritarios en conflicto',
    'Empresas familiares con disputas intergeneracionales',
    'Startups con desavenencias entre fundadores',
    'Pymes con bloqueos en la toma de decisiones'
  ],
  'Los conflictos societarios no resueltos pueden paralizar la empresa y destruir valor. Nuestro enfoque combina habilidad negociadora con rigor jurídico para proteger tus derechos, ya seas socio mayoritario o minoritario, buscando siempre la solución más eficiente.',
  'Conflicto de Socios | Resolución de Disputas Societarias | Navarro',
  'Defendemos tus intereses en conflictos entre socios: exclusiones, impugnaciones, separaciones y disoluciones. Mediación y defensa judicial especializada.',
  11,
  true,
  '{
    "overline": "CÓMO TRABAJAMOS",
    "titulos": ["Resolución estratégica", "Defensa de tus derechos societarios"],
    "contacto": {
      "telefono": "+34 620 27 35 52",
      "email": "societario@nrro.com"
    },
    "introduccion": "En navarro resolvemos conflictos entre socios con un enfoque estratégico que combina negociación, mediación y defensa judicial. Protegemos tus intereses económicos y personales, buscando siempre la solución que mejor preserve el valor de la empresa.",
    "pilares": [
      {
        "numero": 1,
        "titulo": "Diagnóstico y estrategia",
        "puntos": [
          "Análisis de estatutos sociales, pactos parasociales y protocolos familiares",
          "Revisión de libros sociales y situación económica de la compañía",
          "Identificación de causas legales para exclusión o separación de socios",
          "Valoración inicial de participaciones y estimación del precio de salida",
          "Definición de estrategia negociadora o judicial según el caso"
        ]
      },
      {
        "numero": 2,
        "titulo": "Negociación y mediación",
        "puntos": [
          "Mediación entre socios para alcanzar acuerdos de salida voluntaria",
          "Negociación de condiciones económicas y plazos de pago",
          "Redacción de acuerdos transaccionales y modificaciones estatutarias",
          "Reestructuración de órganos de gobierno y reparto de competencias",
          "Diseño de pactos parasociales para prevenir futuros conflictos"
        ]
      },
      {
        "numero": 3,
        "titulo": "Defensa judicial",
        "puntos": [
          "Demandas de exclusión de socios por causa justa (LSC art. 350)",
          "Acciones de separación de socios ante cambios sustanciales",
          "Impugnación de acuerdos sociales lesivos para tus intereses",
          "Solicitud de medidas cautelares para proteger la empresa",
          "Procedimientos de disolución y liquidación judicial si no hay otra salida"
        ]
      }
    ]
  }'::jsonb,
  '[
    {
      "titulo": "Valoración de Participaciones",
      "contenido": "Valoración pericial de participaciones sociales conforme a métodos reconocidos (DCF, múltiplos, NAV) para determinar el precio justo en operaciones de salida de socios o disolución de sociedades."
    },
    {
      "titulo": "Protocolo Familiar",
      "contenido": "Elaboración o revisión de protocolos familiares para prevenir conflictos futuros, regular la sucesión generacional y establecer mecanismos de resolución de disputas."
    }
  ]'::jsonb,
  '[
    {
      "label": "Casos resueltos",
      "value": "150+",
      "description": "Conflictos societarios gestionados"
    },
    {
      "label": "Acuerdos",
      "value": "70%",
      "description": "Conflictos resueltos vía negociación"
    },
    {
      "label": "Experiencia",
      "value": "+20 años",
      "description": "En derecho societario y mercantil"
    },
    {
      "label": "Tiempo medio",
      "value": "8 meses",
      "description": "Desde el inicio hasta la resolución"
    },
    {
      "label": "Equipo",
      "value": "6",
      "description": "Abogados especializados"
    },
    {
      "label": "Satisfacción",
      "value": "4.7/5",
      "description": "Valoración de clientes"
    }
  ]'::jsonb
);

-- 3. Capital Riesgo
INSERT INTO public.services (
  name,
  slug,
  area,
  icon_name,
  description,
  features,
  typical_clients,
  benefits,
  meta_title,
  meta_description,
  display_order,
  is_active,
  metodologia,
  servicios_transversales,
  stats
) VALUES (
  'Capital Riesgo',
  'capital-riesgo',
  'Legal',
  'TrendingUp',
  'Asesoramiento integral en operaciones de inversión y desinversión de capital riesgo, venture capital y private equity. Estructuración de rondas, negociación de term sheets, due diligence y cierre de operaciones.',
  ARRAY[
    'Estructuración de rondas de inversión (Seed, Series A/B/C)',
    'Negociación de term sheets y pactos de socios con inversores',
    'Due diligence legal, fiscal y laboral completa',
    'Diseño de estructuras de gobierno corporativo y vesting de equity',
    'Asesoramiento en procesos de exit (M&A, IPO, secondary sales)',
    'Protección de fundadores y gestión de minorías inversoras'
  ],
  ARRAY[
    'Startups en fase de crecimiento buscando inversión',
    'Fondos de venture capital y family offices inversores',
    'Pymes en procesos de recapitalización o entrada de socios financieros',
    'Emprendedores preparando exit strategies'
  ],
  'Las operaciones de capital riesgo requieren estructuras jurídicas sofisticadas que equilibren los intereses de fundadores e inversores. Nuestro equipo especializado asegura que la documentación proteja tus derechos y facilite futuros procesos de crecimiento o salida.',
  'Capital Riesgo | Asesoramiento Legal en Venture Capital | Navarro',
  'Asesoramiento especializado en inversiones de capital riesgo: estructuración de rondas, negociación con inversores, due diligence y procesos de exit.',
  12,
  true,
  '{
    "overline": "CÓMO TRABAJAMOS",
    "titulos": ["Inversión inteligente", "Estructuras que protegen tu equity"],
    "contacto": {
      "telefono": "+34 620 27 35 52",
      "email": "capitalriesgo@nrro.com"
    },
    "introduccion": "En navarro asesoramos a startups, fondos de inversión y empresas en crecimiento en todas las fases del ciclo de inversión de capital riesgo. Diseñamos estructuras jurídicas que equilibran los intereses de fundadores e inversores, protegiendo el valor y facilitando el crecimiento.",
    "pilares": [
      {
        "numero": 1,
        "titulo": "Pre-inversión y estructuración",
        "puntos": [
          "Análisis de la estructura societaria y propuesta de optimización pre-money",
          "Definición de la ronda: valoración, importe, instrumentos (equity, convertibles, SAFE)",
          "Diseño de cap table y simulación de escenarios de dilución",
          "Elaboración de pitch deck legal y data room para inversores",
          "Negociación del term sheet: valoración, preferencias, anti-dilución, drag-along"
        ]
      },
      {
        "numero": 2,
        "titulo": "Due diligence y cierre",
        "puntos": [
          "Coordinación de due diligence legal, fiscal, laboral y de propiedad intelectual",
          "Redacción y negociación de pacto de socios y acuerdos de inversión",
          "Estructuración de consejos de administración y cláusulas de gobierno corporativo",
          "Planes de vesting para fundadores y empleados (stock options, phantom shares)",
          "Formalización de la inversión y actualización de libros sociales"
        ]
      },
      {
        "numero": 3,
        "titulo": "Post-inversión y exit",
        "puntos": [
          "Asesoramiento continuo en relación con inversores y minoritarios",
          "Gestión de nuevas rondas de financiación (follow-on, up-rounds, down-rounds)",
          "Modificaciones de pactos de socios y resolución de conflictos",
          "Preparación y ejecución de estrategias de salida (M&A, IPO, buy-back)",
          "Negociación con adquirentes y distribución del precio entre socios"
        ]
      }
    ]
  }'::jsonb,
  '[
    {
      "titulo": "Cap Table Management",
      "contenido": "Diseño y gestión de la tabla de capitalización (cap table) para optimizar la estructura societaria, simular escenarios de inversión y facilitar la toma de decisiones sobre dilución y valoración."
    },
    {
      "titulo": "Stock Options y Equity Compensation",
      "contenido": "Diseño de planes de incentivos en equity para empleados clave: stock options, phantom shares, warrants. Incluye aspectos fiscales y laborales de la compensación en equity."
    }
  ]'::jsonb,
  '[
    {
      "label": "Rondas cerradas",
      "value": "80+",
      "description": "Operaciones de inversión asesoradas"
    },
    {
      "label": "Capital levantado",
      "value": "€200M+",
      "description": "Importe total de inversiones asesoradas"
    },
    {
      "label": "Exits",
      "value": "25",
      "description": "Procesos de desinversión completados"
    },
    {
      "label": "Startups",
      "value": "60+",
      "description": "Empresas en crecimiento asesoradas"
    },
    {
      "label": "Fondos",
      "value": "15",
      "description": "Fondos de VC y family offices clientes"
    },
    {
      "label": "Tiempo medio",
      "value": "3 meses",
      "description": "Desde term sheet hasta cierre"
    }
  ]'::jsonb
);

-- 4. Internacionalización de Empresas
INSERT INTO public.services (
  name,
  slug,
  area,
  icon_name,
  description,
  features,
  typical_clients,
  benefits,
  meta_title,
  meta_description,
  display_order,
  is_active,
  metodologia,
  servicios_transversales,
  stats
) VALUES (
  'Internacionalización de Empresas',
  'internacionalizacion',
  'Legal',
  'Globe',
  'Asesoramiento integral para la expansión internacional de empresas: constitución de filiales, joint ventures, contratos internacionales, fiscalidad internacional y compliance transfronterizo.',
  ARRAY[
    'Selección de estructura óptima para la expansión (filial, sucursal, JV)',
    'Constitución de sociedades y establecimiento permanente en otros países',
    'Negociación de joint ventures y acuerdos de distribución internacional',
    'Contratos comerciales internacionales y resolución de litigios transfronterizos',
    'Planificación fiscal internacional y prevención de doble imposición',
    'Compliance con regulaciones locales y tratados internacionales'
  ],
  ARRAY[
    'Pymes iniciando expansión a mercados extranjeros',
    'Empresas consolidando presencia internacional',
    'Grupos multinacionales optimizando estructura de filiales',
    'Exportadores estructurando redes de distribución global'
  ],
  'La expansión internacional requiere conocimiento profundo de regulaciones locales, estructuras fiscales eficientes y contratos que protejan tus intereses en mercados extranjeros. Nuestro equipo te acompaña en cada paso del proceso de internacionalización.',
  'Internacionalización de Empresas | Expansión Global | Navarro',
  'Asesoramiento legal integral para tu expansión internacional: constitución de filiales, joint ventures, contratos y fiscalidad internacional.',
  13,
  true,
  '{
    "overline": "CÓMO TRABAJAMOS",
    "titulos": ["Expansión global segura", "Tu partner legal internacional"],
    "contacto": {
      "telefono": "+34 620 27 35 52",
      "email": "internacional@nrro.com"
    },
    "introduccion": "En navarro acompañamos a empresas españolas en su proceso de expansión internacional con asesoramiento jurídico integral. Desde la selección de la estructura óptima hasta el cumplimiento normativo local, garantizamos que tu expansión sea segura y eficiente.",
    "pilares": [
      {
        "numero": 1,
        "titulo": "Planificación y estructuración",
        "puntos": [
          "Análisis de mercados objetivo y evaluación de riesgos regulatorios",
          "Selección de estructura óptima: filial, sucursal, joint venture o acuerdo de distribución",
          "Planificación fiscal internacional para minimizar carga tributaria global",
          "Identificación de incentivos fiscales y ayudas a la internacionalización",
          "Coordinación con asesores locales en jurisdicciones de destino"
        ]
      },
      {
        "numero": 2,
        "titulo": "Constitución y puesta en marcha",
        "puntos": [
          "Constitución de sociedades en el extranjero y apertura de establecimientos permanentes",
          "Redacción de estatutos y documentación corporativa conforme a legislación local",
          "Obtención de licencias, permisos y autorizaciones regulatorias necesarias",
          "Registro de marcas y protección de propiedad intelectual en nuevos mercados",
          "Contratación de personal local: aspectos laborales y de inmigración"
        ]
      },
      {
        "numero": 3,
        "titulo": "Operativa y compliance",
        "puntos": [
          "Redacción de contratos internacionales: distribución, agencia, franquicia, manufactura",
          "Asesoramiento en operaciones de comercio exterior y aduanas",
          "Compliance con regulaciones de protección de datos (GDPR, equivalentes locales)",
          "Prevención de blanqueo de capitales y sanciones internacionales",
          "Resolución de litigios transfronterizos y arbitraje internacional"
        ]
      }
    ]
  }'::jsonb,
  '[
    {
      "titulo": "Fiscalidad Internacional",
      "contenido": "Planificación fiscal internacional para optimizar la carga tributaria global del grupo: precios de transferencia, convenios de doble imposición, residencia fiscal de sociedades y exit tax."
    },
    {
      "titulo": "Compliance Transfronterizo",
      "contenido": "Asesoramiento en cumplimiento de regulaciones internacionales: GDPR, FCPA, UK Bribery Act, sanciones económicas internacionales, prevención de blanqueo de capitales y compliance penal."
    }
  ]'::jsonb,
  '[
    {
      "label": "Países",
      "value": "25+",
      "description": "Jurisdicciones en las que hemos asesorado"
    },
    {
      "label": "Filiales",
      "value": "100+",
      "description": "Sociedades constituidas en el extranjero"
    },
    {
      "label": "Joint Ventures",
      "value": "30",
      "description": "Alianzas internacionales estructuradas"
    },
    {
      "label": "Experiencia",
      "value": "+18 años",
      "description": "En derecho internacional"
    },
    {
      "label": "Clientes",
      "value": "50+",
      "description": "Empresas internacionalizadas"
    },
    {
      "label": "Red global",
      "value": "40 países",
      "description": "Network de despachos colaboradores"
    }
  ]'::jsonb
);

-- 5. Procesal Civil
INSERT INTO public.services (
  name,
  slug,
  area,
  icon_name,
  description,
  features,
  typical_clients,
  benefits,
  meta_title,
  meta_description,
  display_order,
  is_active,
  metodologia,
  servicios_transversales,
  stats
) VALUES (
  'Procesal Civil',
  'procesal-civil',
  'Legal',
  'Gavel',
  'Defensa judicial en procedimientos civiles: reclamaciones de cantidad, impago de rentas, resolución de contratos, responsabilidad civil y ejecución de sentencias. Representación especializada en todas las instancias judiciales.',
  ARRAY[
    'Reclamaciones de cantidad y procedimiento monitorio',
    'Demandas por incumplimiento contractual y resolución de contratos',
    'Acciones de desahucio e impago de rentas en arrendamientos',
    'Responsabilidad civil contractual y extracontractual',
    'Impugnación de títulos ejecutivos y oposición a ejecuciones',
    'Recursos de apelación y casación ante tribunales superiores'
  ],
  ARRAY[
    'Empresas con impagos de clientes o proveedores',
    'Propietarios de inmuebles con inquilinos morosos',
    'Particulares con reclamaciones patrimoniales',
    'Sociedades defendiendo demandas de responsabilidad civil'
  ],
  'Una defensa procesal eficaz requiere conocimiento profundo del derecho procesal y habilidad estratégica para proteger tus intereses en cada fase del procedimiento. Nuestro equipo combina rigor técnico con experiencia práctica en los tribunales.',
  'Procesal Civil | Defensa Judicial Especializada | Navarro',
  'Defensa en procedimientos civiles: reclamaciones, incumplimientos contractuales, desahucios y responsabilidad civil. Representación en todas las instancias.',
  14,
  true,
  '{
    "overline": "CÓMO TRABAJAMOS",
    "titulos": ["Defensa procesal rigurosa", "Experiencia en los tribunales"],
    "contacto": {
      "telefono": "+34 620 27 35 52",
      "email": "procesal@nrro.com"
    },
    "introduccion": "En navarro defendemos tus intereses en procedimientos judiciales civiles con un enfoque estratégico que combina rigor técnico y experiencia práctica. Desde la fase preprocesal hasta la ejecución de sentencias, te acompañamos en cada paso del litigio.",
    "pilares": [
      {
        "numero": 1,
        "titulo": "Fase preprocesal y demanda",
        "puntos": [
          "Análisis de viabilidad de la acción judicial y estimación de costes",
          "Reclamación extrajudicial y negociación previa para evitar el juicio",
          "Recopilación de pruebas y documentación para fundamentar la demanda",
          "Redacción de demanda o contestación con argumentación jurídica sólida",
          "Solicitud de medidas cautelares para asegurar el resultado del proceso"
        ]
      },
      {
        "numero": 2,
        "titulo": "Desarrollo del procedimiento",
        "puntos": [
          "Preparación y asistencia a vistas y juicios con testigos y peritos",
          "Proposición y práctica de prueba: documental, testifical, pericial",
          "Formulación de conclusiones y alegatos finales ante el tribunal",
          "Seguimiento del procedimiento y coordinación con el cliente",
          "Negociación de acuerdos transaccionales en cualquier fase"
        ]
      },
      {
        "numero": 3,
        "titulo": "Recursos y ejecución",
        "puntos": [
          "Recursos de apelación ante Audiencias Provinciales",
          "Recursos extraordinarios de casación ante el Tribunal Supremo",
          "Ejecución de sentencias favorables: embargos, subastas, liquidaciones",
          "Oposición a ejecuciones y defensa de impugnaciones de terceros",
          "Procedimientos de insolvencia y concurso de acreedores si procede"
        ]
      }
    ]
  }'::jsonb,
  '[
    {
      "titulo": "Mediación Civil",
      "contenido": "Resolución alternativa de conflictos mediante mediación intrajudicial o extrajudicial. Negociación asistida para alcanzar acuerdos que eviten el coste y la duración de un procedimiento judicial completo."
    },
    {
      "titulo": "Procedimiento Monitorio",
      "contenido": "Reclamación rápida de deudas dinerarias, líquidas y exigibles mediante procedimiento monitorio. Vía procesal especialmente eficaz para el cobro de impagos de clientes."
    }
  ]'::jsonb,
  '[
    {
      "label": "Casos litigados",
      "value": "500+",
      "description": "Procedimientos civiles gestionados"
    },
    {
      "label": "Éxito",
      "value": "80%",
      "description": "Sentencias favorables o acuerdos ventajosos"
    },
    {
      "label": "Experiencia",
      "value": "+22 años",
      "description": "En litigación civil"
    },
    {
      "label": "Recuperado",
      "value": "€15M+",
      "description": "Importe recuperado para clientes"
    },
    {
      "label": "Abogados",
      "value": "5",
      "description": "Especialistas en procesal civil"
    },
    {
      "label": "Tiempo medio",
      "value": "12 meses",
      "description": "Duración media de procedimientos"
    }
  ]'::jsonb
);

-- 6. Valoración de Empresas
INSERT INTO public.services (
  name,
  slug,
  area,
  icon_name,
  description,
  features,
  typical_clients,
  benefits,
  meta_title,
  meta_description,
  display_order,
  is_active,
  metodologia,
  servicios_transversales,
  stats
) VALUES (
  'Valoración de Empresas',
  'valoracion-empresas',
  'Fiscal',
  'LineChart',
  'Valoraciones financieras y económicas de empresas para operaciones de M&A, herencias, conflictos societarios, planificación fiscal y procesos judiciales. Metodologías reconocidas y periciales homologadas.',
  ARRAY[
    'Valoración para compraventa de empresas (M&A) y due diligence financiera',
    'Valoraciones para herencias, donaciones y liquidación de gananciales',
    'Tasaciones periciales para conflictos de socios y disoluciones',
    'Valoración fiscal para operaciones de reestructuración empresarial',
    'Informes de fairness opinion para consejos de administración',
    'Valoración de intangibles: marcas, patentes, fondo de comercio'
  ],
  ARRAY[
    'Empresarios vendiendo o comprando empresas',
    'Familias empresarias en procesos sucesorios',
    'Socios en conflicto requiriendo valoración independiente',
    'Empresas reestructurando grupos con implicaciones fiscales'
  ],
  'Una valoración rigurosa y bien fundamentada es esencial para tomar decisiones informadas en operaciones societarias, resolver conflictos y cumplir con obligaciones fiscales. Nuestros informes están respaldados por metodologías reconocidas internacionalmente.',
  'Valoración de Empresas | Tasación Pericial Financiera | Navarro',
  'Valoración de empresas para M&A, herencias, conflictos societarios y fiscalidad. Informes periciales con metodologías reconocidas internacionalmente.',
  15,
  true,
  '{
    "overline": "CÓMO TRABAJAMOS",
    "titulos": ["Valoración rigurosa", "Metodologías reconocidas"],
    "contacto": {
      "telefono": "+34 620 27 35 52",
      "email": "valoracion@nrro.com"
    },
    "introduccion": "En navarro realizamos valoraciones financieras y económicas de empresas con rigor técnico y metodologías reconocidas internacionalmente. Nuestros informes sirven de base para la toma de decisiones en operaciones de M&A, planificación fiscal, conflictos societarios y procedimientos judiciales.",
    "pilares": [
      {
        "numero": 1,
        "titulo": "Análisis y due diligence",
        "puntos": [
          "Revisión exhaustiva de estados financieros históricos y proyecciones",
          "Análisis del modelo de negocio, ventajas competitivas y posicionamiento",
          "Identificación de riesgos operativos, financieros y regulatorios",
          "Normalización de cuentas anuales y ajustes extraordinarios",
          "Benchmarking con empresas comparables del sector"
        ]
      },
      {
        "numero": 2,
        "titulo": "Aplicación de metodologías",
        "puntos": [
          "Descuento de flujos de caja (DCF): proyección de cash flows y cálculo de WACC",
          "Múltiplos de mercado: EV/EBITDA, P/E, EV/Sales sobre comparables",
          "Valor patrimonial neto (NAV): valoración de activos y pasivos ajustados",
          "Métodos mixtos: goodwill implícito y métodos europeos de valoración",
          "Valoración de intangibles: marcas, patentes, know-how, cartera de clientes"
        ]
      },
      {
        "numero": 3,
        "titulo": "Informe y defensa",
        "puntos": [
          "Elaboración de informe pericial detallado con conclusiones razonadas",
          "Análisis de sensibilidad y rangos de valoración según escenarios",
          "Fairness opinion para consejos de administración en operaciones corporativas",
          "Defensa del informe ante administraciones tributarias o en sede judicial",
          "Asesoramiento continuo durante negociaciones basadas en la valoración"
        ]
      }
    ]
  }'::jsonb,
  '[
    {
      "titulo": "Due Diligence Financiera",
      "contenido": "Revisión financiera exhaustiva de la empresa objetivo en operaciones de M&A. Incluye análisis de estados financieros, working capital, deuda neta, EBITDA ajustado y calidad de beneficios."
    },
    {
      "titulo": "Valoración Fiscal",
      "contenido": "Valoraciones para operaciones con implicaciones fiscales: fusiones, escisiones, aportaciones no dinerarias, reducciones de capital. Cumplimiento de normativas fiscales de valoración (LIS, LIRPF, LIS)."
    }
  ]'::jsonb,
  '[
    {
      "label": "Valoraciones",
      "value": "200+",
      "description": "Empresas valoradas"
    },
    {
      "label": "Volumen",
      "value": "€500M+",
      "description": "Valor agregado de operaciones asesoradas"
    },
    {
      "label": "Sectores",
      "value": "15+",
      "description": "Industrias con experiencia acreditada"
    },
    {
      "label": "Experiencia",
      "value": "+20 años",
      "description": "En valoración financiera"
    },
    {
      "label": "Equipo",
      "value": "4",
      "description": "Analistas financieros y peritos"
    },
    {
      "label": "Metodologías",
      "value": "6",
      "description": "Métodos de valoración aplicados"
    }
  ]'::jsonb
);