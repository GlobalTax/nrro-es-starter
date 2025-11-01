// Interfaz para servicios de NRRO
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  area: 'Fiscal' | 'Contable' | 'Legal' | 'Laboral';
  features: string[];
  benefits?: string;
  typical_clients: string[];
  case_studies?: Array<{
    client_type: string;
    challenge: string;
    solution: string;
    result: string;
  }>;
  metodologia?: {
    overline: string;
    titulos: string[];
    contacto: {
      telefono: string;
      email: string;
    };
    introduccion: string;
    pilares: Array<{
      numero: number;
      titulo: string;
      puntos: string[];
    }>;
  };
  servicios_transversales?: Array<{
    titulo: string;
    contenido: string;
  }>;
  stats?: Array<{
    label: string;
    value: string;
    description: string;
  }>;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialization?: string;
  linkedin: string;
  email?: string;
  photo_url?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

// Mantener interfaces antiguas para compatibilidad durante transición
export interface PortfolioCompany {
  id: string;
  name: string;
  website: string;
  country: string;
  sector: string;
  stage: string;
  thesis: string;
  metrics?: {
    revenue?: string;
    employees?: string;
    valuation?: string;
  };
  timeline?: Array<{
    date: string;
    event: string;
  }>;
}

export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

// Servicios de NRRO
export const services: Service[] = [
  {
    id: "1",
    name: "Asesoría Fiscal Integral",
    slug: "asesoria-fiscal-integral",
    description: "Planificación y optimización fiscal para empresas y autónomos. Maximiza tu rentabilidad minimizando la carga tributaria de forma legal.",
    icon_name: "Calculator",
    area: "Fiscal",
    features: ["Declaraciones trimestrales", "Planificación fiscal", "Optimización tributaria", "IVA e IRPF", "Impuesto de sociedades"],
    benefits: "Reduce tu carga fiscal hasta un 30% mediante estrategias legales de optimización. Cumple con todas tus obligaciones sin errores ni sanciones.",
    typical_clients: ["Autónomos", "PYMES", "Empresas", "Multinacionales"],
    metodologia: {
      overline: "CÓMO TRABAJAMOS",
      titulos: ["Soluciones a medida.", "Excelencia en los negocios"],
      contacto: {
        telefono: "+34 620 27 35 52",
        email: "s.navarro@nrro.com"
      },
      introduccion: "En NRRO ofrecemos un servicio integral de asesoría fiscal diseñado específicamente para las necesidades de tu negocio. Nuestro enfoque combina conocimiento técnico con una comprensión profunda de tus objetivos empresariales.",
      pilares: [
        {
          numero: 1,
          titulo: "Conocimiento profundo del negocio y sensibilidad familiar",
          puntos: [
            "Analizamos la estructura societaria y fiscal de tu empresa",
            "Anticipamos riesgos y detectamos oportunidades de optimización",
            "Asesoramiento personalizado adaptado a tu sector"
          ]
        },
        {
          numero: 2,
          titulo: "Planificación fiscal estratégica",
          puntos: [
            "Diseño de estructuras fiscales eficientes",
            "Optimización de la carga tributaria dentro del marco legal",
            "Anticipación de cambios normativos"
          ]
        },
        {
          numero: 3,
          titulo: "Cumplimiento y tranquilidad",
          puntos: [
            "Gestión de todas las obligaciones fiscales",
            "Prevención de sanciones y recargos",
            "Soporte en inspecciones tributarias"
          ]
        }
      ]
    },
    servicios_transversales: [
      {
        titulo: "Continuidad de la empresa familiar",
        contenido: "Asesoramiento integral en procesos de sucesión empresarial, garantizando la continuidad del negocio familiar mediante estructuras fiscales y societarias eficientes que minimicen el impacto tributario."
      },
      {
        titulo: "Planificación fiscal y derecho tributario",
        contenido: "Diseño de estrategias fiscales a medida que optimicen la carga tributaria de la empresa y sus socios, siempre dentro del marco legal vigente y anticipando cambios normativos."
      },
      {
        titulo: "Operaciones societarias y M&A",
        contenido: "Asesoramiento fiscal en operaciones de compraventa, fusiones y adquisiciones, estructurando las operaciones de forma eficiente desde el punto de vista tributario."
      },
      {
        titulo: "Fiscalidad internacional",
        contenido: "Gestión de aspectos fiscales en operaciones transfronterizas, convenios de doble imposición, precios de transferencia y planificación fiscal internacional."
      }
    ],
    stats: [
      {
        label: "CLIENTES",
        value: "300+",
        description: "Más de 300 empresas familiares y grupos confían en NRRO para su asesoría fiscal."
      },
      {
        label: "AHORRO MEDIO",
        value: "25%",
        description: "Reducción promedio de la carga fiscal de nuestros clientes mediante planificación estratégica."
      },
      {
        label: "EXPERIENCIA",
        value: "25 años",
        description: "Más de dos décadas asesorando a empresas en materia fiscal y tributaria."
      },
      {
        label: "TASA DE ÉXITO",
        value: "98%",
        description: "Resolución favorable en inspecciones y recursos tributarios."
      },
      {
        label: "PROYECTOS",
        value: "500+",
        description: "Operaciones de reestructuración, sucesión y M&A completadas con éxito."
      },
      {
        label: "COMPROMISO",
        value: "100%",
        description: "Dedicación total a cada mandato, con rigor técnico y confidencialidad."
      }
    ]
  },
  {
    id: "2",
    name: "Contabilidad y Finanzas",
    slug: "contabilidad-finanzas",
    description: "Gestión contable completa adaptada a las necesidades de tu negocio. Mantén tus cuentas al día y toma decisiones informadas.",
    icon_name: "FileText",
    area: "Contable",
    features: ["Contabilidad general", "Estados financieros", "Control de gestión", "Análisis de ratios", "Cierre contable"],
    benefits: "Información financiera clara y precisa para tomar mejores decisiones empresariales. Cumplimiento de todas las obligaciones contables.",
    typical_clients: ["Startups", "PYMES", "Empresas en crecimiento"],
    stats: [
      {
        label: "EMPRESAS",
        value: "250+",
        description: "Empresas gestionan su contabilidad con NRRO y confían en nuestros servicios financieros."
      },
      {
        label: "PRECISIÓN",
        value: "99.9%",
        description: "Exactitud en registros contables y cierres mensuales, garantizando información fiable."
      },
      {
        label: "INFORMES",
        value: "1.500+",
        description: "Estados financieros y análisis de gestión elaborados anualmente para nuestros clientes."
      },
      {
        label: "TIEMPO RESPUESTA",
        value: "24h",
        description: "Plazo medio de respuesta a consultas contables y financieras de nuestros clientes."
      },
      {
        label: "DIGITALIZACIÓN",
        value: "100%",
        description: "Procesos contables digitalizados mediante software de última generación."
      },
      {
        label: "EXPERIENCIA",
        value: "20 años",
        description: "Trayectoria consolidada en asesoramiento contable y financiero empresarial."
      }
    ]
  },
  {
    id: "3",
    name: "Derecho Mercantil y Societario",
    slug: "derecho-mercantil-societario",
    description: "Asesoramiento legal en operaciones societarias, fusiones, adquisiciones y reestructuraciones empresariales.",
    icon_name: "Scale",
    area: "Legal",
    features: ["Constitución de sociedades", "Operaciones societarias", "M&A", "Contratos mercantiles", "Compliance corporativo"],
    benefits: "Protege tus intereses en todas las operaciones empresariales. Minimiza riesgos legales y optimiza estructuras societarias.",
    typical_clients: ["Startups", "Empresas", "Grupos empresariales"],
    stats: [
      {
        label: "OPERACIONES",
        value: "200+",
        description: "Operaciones societarias, fusiones y adquisiciones asesoradas con éxito."
      },
      {
        label: "EMPRESAS CONSTITUIDAS",
        value: "150+",
        description: "Sociedades constituidas y estructuradas jurídicamente desde su inicio."
      },
      {
        label: "CONTRATOS",
        value: "1.000+",
        description: "Contratos mercantiles redactados y revisados para proteger tus intereses."
      },
      {
        label: "LITIGIOSIDAD",
        value: "5%",
        description: "Tasa de conflictos gracias a nuestra asesoría preventiva y contratos sólidos."
      },
      {
        label: "EXPERIENCIA",
        value: "25 años",
        description: "Trayectoria en derecho mercantil y asesoramiento a grupos empresariales."
      },
      {
        label: "SECTORES",
        value: "15+",
        description: "Sectores económicos diversos en los que hemos asesorado operaciones."
      }
    ]
  },
  {
    id: "4",
    name: "Gestión Laboral y RRHH",
    slug: "gestion-laboral-rrhh",
    description: "Administración completa de nóminas, contratos y relaciones laborales. Mantén a tu equipo en regla.",
    icon_name: "Users",
    area: "Laboral",
    features: ["Nóminas y seguros sociales", "Contratos laborales", "Altas y bajas", "Inspecciones", "Relaciones laborales"],
    benefits: "Evita sanciones laborales y optimiza costes de personal. Gestión eficiente de todo el ciclo laboral.",
    typical_clients: ["PYMES", "Empresas", "Organizaciones"],
    stats: [
      {
        label: "TRABAJADORES",
        value: "2.000+",
        description: "Nóminas y seguros sociales gestionados mensualmente para nuestros clientes."
      },
      {
        label: "EMPRESAS",
        value: "180+",
        description: "Empresas confían en NRRO para la gestión integral de sus recursos humanos."
      },
      {
        label: "CONTRATOS",
        value: "500+",
        description: "Contratos laborales redactados anualmente adaptados a cada situación."
      },
      {
        label: "INSPECCIONES",
        value: "95%",
        description: "Tasa de superación de inspecciones laborales sin incidencias significativas."
      },
      {
        label: "EXPERIENCIA",
        value: "18 años",
        description: "Trayectoria en gestión laboral y asesoramiento en relaciones laborales."
      },
      {
        label: "AHORRO",
        value: "15%",
        description: "Reducción media de costes laborales mediante optimización de plantillas."
      }
    ]
  },
];

