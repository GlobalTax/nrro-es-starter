
-- Insert new service: Herencias y Sucesiones
INSERT INTO public.services (
  name_es,
  name_ca,
  name_en,
  slug_es,
  slug_ca,
  slug_en,
  description_es,
  description_ca,
  description_en,
  area_es,
  area_ca,
  area_en,
  icon_name,
  features,
  typical_clients,
  metodologia,
  servicios_transversales,
  stats,
  is_active,
  display_order,
  meta_title,
  meta_description
) VALUES (
  'Herencias y Sucesiones',
  'Herències i Successions',
  'Inheritance & Succession',
  'herencias-sucesiones',
  'herencies-successions',
  'inheritance-succession',
  '## Gestión integral de herencias según el Derecho Civil Catalán

Somos especialistas en **tramitación de herencias y sucesiones** en Cataluña. El Codi Civil Català tiene particularidades únicas que afectan directamente a cómo se reparten los bienes, los derechos del cónyuge viudo, las legítimas y los impuestos.

### ¿Por qué elegir especialistas en derecho sucesorio catalán?

- **Legítima reducida**: En Cataluña la legítima es solo del 25%, frente al 66% del derecho común
- **Bonificaciones fiscales**: Hasta el 99% en el Impuesto de Sucesiones para cónyuge e hijos
- **Heredero universal**: Sistema de institución de heredero único con posibilidad de legados
- **Pactos sucesorios**: Posibilidad de pactar la herencia en vida (heredamientos)

Nuestro equipo gestiona todo el proceso: desde la declaración de herederos hasta la liquidación de impuestos y el reparto de bienes, minimizando conflictos y optimizando la carga fiscal.',
  
  '## Gestió integral d''herències segons el Dret Civil Català

Som especialistes en **tramitació d''herències i successions** a Catalunya. El Codi Civil Català té particularitats úniques que afecten directament com es reparteixen els béns, els drets del cònjuge vidu, les legítimes i els impostos.

### Per què triar especialistes en dret successori català?

- **Llegítima reduïda**: A Catalunya la llegítima és només del 25%, davant el 66% del dret comú
- **Bonificacions fiscals**: Fins al 99% en l''Impost de Successions per a cònjuge i fills
- **Hereu universal**: Sistema d''institució d''hereu únic amb possibilitat de llegats
- **Pactes successoris**: Possibilitat de pactar l''herència en vida (heretaments)

El nostre equip gestiona tot el procés: des de la declaració d''hereus fins a la liquidació d''impostos i el repartiment de béns, minimitzant conflictes i optimitzant la càrrega fiscal.',
  
  '## Comprehensive inheritance management under Catalan Civil Law

We are specialists in **inheritance and succession processing** in Catalonia. The Catalan Civil Code has unique particularities that directly affect how assets are distributed, the rights of the surviving spouse, forced heirship, and taxes.

### Why choose Catalan succession law specialists?

- **Reduced forced share**: In Catalonia, the forced share is only 25%, compared to 66% under common law
- **Tax benefits**: Up to 99% relief on Inheritance Tax for spouses and children
- **Universal heir**: System of single heir institution with possibility of legacies
- **Succession agreements**: Possibility to agree inheritance during lifetime

Our team manages the entire process: from declaration of heirs to tax settlement and asset distribution, minimizing conflicts and optimizing the tax burden.',
  
  'Legal',
  'Legal',
  'Legal',
  'Scale',
  ARRAY['Declaración de herederos', 'Liquidación del Impuesto de Sucesiones (ISD)', 'Partición y reparto de bienes', 'Conflictos entre herederos', 'Herencias internacionales', 'Planificación sucesoria en vida'],
  ARRAY['Herederos y familias', 'Cónyuges viudos', 'Empresas familiares', 'Clientes internacionales con bienes en España', 'Personas que desean planificar su sucesión'],
  '{
    "overline": "Cómo trabajamos",
    "titulos": ["Gestión integral", "de principio a fin"],
    "contacto": {
      "telefono": "+34 93 001 10 30",
      "email": "herencias@nrro.es"
    },
    "introduccion": "Cada herencia es única. Por eso, nuestro proceso se adapta a las circunstancias de cada familia, garantizando una gestión profesional que minimiza conflictos y optimiza la fiscalidad.",
    "pilares": [
      {
        "numero": 1,
        "titulo": "Análisis inicial",
        "puntos": [
          "Revisión del testamento o declaración de herederos ab intestato",
          "Inventario de bienes y deudas del causante",
          "Identificación de herederos y sus derechos",
          "Análisis de la fiscalidad aplicable"
        ]
      },
      {
        "numero": 2,
        "titulo": "Tramitación documental",
        "puntos": [
          "Obtención del certificado de últimas voluntades",
          "Certificado de seguros de vida",
          "Declaración de herederos notarial si no hay testamento",
          "Escritura de aceptación de herencia"
        ]
      },
      {
        "numero": 3,
        "titulo": "Liquidación fiscal",
        "puntos": [
          "Cálculo del Impuesto de Sucesiones (ISD) con bonificaciones catalanas",
          "Plusvalía municipal si hay inmuebles",
          "Presentación y pago en plazo (6 meses prorrogables)",
          "Optimización fiscal según parentesco y patrimonio"
        ]
      },
      {
        "numero": 4,
        "titulo": "Reparto de bienes",
        "puntos": [
          "Cuaderno particional con valoración de bienes",
          "Inscripción en registros (Propiedad, Mercantil, Vehículos)",
          "Cambio de titularidad en cuentas bancarias",
          "Mediación en caso de desacuerdos entre herederos"
        ]
      }
    ]
  }'::jsonb,
  '[
    {
      "titulo": "Declaración de herederos",
      "contenido": "Cuando no existe testamento, tramitamos la **declaración de herederos ab intestato** ante notario. Identificamos a todos los herederos legales según el Codi Civil Català y gestionamos el acta notarial que los acredita para poder aceptar la herencia."
    },
    {
      "titulo": "Reparto de bienes y partición",
      "contenido": "Elaboramos el **cuaderno particional** con la valoración de todos los bienes (inmuebles, cuentas, vehículos, acciones, etc.) y proponemos fórmulas de reparto equitativas. Cuando hay desacuerdos, mediamos entre herederos para evitar juicios."
    },
    {
      "titulo": "Impuesto de Sucesiones (ISD)",
      "contenido": "Calculamos y liquidamos el **Impuesto de Sucesiones en Cataluña**, aplicando todas las bonificaciones disponibles: hasta el 99% para cónyuge e hijos, reducciones por vivienda habitual, empresa familiar, discapacidad, etc. El plazo es de 6 meses desde el fallecimiento."
    },
    {
      "titulo": "Conflictos entre herederos",
      "contenido": "Cuando hay disputas sobre el reparto, legítimas impagadas o interpretación del testamento, ofrecemos **mediación y, si es necesario, defensa judicial**. Buscamos siempre el acuerdo, pero protegemos tus derechos si no es posible."
    },
    {
      "titulo": "Herencias internacionales",
      "contenido": "Si el fallecido o los herederos residen en diferentes países, o hay bienes en el extranjero, aplicamos el **Reglamento Europeo de Sucesiones** y coordinamos con abogados internacionales. Gestionamos certificados sucesorios europeos."
    },
    {
      "titulo": "Planificación sucesoria",
      "contenido": "Ayudamos a **planificar la herencia en vida**: redacción de testamentos, pactos sucesorios (heredamientos), donaciones con reserva de usufructo, seguros de vida, y estructuras para empresas familiares. Minimiza impuestos y evita conflictos futuros."
    }
  ]'::jsonb,
  '[
    {
      "label": "Legítima catalana",
      "value": "25%",
      "description": "Frente al 66% del derecho común, más libertad para testar"
    },
    {
      "label": "Bonificación ISD",
      "value": "99%",
      "description": "Para cónyuge e hijos en Cataluña"
    },
    {
      "label": "Herencias gestionadas",
      "value": "500+",
      "description": "Casos tramitados por nuestro equipo"
    }
  ]'::jsonb,
  true,
  10,
  'Abogados Herencias Barcelona | Especialistas Derecho Sucesorio Catalán',
  'Gestión integral de herencias en Cataluña: declaración de herederos, impuesto de sucesiones (ISD), reparto de bienes y planificación sucesoria. Especialistas en Codi Civil Català.'
);
