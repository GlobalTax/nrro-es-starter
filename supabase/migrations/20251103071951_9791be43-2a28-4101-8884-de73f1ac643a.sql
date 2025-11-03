-- Insert initial content for About page sections

-- Story section
INSERT INTO public.page_content (page_key, section_key, content, is_active, display_order)
VALUES (
  'about',
  'story',
  '{
    "overline": "Mi trayectoria",
    "titulo": "25 años construyendo relaciones de confianza",
    "parrafos": [
      "Soy Samuel L. Navarro, y llevo más de 25 años dedicado a la asesoría fiscal y legal empresarial. Mi carrera comenzó en Garrigues, donde me formé en los más altos estándares de rigor técnico y excelencia profesional, trabajando en operaciones complejas y clientes de primer nivel.",
      "Durante 9 años, desde 2016 hasta 2025, formé parte del equipo de obn.es, donde tuve la oportunidad de asesorar a cerca de 300 empresas y profesionales en sus decisiones fiscales y estratégicas más importantes. Esos años consolidaron mi especialización y me permitieron desarrollar una metodología de trabajo basada en la cercanía, la anticipación y el compromiso con el resultado.",
      "En 2025 nace navarro, mi proyecto personal. Un despacho independiente en el Eixample barcelonés donde puedo ofrecer lo que realmente marca la diferencia: atención directa del socio, servicio personalizado y 25 años de experiencia desde el primer día.",
      "En navarro, cada cliente es único. Trabajo personalmente cada caso, sin intermediarios. Y cuando un proyecto requiere capacidades adicionales, cuento con una red consolidada de más de 60 colaboradores especializados en todas las áreas: laboral, contable, jurídica, auditoría. La agilidad de un profesional independiente con la capacidad de un gran equipo."
    ],
    "destacado": "Más experiencia. Más cercanía. Más compromiso."
  }'::jsonb,
  true,
  1
);

-- Timeline section
INSERT INTO public.page_content (page_key, section_key, content, is_active, display_order)
VALUES (
  'about',
  'timeline',
  '{
    "overline": "Trayectoria",
    "hitos": [
      {
        "periodo": "2000-2016",
        "titulo": "Garrigues",
        "descripcion": "Formación en uno de los despachos más prestigiosos de España",
        "icon": "Briefcase"
      },
      {
        "periodo": "16 años",
        "titulo": "Especialización",
        "descripcion": "Fiscalidad empresarial, M&A y reestructuraciones",
        "icon": "TrendingUp"
      },
      {
        "periodo": "2016-2024",
        "titulo": "obn.es",
        "descripcion": "Cofundador y líder del área fiscal",
        "icon": "Building"
      },
      {
        "periodo": "2025",
        "titulo": "navarro",
        "descripcion": "Nuevo proyecto, misma experiencia, renovada ilusión",
        "icon": "Rocket"
      }
    ]
  }'::jsonb,
  true,
  2
);

-- Values section
INSERT INTO public.page_content (page_key, section_key, content, is_active, display_order)
VALUES (
  'about',
  'values',
  '{
    "overline": "Nuestros Valores",
    "valores": [
      {
        "icon": "Award",
        "titulo": "Experiencia consolidada",
        "descripcion": "25 años en el sector garantizan conocimiento profundo, visión estratégica y capacidad de anticipación ante cualquier escenario fiscal o legal."
      },
      {
        "icon": "Target",
        "titulo": "Rigor técnico absoluto",
        "descripcion": "Formado en Garrigues, aplico los más altos estándares de calidad. Cada asesoramiento está respaldado por un análisis exhaustivo y actualización normativa constante."
      },
      {
        "icon": "Users",
        "titulo": "Servicio 100% personalizado",
        "descripcion": "Atención directa del socio, sin intermediarios. Conozco tu negocio, tus objetivos y tus preocupaciones. Relación de confianza a largo plazo."
      },
      {
        "icon": "TrendingUp",
        "titulo": "Orientación a resultados",
        "descripcion": "No solo cumplimiento: asesoramiento estratégico orientado a optimizar tu fiscalidad, proteger tu patrimonio e impulsar el crecimiento de tu empresa."
      }
    ]
  }'::jsonb,
  true,
  3
);

-- Diferenciacion section
INSERT INTO public.page_content (page_key, section_key, content, is_active, display_order)
VALUES (
  'about',
  'diferenciacion',
  '{
    "overline": "Diferenciación",
    "cards": [
      {
        "icon": "Award",
        "titulo": "Experiencia senior desde el primer día",
        "descripcion": "Trabajas directamente con un profesional de 25 años de experiencia. Sin juniors, sin intermediarios. Tu proyecto merece atención de máximo nivel."
      },
      {
        "icon": "Users",
        "titulo": "Enfoque personalizado e involucrado",
        "descripcion": "No eres un número más. Conozco tu negocio, tus retos y tus objetivos. Mi compromiso es entender tu situación para ofrecerte soluciones realmente adaptadas."
      },
      {
        "icon": "Target",
        "titulo": "Independencia y transparencia",
        "descripcion": "Sin conflictos de interés. Mis recomendaciones se basan exclusivamente en lo que es mejor para tu empresa, nunca en agendas comerciales ocultas."
      },
      {
        "icon": "Handshake",
        "titulo": "Relaciones a largo plazo",
        "descripcion": "No busco proyectos puntuales, busco relaciones duraderas. Quiero ser tu asesor de confianza durante años, no solo un proveedor ocasional."
      },
      {
        "icon": "CheckCircle",
        "titulo": "Calidad sin burocracia",
        "descripcion": "Soy un despacho boutique: la experiencia de un gran despacho, la agilidad de un profesional independiente. Sin estructuras pesadas ni procesos lentos."
      },
      {
        "icon": "Sparkles",
        "titulo": "Máxima ilusión renovada",
        "descripcion": "Después de 25 años, inicio este proyecto con la energía de un emprendedor. Cada cliente es importante, cada proyecto es una oportunidad de demostrar mi compromiso."
      }
    ]
  }'::jsonb,
  true,
  4
);

-- Stats section
INSERT INTO public.page_content (page_key, section_key, content, is_active, display_order)
VALUES (
  'about',
  'stats',
  '{
    "overline": "Navarro en cifras",
    "stats": [
      {
        "valor": "25",
        "descripcion": "Años de experiencia profesional"
      },
      {
        "valor": "~300",
        "descripcion": "Clientes asesorados"
      },
      {
        "valor": "1",
        "descripcion": "Socio · 100% compromiso"
      },
      {
        "valor": "60+",
        "descripcion": "Colaboradores especializados"
      }
    ]
  }'::jsonb,
  true,
  5
);

-- Founder section
INSERT INTO public.page_content (page_key, section_key, content, is_active, display_order)
VALUES (
  'about',
  'founder',
  '{
    "overline": "Fundador",
    "nombre": "Samuel L. Navarro",
    "parrafos": [
      "En navarro trabajas directamente conmigo. 25 años de experiencia al servicio de tu empresa, con la cercanía y el compromiso que solo un profesional independiente puede ofrecer.",
      "Cuento con una red consolidada de más de 60 colaboradores especializados en todas las áreas: laboral, contable, jurídica, auditoría. La agilidad de un profesional independiente con la capacidad de un gran equipo."
    ],
    "cta_texto": "Conoce al equipo completo",
    "cta_url": "/equipo"
  }'::jsonb,
  true,
  6
);