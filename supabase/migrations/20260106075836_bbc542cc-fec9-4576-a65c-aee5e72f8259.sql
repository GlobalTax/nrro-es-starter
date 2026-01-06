-- Actualizar servicios destacados ES con slugs
UPDATE page_content 
SET content = '{
  "overline": "Nuestros Servicios Relevantes",
  "services": [
    {
      "title": "Asesoramiento Fiscal",
      "category": "Servicios Fiscales",
      "description": "Asesoramos a empresas y socios en todas sus obligaciones fiscales, con visión estratégica y anticipación",
      "features": ["Planificación y optimización fiscal", "Procedimiento Tributario e Inspecciones ante la diferentes Administraciones", "Asesoramiento fiscal recurrente a sociedades y sus socios"],
      "slug_es": "asesoramiento-fiscal",
      "slug_ca": "assessorament-fiscal",
      "slug_en": "tax-advice"
    },
    {
      "title": "Mercantil",
      "category": "Servicios Mercantiles",
      "description": "Asesoramiento jurídico-societario para estructuras empresariales con visión de estabilidad y seguridad en la gestión",
      "features": ["Recurrencia legal y mercantil", "Pactos de socios y reorganizaciones societarias", "Protocolos familiares y gobierno corporativo"],
      "slug_es": "mercantil-derecho-societario",
      "slug_ca": "mercantil-i-dret-societari",
      "slug_en": "commercial-and-corporate-law"
    },
    {
      "title": "Laboral & Contabilidad",
      "category": "Servicios de Externalización",
      "description": "Externalización revisión contable y servicios de asesoramiento laboral, con enfoque de cumplimiento normativo",
      "features": ["Consolidación de grupos y reporting financiero", "Revisión de la contabilidad adaptada a normativa", "Externalización de los servicios de confección de nóminas y laboral"],
      "slug_es": "asesoramiento-contable-laboral",
      "slug_ca": "assessorament-comptable-i-laboral",
      "slug_en": "accounting-and-labor-consulting"
    },
    {
      "title": "Operaciones M&A",
      "category": "Monitoring Services",
      "description": "Acompañamos a empresarios que quieren vender o comprar una empresa. Nuestro enfoque se basa en el servicios completo",
      "features": ["Valoración de empresas y asesoramiento previo", "Búsqueda de comprador o inversor con la máxima confidencialidad", "Asesoramiento en Due Diligence y negociación del contrato de compraventa"],
      "slug_es": "compraventa-empresas",
      "slug_ca": "compravenda-d-empreses",
      "slug_en": "buying-and-selling-companies"
    }
  ]
}'::jsonb
WHERE id = '43968e9a-c2aa-4b97-a718-5e846c0b85f1'