// Mantener portfolioCompanies para compatibilidad durante migración
export const portfolioCompanies: PortfolioCompany[] = [
  {
    id: "1",
    name: "TechFlow",
    website: "https://techflow.example.com",
    country: "United States",
    sector: "Technology",
    stage: "Growth",
    thesis: "Leading B2B SaaS platform automating enterprise workflows",
    metrics: {
      revenue: "$50M ARR",
      employees: "200+",
      valuation: "$500M",
    },
    timeline: [
      { date: "2024", event: "Series C funding" },
      { date: "2023", event: "Expanded to EMEA" },
      { date: "2022", event: "Initial investment" },
    ],
  },
  {
    id: "2",
    name: "EduNext",
    website: "https://edunext.example.com",
    country: "Spain",
    sector: "Education",
    stage: "Growth",
    thesis: "Digital learning platform transforming higher education",
    metrics: {
      revenue: "$25M ARR",
      employees: "150+",
    },
    timeline: [
      { date: "2024", event: "Partnership with 50+ universities" },
      { date: "2023", event: "Initial investment" },
    ],
  },
  {
    id: "3",
    name: "ConsumerCo",
    website: "https://consumerco.example.com",
    country: "United Kingdom",
    sector: "Consumer",
    stage: "Buy-and-build",
    thesis: "Consolidating premium health & wellness brands",
    metrics: {
      revenue: "$100M",
      employees: "500+",
    },
    timeline: [
      { date: "2024", event: "Acquired 3rd brand" },
      { date: "2023", event: "Platform investment" },
    ],
  },
  {
    id: "4",
    name: "ServiceTech",
    website: "https://servicetech.example.com",
    country: "Germany",
    sector: "Services",
    stage: "Growth",
    thesis: "Digitizing professional services with AI",
    metrics: {
      revenue: "$30M ARR",
      employees: "180+",
    },
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Carlos Navarro",
    role: "Socio Director",
    specialization: "Fiscal",
    bio: "Más de 25 años de experiencia en asesoría fiscal y tributaria. Experto en planificación fiscal internacional.",
    linkedin: "https://linkedin.com/in/carlos-navarro",
    email: "carlos@nrro.es",
  },
  {
    id: "2",
    name: "Laura Martínez",
    role: "Socia - Área Legal",
    specialization: "Legal",
    bio: "Abogada especializada en derecho mercantil y societario. 15 años asesorando operaciones M&A.",
    linkedin: "https://linkedin.com/in/laura-martinez",
    email: "laura@nrro.es",
  },
  {
    id: "3",
    name: "Miguel Rodríguez",
    role: "Director Contable",
    specialization: "Contable",
    bio: "Auditor de cuentas y experto en estados financieros. Especializado en empresas en crecimiento.",
    linkedin: "https://linkedin.com/in/miguel-rodriguez",
    email: "miguel@nrro.es",
  },
  {
    id: "4",
    name: "Ana García",
    role: "Responsable Laboral",
    specialization: "Laboral",
    bio: "Graduada social con experiencia en gestión de nóminas y relaciones laborales para PYMES.",
    linkedin: "https://linkedin.com/in/ana-garcia",
    email: "ana@nrro.es",
  },
];

