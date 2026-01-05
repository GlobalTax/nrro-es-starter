UPDATE services 
SET 
  metodologia = '{
    "overline": "CÓMO TRABAJAMOS",
    "titulos": ["Constitución ágil", "de empresas en España"],
    "introduccion": "Gestionamos cada paso del proceso de constitución para inversores extranjeros y emprendedores, desde la planificación corporativa y fiscal hasta el registro mercantil y el soporte post-constitución.",
    "pilares": [
      {
        "numero": 1,
        "titulo": "Planificación corporativa y fiscal",
        "puntos": [
          "Análisis de objetivos comerciales y estructura óptima",
          "Diseño de pactos de socios y marco de gobierno",
          "Optimización fiscal desde el inicio"
        ]
      },
      {
        "numero": 2,
        "titulo": "Documentación y registro",
        "puntos": [
          "Redacción de estatutos y documentación corporativa",
          "Coordinación con notaría y Registro Mercantil",
          "Gestión de NIE y certificaciones necesarias"
        ]
      },
      {
        "numero": 3,
        "titulo": "Soporte post-constitución",
        "puntos": [
          "Contabilidad, nóminas y cumplimiento fiscal",
          "Asistencia con apertura de cuentas bancarias",
          "Asesoramiento continuo en gobierno corporativo"
        ]
      }
    ],
    "contacto": {
      "telefono": "+34 931 222 888",
      "email": "info@nrro.es"
    }
  }'::jsonb,
  servicios_transversales = '[
    {
      "titulo": "Constitución de Sociedad Limitada (SL)",
      "contenido": "Capital mínimo de 3.000€. Estructura flexible ideal para pymes y startups. Responsabilidad limitada al capital aportado. Proceso ágil de 2-3 semanas con nuestra gestión integral."
    },
    {
      "titulo": "Constitución de Sociedad Anónima (SA)",
      "contenido": "Capital mínimo de 60.000€. Recomendada para grandes proyectos o empresas que prevén cotizar en bolsa. Estructura corporativa formal con consejo de administración."
    },
    {
      "titulo": "Oficina virtual y domicilio social",
      "contenido": "Servicio de domicilio social en Barcelona con recepción de correspondencia, atención telefónica y uso de salas de reuniones. Ideal para empresas internacionales."
    },
    {
      "titulo": "Apertura de cuenta bancaria",
      "contenido": "Coordinación con entidades financieras para apertura de cuentas corporativas. Gestión de documentación y acompañamiento en el proceso para no residentes."
    }
  ]'::jsonb,
  stats = '[
    {"value": "300+", "label": "Empresas constituidas", "description": "en los últimos 5 años"},
    {"value": "15+", "label": "Años de experiencia", "description": "en derecho mercantil"},
    {"value": "50+", "label": "Países atendidos", "description": "clientes internacionales"},
    {"value": "98%", "label": "Satisfacción cliente", "description": "según encuestas"}
  ]'::jsonb
WHERE slug_es = 'constitucion-empresas-espana';