export interface PageContent {
  id: string;
  page_key: string;
  section_key: string;
  content: any;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface PageContentInsert {
  page_key: string;
  section_key: string;
  content: any;
  is_active?: boolean;
  display_order?: number;
}

export interface PageContentUpdate {
  page_key?: string;
  section_key?: string;
  content?: any;
  is_active?: boolean;
  display_order?: number;
}

// Content type definitions for different sections

export interface HeroContent {
  overline?: string;
  title: string;
  subtitle?: string;
  cta_primary?: {
    text: string;
    link: string;
  };
  cta_secondary?: {
    text: string;
    link: string;
  };
}

export interface StatsContent {
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface AboutContent {
  overline?: string;
  title: string;
  paragraphs: string[];
  cta?: {
    text: string;
    link: string;
  };
}

export interface LogosContent {
  overline?: string;
  title?: string;
  logos: Array<{
    name: string;
    logo_url: string;
    website_url?: string;
  }>;
}

export interface ValuesContent {
  overline?: string;
  title: string;
  subtitle?: string;
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface ProcessContent {
  overline?: string;
  title: string;
  subtitle?: string;
  steps: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface FeaturedServicesContent {
  overline?: string;
  title?: string;
  services: Array<{
    title: string;
    description: string;
    category: string;
    features: string[];
  }>;
}

export interface HeroSectionContent {
  overline?: string;
  title: string;
  subtitle?: string;
  cta_primary?: {
    text: string;
    link: string;
  };
  cta_secondary?: {
    text: string;
    link: string;
  };
}

// Services page content types
export interface IntroduccionServiciosContent {
  overline: string;
  titulo: string;
  descripcion: string;
  puntos: string[];
}

export interface AreaDestacada {
  nombre: string;
  icono: string;
  descripcion: string;
  servicios_ejemplo: string[];
}

export interface AreasDestacadasContent {
  overline: string;
  titulo: string;
  areas: AreaDestacada[];
}

export interface PasoMetodologia {
  numero: string;
  titulo: string;
  descripcion: string;
}

export interface MetodologiaServiciosContent {
  overline: string;
  titulo: string;
  descripcion: string;
  pasos: PasoMetodologia[];
}

export interface CTAContent {
  titulo: string;
  descripcion: string;
  cta_texto: string;
  cta_url: string;
}

export interface FAQ {
  pregunta: string;
  respuesta: string;
}

export interface FAQsContent {
  overline: string;
  titulo: string;
  preguntas: FAQ[];
}

export interface CTAFinalContent {
  titulo: string;
  descripcion: string;
  cta_primario_texto: string;
  cta_primario_url: string;
  cta_secundario_texto?: string;
  cta_secundario_url?: string;
}

// About page content types
export interface StoryContent {
  overline: string;
  titulo: string;
  parrafos: string[];
  destacado: string;
}

export interface TimelineHito {
  periodo: string;
  titulo: string;
  descripcion: string;
  icon: string;
}

export interface TimelineContent {
  overline: string;
  hitos: TimelineHito[];
}

export interface ValorItem {
  icon: string;
  titulo: string;
  descripcion: string;
}

export interface AboutValuesContent {
  overline: string;
  valores: ValorItem[];
}

export interface DiferenciacionCard {
  icon: string;
  titulo: string;
  descripcion: string;
}

export interface DiferenciacionContent {
  overline: string;
  cards: DiferenciacionCard[];
}

export interface AboutStatsContent {
  overline: string;
  stats: Array<{
    valor: string;
    descripcion: string;
  }>;
}

export interface FounderContent {
  overline: string;
  nombre: string;
  parrafos: string[];
  cta_texto: string;
  cta_url: string;
}