// Blog posts para NRRO
export const blogPosts: BlogPost[] = [
  {
    slug: "novedades-fiscales-2025",
    title: "Novedades Fiscales 2025: Guía Completa para Empresas",
    excerpt: "Descubre los cambios fiscales más importantes que afectarán a tu empresa este año y cómo prepararte.",
    content: "<p>El ejercicio 2025 trae importantes cambios en la normativa fiscal española que afectarán a empresas y autónomos...</p>",
    author: "Carlos Navarro",
    date: "2025-01-15",
    readTime: "10 min",
    category: "Fiscal",
  },
  {
    slug: "optimizar-fiscalidad-empresa",
    title: "Cómo Optimizar la Fiscalidad de tu Empresa Legalmente",
    excerpt: "Estrategias legales de planificación fiscal para reducir tu carga tributaria sin riesgos.",
    content: "<p>La optimización fiscal es uno de los aspectos más importantes para mejorar la rentabilidad empresarial...</p>",
    author: "Carlos Navarro",
    date: "2025-01-08",
    readTime: "8 min",
    category: "Fiscal",
  },
  {
    slug: "obligaciones-proteccion-datos",
    title: "Nuevas Obligaciones en Protección de Datos para 2025",
    excerpt: "Actualización de normativa GDPR y las obligaciones que debe cumplir tu empresa.",
    content: "<p>La protección de datos sigue siendo una prioridad regulatoria en la Unión Europea...</p>",
    author: "Laura Martínez",
    date: "2024-12-20",
    readTime: "7 min",
    category: "Legal",
  },
  {
    slug: "aspectos-legales-teletrabajo",
    title: "Aspectos Legales del Teletrabajo que Debes Conocer",
    excerpt: "Guía práctica sobre la normativa laboral aplicable al trabajo remoto en España.",
    content: "<p>El teletrabajo se ha consolidado como una modalidad habitual en muchas empresas españolas...</p>",
    author: "Ana García",
    date: "2024-12-15",
    readTime: "6 min",
    category: "Laboral",
  },
  {
    slug: "estados-financieros-pymes",
    title: "Estados Financieros: Guía para PYMES",
    excerpt: "Entiende los estados financieros básicos y cómo interpretarlos para tomar mejores decisiones.",
    content: "<p>Los estados financieros son la radiografía de tu empresa. Saber interpretarlos es fundamental...</p>",
    author: "Miguel Rodríguez",
    date: "2024-12-10",
    readTime: "9 min",
    category: "Contable",
  },
];

// Mantener insights para compatibilidad
export const insights: Insight[] = blogPosts;
