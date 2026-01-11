import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ServiceSummary {
  id: string;
  name: string;
  area: string;
  description: string;
  features?: string[];
  benefits?: string[];
  typical_clients?: string[];
}

interface TeamMemberSummary {
  id: string;
  name: string;
  position: string;
  specialization?: string;
  avatar_url?: string;
  bio?: string;
  linkedin_url?: string;
}

interface CaseStudySummary {
  id: string;
  title: string;
  client_name: string;
  client_industry: string;
  results_summary: string;
  challenge?: string;
  solution?: string;
  metrics?: { label: string; value: string }[];
  testimonial_text?: string;
  testimonial_author?: string;
  testimonial_position?: string;
}

interface Differentiator {
  title: string;
  description: string;
  proof: string;
  impact: string;
}

interface GeneratedPresentation {
  id: string;
  client_name: string;
  client_company: string | null;
  client_logo_url: string | null;
  sector: string | null;
  language: string;
  format: string;
  services_included: ServiceSummary[];
  team_members_included: TeamMemberSummary[];
  case_studies_included: CaseStudySummary[];
  include_stats: boolean;
  custom_intro: string | null;
  // Nuevas opciones de secciones
  include_toc: boolean;
  include_methodology: boolean;
  include_value_proposition: boolean;
  show_service_features: boolean;
  show_team_bio: boolean;
  show_case_metrics: boolean;
  show_testimonials: boolean;
  // Nuevos campos de módulos narrativos
  presentation_type: string;
  audience_type: string;
  presentation_objective: string;
  quality_mode: string;
  cover_tagline: string | null;
  cta_type: string;
  differentiators: Differentiator[];
}

// Logo SVG de navarro tax & legal (blanco)
const NAVARRO_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 170.67" width="280">
  <style>.cls-1{fill:#fff;}</style>
  <path class="cls-1" d="M161.58,104.05h-11.47v-11.73c-1.7,1.91-3.16,4.02-5.07,5.73-15.39,13.85-49.11,10.87-50.17-14.12-.55-12.91,7.57-20.36,19.16-23.79,11.03-3.26,23.36-4.07,34.74-5.67.13-10.18-3.85-16.7-14.31-18.09s-21.53,2.12-24.39,13.28l-12.15-3.71-.07-.36c3.66-12.62,13.63-19.84,26.51-21.24,17.2-1.86,35.38,4.36,36.95,23.85.6,18.58.11,37.23.27,55.83ZM148.77,65.41c-7.66.92-15.43,1.72-23,3.28-8.04,1.67-18.97,4.89-18.06,15.21,1.17,13.17,19.09,13.37,28.16,8.74,10.51-5.36,13.08-16.21,12.89-27.23Z"/>
  <path class="cls-1" d="M310.46,104.05h-11.21v-11.73c-.62-.15-.44.12-.61.34-4.19,5.39-8.08,9.07-14.73,11.39-18.54,6.49-41.72-.98-39.89-23.85,1.92-24.03,36.14-22.24,53.22-25.73,1.19-.24.52-3.03.37-4.09-1.17-8.41-5.57-12.85-14-14-10.38-1.41-21.82,2.04-24.38,13.29l-12.26-3.48c2.85-13,13.68-20.47,26.54-21.84,18.2-1.93,35.73,4.81,36.95,25.18v54.5ZM297.65,65.41c-8.02,1.03-16.16,1.78-24.06,3.55-6.65,1.49-15.98,4.25-16.75,12.31-1.51,15.85,19.05,16.61,29.16,10.74,9.64-5.59,12.11-16.07,11.66-26.6Z"/>
  <path class="cls-1" d="M465.68,24.18c29.09-1.84,43.37,22.19,39.77,48.79-3,22.19-19.81,35.46-42.25,32.95-43.59-4.89-43.83-78.8,2.48-81.73ZM465.68,36.44c-27.73,2.29-27.49,50.55-4.54,56.61,17.65,4.66,29.91-6.43,31.02-23.76,1.16-18.16-5.53-34.58-26.48-32.84Z"/>
  <path class="cls-1" d="M67.66,104.05v-40.92c-.36-11.84-4.67-25.62-18.53-26.52-15.6-1.01-22.72,8.44-23.9,23.05v44.38s-13.06,0-13.06,0V26.23h11.47v9.59c.45.1.54-.14.8-.4,6.47-6.64,12-10.43,21.74-11.07,44.67-2.93,32.95,50.67,34.58,78.77l-.41.92h-12.67Z"/>
  <path class="cls-1" d="M183.19,26.23l21.74,61.03,21.88-61.03h12.94l-28.27,77.7c-.52.35-11.18.29-12.43.14-.29-.04-.59.02-.79-.28l-28.14-77.56h13.07Z"/>
  <path class="cls-1" d="M369.42,26.23v11.99c-6.96-1.28-13.52-.66-19.07,4.01-5.83,4.9-7.58,12.25-8.16,19.57v42.25s-12.66,0-12.66,0l-.4-.4V26.63l.4-.4h11.07v11.99c1.29-1.16,2.05-2.82,3.21-4.12,6.25-7.03,16.49-9.66,25.61-7.87Z"/>
  <path class="cls-1" d="M423.05,26.23v11.99c-6.59-1.25-12.67-.72-18.12,3.35-7.04,5.27-8.58,13.76-9.11,22.09v40.39s-12.8,0-12.8,0V26.23h11.47v11.99l2.53-3.47c6.36-7.46,16.45-10.39,26.02-8.52Z"/>
  <path class="cls-1" d="M150.91,143.63c-1.06,7.84-12.9,8.64-16.01,2l2.81-1.3c1.55,2.82,5.76,3.53,8.26,1.57,1.93-1.51,1.79-4.19,1.73-6.39-4.42,3.86-10.84,2.42-13.12-3.02-3.94-9.4,4.1-19.61,13.39-12.71v-1.6s2.94,0,2.94,0v21.45ZM141.23,124.63c-5.53.94-5.79,12.72.05,13.94,3.68.77,6.24-1.54,6.66-5.11.56-4.83-.82-9.84-6.71-8.84Z"/>
  <path class="cls-1" d="M130.9,132.57h-14.67c.38,6.62,8.1,8.26,11.37,2.7l2.77,1.19c-1.79,4.96-8.42,6.49-12.89,4.06-7.13-3.87-5.77-17.75,2.64-18.85,7.45-.98,11.14,3.89,10.78,10.9ZM127.43,129.9c.09-7.54-10.79-7.17-10.94,0h10.94Z"/>
  <path class="cls-1" d="M41.78,141.09h-2.67s0-2.66,0-2.66c-3.44,4.67-13.62,4.5-13.62-2.53,0-6.52,8.89-6.1,13.36-7.07-.19-5.68-7.74-5.64-9.76-1.1l-2.78-.76c.99-6.4,12.09-7.25,14.78-2.1.12.23.69,1.61.69,1.71v14.52ZM38.58,131.77c-2.29.19-8.02.54-9.34,2.53-1.49,2.24.4,4.47,2.8,4.67,4.27.35,7.1-3.1,6.54-7.2Z"/>
  <path class="cls-1" d="M170.92,141.09h-2.67s0-2.66,0-2.66c-3.43,4.69-13.62,4.47-13.62-2.53,0-6.44,8.97-6.16,13.36-7.07.16-5.49-8.29-5.78-9.34-1.06l-3.2-.8c.94-6.19,11.42-7.17,14.52-2.64.19.28.95,1.8.95,1.98v14.79ZM167.98,131.77c-2.54.18-9.35.43-10.03,3.45-1.04,4.6,6.97,4.99,9.11.83.75-1.46.47-2.79.92-4.28Z"/>
  <polygon class="cls-1" points="62.06 122.17 55.4 131.36 62.33 141.09 58.6 140.96 53.39 134.17 48.19 140.96 44.45 141.09 51.34 131.59 44.72 122.17 48.45 122.31 53.39 128.83 58.33 122.31 62.06 122.17"/>
  <path class="cls-1" d="M89.54,137.76l2.11,1.9-1.45,1.69-1.86-1.6c-4.57,3.65-13.24,2.03-12.02-5.08.24-1.43,1.12-2.98,2.54-3.46-1.48-2.35-2.55-4.62-.64-7.17,2.27-3.05,9.29-2.59,9.99,1.58l-2.01.44c-1.84-3.02-7.46-2.05-6.4,1.97.49,1.87,6.04,5.91,7.61,7.45v-3.73h2.13v6ZM80.4,132.88c-2.08.43-2.26,4.02-.75,5.43,1.17,1.09,3.84,1.18,5.28.71.55-.18,1.85-.91,1.15-1.54-1.16-.71-4.56-4.84-5.68-4.61Z"/>
  <path class="cls-1" d="M16.97,117.38v4.4l.4.4h5.47c-.1.88.33,2.03-.4,2.66h-5.47v9.99c0,.16.38,1.98.47,2.2.15.37,1.23,1.4,1.53,1.4h3.87l-.03,2.64c-2.95.79-7.75.37-8.65-3.16-.14-.56-.39-3.06-.39-3.61v-9.46l-3.49-.12-.25-2.55h3.74v-4.8h3.2Z"/>
  <rect class="cls-1" x="175.99" y="117.11" width="3.2" height="23.98"/>
  <rect class="cls-1" x="105.55" y="117.38" width="3.2" height="23.72"/>
</svg>`;

// Logo negro para páginas claras
const NAVARRO_LOGO_BLACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 170.67" width="180">
  <style>.cls-1{fill:#000;}</style>
  <path class="cls-1" d="M161.58,104.05h-11.47v-11.73c-1.7,1.91-3.16,4.02-5.07,5.73-15.39,13.85-49.11,10.87-50.17-14.12-.55-12.91,7.57-20.36,19.16-23.79,11.03-3.26,23.36-4.07,34.74-5.67.13-10.18-3.85-16.7-14.31-18.09s-21.53,2.12-24.39,13.28l-12.15-3.71-.07-.36c3.66-12.62,13.63-19.84,26.51-21.24,17.2-1.86,35.38,4.36,36.95,23.85.6,18.58.11,37.23.27,55.83ZM148.77,65.41c-7.66.92-15.43,1.72-23,3.28-8.04,1.67-18.97,4.89-18.06,15.21,1.17,13.17,19.09,13.37,28.16,8.74,10.51-5.36,13.08-16.21,12.89-27.23Z"/>
  <path class="cls-1" d="M310.46,104.05h-11.21v-11.73c-.62-.15-.44.12-.61.34-4.19,5.39-8.08,9.07-14.73,11.39-18.54,6.49-41.72-.98-39.89-23.85,1.92-24.03,36.14-22.24,53.22-25.73,1.19-.24.52-3.03.37-4.09-1.17-8.41-5.57-12.85-14-14-10.38-1.41-21.82,2.04-24.38,13.29l-12.26-3.48c2.85-13,13.68-20.47,26.54-21.84,18.2-1.93,35.73,4.81,36.95,25.18v54.5ZM297.65,65.41c-8.02,1.03-16.16,1.78-24.06,3.55-6.65,1.49-15.98,4.25-16.75,12.31-1.51,15.85,19.05,16.61,29.16,10.74,9.64-5.59,12.11-16.07,11.66-26.6Z"/>
  <path class="cls-1" d="M465.68,24.18c29.09-1.84,43.37,22.19,39.77,48.79-3,22.19-19.81,35.46-42.25,32.95-43.59-4.89-43.83-78.8,2.48-81.73ZM465.68,36.44c-27.73,2.29-27.49,50.55-4.54,56.61,17.65,4.66,29.91-6.43,31.02-23.76,1.16-18.16-5.53-34.58-26.48-32.84Z"/>
  <path class="cls-1" d="M67.66,104.05v-40.92c-.36-11.84-4.67-25.62-18.53-26.52-15.6-1.01-22.72,8.44-23.9,23.05v44.38s-13.06,0-13.06,0V26.23h11.47v9.59c.45.1.54-.14.8-.4,6.47-6.64,12-10.43,21.74-11.07,44.67-2.93,32.95,50.67,34.58,78.77l-.41.92h-12.67Z"/>
  <path class="cls-1" d="M183.19,26.23l21.74,61.03,21.88-61.03h12.94l-28.27,77.7c-.52.35-11.18.29-12.43.14-.29-.04-.59.02-.79-.28l-28.14-77.56h13.07Z"/>
  <path class="cls-1" d="M369.42,26.23v11.99c-6.96-1.28-13.52-.66-19.07,4.01-5.83,4.9-7.58,12.25-8.16,19.57v42.25s-12.66,0-12.66,0l-.4-.4V26.63l.4-.4h11.07v11.99c1.29-1.16,2.05-2.82,3.21-4.12,6.25-7.03,16.49-9.66,25.61-7.87Z"/>
  <path class="cls-1" d="M423.05,26.23v11.99c-6.59-1.25-12.67-.72-18.12,3.35-7.04,5.27-8.58,13.76-9.11,22.09v40.39s-12.8,0-12.8,0V26.23h11.47v11.99l2.53-3.47c6.36-7.46,16.45-10.39,26.02-8.52Z"/>
  <path class="cls-1" d="M150.91,143.63c-1.06,7.84-12.9,8.64-16.01,2l2.81-1.3c1.55,2.82,5.76,3.53,8.26,1.57,1.93-1.51,1.79-4.19,1.73-6.39-4.42,3.86-10.84,2.42-13.12-3.02-3.94-9.4,4.1-19.61,13.39-12.71v-1.6s2.94,0,2.94,0v21.45ZM141.23,124.63c-5.53.94-5.79,12.72.05,13.94,3.68.77,6.24-1.54,6.66-5.11.56-4.83-.82-9.84-6.71-8.84Z"/>
  <path class="cls-1" d="M130.9,132.57h-14.67c.38,6.62,8.1,8.26,11.37,2.7l2.77,1.19c-1.79,4.96-8.42,6.49-12.89,4.06-7.13-3.87-5.77-17.75,2.64-18.85,7.45-.98,11.14,3.89,10.78,10.9ZM127.43,129.9c.09-7.54-10.79-7.17-10.94,0h10.94Z"/>
  <path class="cls-1" d="M41.78,141.09h-2.67s0-2.66,0-2.66c-3.44,4.67-13.62,4.5-13.62-2.53,0-6.52,8.89-6.1,13.36-7.07-.19-5.68-7.74-5.64-9.76-1.1l-2.78-.76c.99-6.4,12.09-7.25,14.78-2.1.12.23.69,1.61.69,1.71v14.52ZM38.58,131.77c-2.29.19-8.02.54-9.34,2.53-1.49,2.24.4,4.47,2.8,4.67,4.27.35,7.1-3.1,6.54-7.2Z"/>
  <path class="cls-1" d="M170.92,141.09h-2.67s0-2.66,0-2.66c-3.43,4.69-13.62,4.47-13.62-2.53,0-6.44,8.97-6.16,13.36-7.07.16-5.49-8.29-5.78-9.34-1.06l-3.2-.8c.94-6.19,11.42-7.17,14.52-2.64.19.28.95,1.8.95,1.98v14.79ZM167.98,131.77c-2.54.18-9.35.43-10.03,3.45-1.04,4.6,6.97,4.99,9.11.83.75-1.46.47-2.79.92-4.28Z"/>
  <polygon class="cls-1" points="62.06 122.17 55.4 131.36 62.33 141.09 58.6 140.96 53.39 134.17 48.19 140.96 44.45 141.09 51.34 131.59 44.72 122.17 48.45 122.31 53.39 128.83 58.33 122.31 62.06 122.17"/>
  <path class="cls-1" d="M89.54,137.76l2.11,1.9-1.45,1.69-1.86-1.6c-4.57,3.65-13.24,2.03-12.02-5.08.24-1.43,1.12-2.98,2.54-3.46-1.48-2.35-2.55-4.62-.64-7.17,2.27-3.05,9.29-2.59,9.99,1.58l-2.01.44c-1.84-3.02-7.46-2.05-6.4,1.97.49,1.87,6.04,5.91,7.61,7.45v-3.73h2.13v6ZM80.4,132.88c-2.08.43-2.26,4.02-.75,5.43,1.17,1.09,3.84,1.18,5.28.71.55-.18,1.85-.91,1.15-1.54-1.16-.71-4.56-4.84-5.68-4.61Z"/>
  <path class="cls-1" d="M16.97,117.38v4.4l.4.4h5.47c-.1.88.33,2.03-.4,2.66h-5.47v9.99c0,.16.38,1.98.47,2.2.15.37,1.23,1.4,1.53,1.4h3.87l-.03,2.64c-2.95.79-7.75.37-8.65-3.16-.14-.56-.39-3.06-.39-3.61v-9.46l-3.49-.12-.25-2.55h3.74v-4.8h3.2Z"/>
  <rect class="cls-1" x="175.99" y="117.11" width="3.2" height="23.98"/>
  <rect class="cls-1" x="105.55" y="117.38" width="3.2" height="23.72"/>
</svg>`;

// ============ MÓDULOS NARRATIVOS INTELIGENTES ============

// M1 - Cover taglines adaptativos según tipo y audiencia
const COVER_TAGLINES = {
  es: {
    corporate: {
      family_business: 'Asesoramiento legal, fiscal y corporativo\npara empresas que toman decisiones relevantes',
      investor: 'Asesoramiento especializado\npara inversores y fondos de capital',
      foreigner: 'Tu socio fiscal y legal\npara operar en España con confianza',
      startup: 'Estructura legal y fiscal\npara startups con visión de crecimiento',
    },
    ma: {
      family_business: 'Acompañamiento integral\nen la venta o compra de tu empresa',
      investor: 'Due diligence y estructuración\nde operaciones de inversión',
      foreigner: 'Asesores en operaciones\nde M&A cross-border',
      startup: 'Rondas de financiación\ny exit strategy',
    },
    inbound: {
      family_business: 'Descubre cómo podemos ayudarte\na proteger y hacer crecer tu empresa',
      investor: 'Maximiza el retorno\nde tus inversiones',
      foreigner: 'Tu entrada a España\ncon seguridad jurídica',
      startup: 'Del MVP al scale-up\ncon base legal sólida',
    },
    pe: {
      family_business: 'Preparación para inversión\ny gobierno corporativo',
      investor: 'Estructuración fiscal\ny legal de fondos',
      foreigner: 'Inversión en España\noptimizada fiscalmente',
      startup: 'Estructura lista para VC\ny crecimiento',
    },
    fiscal: {
      family_business: 'Planificación fiscal estratégica\npara tu empresa familiar',
      investor: 'Optimización fiscal\nde carteras de inversión',
      foreigner: 'Fiscalidad española\npara no residentes',
      startup: 'Fiscalidad para startups\ny stock options',
    },
  },
  en: {
    corporate: {
      family_business: 'Legal, tax and corporate advisory\nfor companies making key decisions',
      investor: 'Specialized advisory\nfor investors and capital funds',
      foreigner: 'Your tax and legal partner\nto operate in Spain with confidence',
      startup: 'Legal and tax structure\nfor growth-oriented startups',
    },
    ma: {
      family_business: 'Comprehensive support\nin buying or selling your company',
      investor: 'Due diligence and deal structuring\nfor investment operations',
      foreigner: 'Advisors in cross-border\nM&A transactions',
      startup: 'Funding rounds\nand exit strategy',
    },
    inbound: {
      family_business: 'Discover how we can help\nprotect and grow your business',
      investor: 'Maximize your\ninvestment returns',
      foreigner: 'Your entry to Spain\nwith legal certainty',
      startup: 'From MVP to scale-up\nwith solid legal foundation',
    },
    pe: {
      family_business: 'Investment readiness\nand corporate governance',
      investor: 'Tax and legal\nfund structuring',
      foreigner: 'Tax-optimized investment\nin Spain',
      startup: 'VC-ready structure\nand growth',
    },
    fiscal: {
      family_business: 'Strategic tax planning\nfor your family business',
      investor: 'Tax optimization\nfor investment portfolios',
      foreigner: 'Spanish taxation\nfor non-residents',
      startup: 'Startup taxation\nand stock options',
    },
  },
  ca: {
    corporate: {
      family_business: 'Assessorament legal, fiscal i corporatiu\nper a empreses que prenen decisions rellevants',
      investor: 'Assessorament especialitzat\nper a inversors i fons de capital',
      foreigner: 'El teu soci fiscal i legal\nper operar a Espanya amb confiança',
      startup: 'Estructura legal i fiscal\nper a startups amb visió de creixement',
    },
    ma: {
      family_business: 'Acompanyament integral\nen la venda o compra de la teva empresa',
      investor: 'Due diligence i estructuració\nd\'operacions d\'inversió',
      foreigner: 'Assessors en operacions\nde M&A cross-border',
      startup: 'Rondes de finançament\ni exit strategy',
    },
    inbound: {
      family_business: 'Descobreix com podem ajudar-te\na protegir i fer créixer la teva empresa',
      investor: 'Maximitza el retorn\nde les teves inversions',
      foreigner: 'La teva entrada a Espanya\namb seguretat jurídica',
      startup: 'Del MVP al scale-up\namb base legal sòlida',
    },
    pe: {
      family_business: 'Preparació per a inversió\ni govern corporatiu',
      investor: 'Estructuració fiscal\ni legal de fons',
      foreigner: 'Inversió a Espanya\noptimitzada fiscalment',
      startup: 'Estructura llesta per a VC\ni creixement',
    },
    fiscal: {
      family_business: 'Planificació fiscal estratègica\nper a la teva empresa familiar',
      investor: 'Optimització fiscal\nde carteres d\'inversió',
      foreigner: 'Fiscalitat espanyola\nper a no residents',
      startup: 'Fiscalitat per a startups\ni stock options',
    },
  },
};

// M3 - Diferenciadores con prueba
const DIFFERENTIATORS = {
  es: [
    { 
      title: 'Especialización en empresa familiar', 
      description: 'Protocolos, sucesiones, conflictos y gobierno corporativo',
      proof: 'Más de 50 protocolos familiares firmados',
      impact: 'Continuidad y reducción de conflictos'
    },
    { 
      title: 'Equipo multidisciplinar', 
      description: 'Fiscal, legal, contable y laboral bajo un mismo techo',
      proof: '70+ profesionales especializados',
      impact: 'Visión 360° sin silos'
    },
    { 
      title: 'Experiencia en M&A', 
      description: 'Due diligence, valoración, negociación y cierre',
      proof: '200+ operaciones cerradas',
      impact: 'Transacciones exitosas'
    },
    { 
      title: 'Acompañamiento continuo', 
      description: 'Relaciones a largo plazo, no proyectos puntuales',
      proof: '15 años de media con nuestros clientes',
      impact: 'Conocemos tu negocio'
    },
  ],
  en: [
    { 
      title: 'Family business specialization', 
      description: 'Protocols, succession, conflicts and corporate governance',
      proof: 'More than 50 family protocols signed',
      impact: 'Continuity and conflict reduction'
    },
    { 
      title: 'Multidisciplinary team', 
      description: 'Tax, legal, accounting and labor under one roof',
      proof: '70+ specialized professionals',
      impact: '360° vision without silos'
    },
    { 
      title: 'M&A experience', 
      description: 'Due diligence, valuation, negotiation and closing',
      proof: '200+ transactions closed',
      impact: 'Successful transactions'
    },
    { 
      title: 'Continuous support', 
      description: 'Long-term relationships, not one-off projects',
      proof: '15 years average with our clients',
      impact: 'We know your business'
    },
  ],
  ca: [
    { 
      title: 'Especialització en empresa familiar', 
      description: 'Protocols, successions, conflictes i govern corporatiu',
      proof: 'Més de 50 protocols familiars signats',
      impact: 'Continuïtat i reducció de conflictes'
    },
    { 
      title: 'Equip multidisciplinari', 
      description: 'Fiscal, legal, comptable i laboral sota un mateix sostre',
      proof: '70+ professionals especialitzats',
      impact: 'Visió 360° sense silos'
    },
    { 
      title: 'Experiència en M&A', 
      description: 'Due diligence, valoració, negociació i tancament',
      proof: '200+ operacions tancades',
      impact: 'Transaccions reeixides'
    },
    { 
      title: 'Acompanyament continu', 
      description: 'Relacions a llarg termini, no projectes puntuals',
      proof: '15 anys de mitjana amb els nostres clients',
      impact: 'Coneixem el teu negoci'
    },
  ],
};

// M4 - Servicios agrupados por momentos empresariales
const SERVICE_MOMENTS = {
  es: {
    growth: { title: 'Crecimiento y estructura', icon: '📈', services: ['fiscal', 'mercantil', 'contable', 'laboral'] },
    conflicts: { title: 'Conflictos y reorganización', icon: '⚖️', services: ['conflicto-socios', 'procesal', 'procedimiento-tributario'] },
    transaction: { title: 'Venta, compra o sucesión', icon: '🤝', services: ['compraventa-empresas', 'empresa-familiar', 'herencias', 'valoracion'] },
    international: { title: 'Internacionalización', icon: '🌍', services: ['internacionalizacion', 'capital-riesgo'] },
  },
  en: {
    growth: { title: 'Growth and structure', icon: '📈', services: ['fiscal', 'mercantil', 'contable', 'laboral'] },
    conflicts: { title: 'Conflicts and reorganization', icon: '⚖️', services: ['conflicto-socios', 'procesal', 'procedimiento-tributario'] },
    transaction: { title: 'Sale, purchase or succession', icon: '🤝', services: ['compraventa-empresas', 'empresa-familiar', 'herencias', 'valoracion'] },
    international: { title: 'Internationalization', icon: '🌍', services: ['internacionalizacion', 'capital-riesgo'] },
  },
  ca: {
    growth: { title: 'Creixement i estructura', icon: '📈', services: ['fiscal', 'mercantil', 'contable', 'laboral'] },
    conflicts: { title: 'Conflictes i reorganització', icon: '⚖️', services: ['conflicto-socios', 'procesal', 'procedimiento-tributario'] },
    transaction: { title: 'Venda, compra o successió', icon: '🤝', services: ['compraventa-empresas', 'empresa-familiar', 'herencias', 'valoracion'] },
    international: { title: 'Internacionalització', icon: '🌍', services: ['internacionalizacion', 'capital-riesgo'] },
  },
};

// M8 - CTAs adaptativos
const CTA_TYPES = {
  es: {
    strategic_conversation: { title: 'Primera conversación estratégica', subtitle: 'Sin compromiso. Analizamos tu situación.' },
    initial_diagnosis: { title: 'Diagnóstico inicial', subtitle: 'Identificamos áreas de mejora y riesgos.' },
    preliminary_valuation: { title: 'Valoración preliminar', subtitle: 'Estimación de valor para tomar decisiones.' },
    structure_review: { title: 'Revisión de estructura', subtitle: 'Optimiza tu organización societaria y fiscal.' },
  },
  en: {
    strategic_conversation: { title: 'First strategic conversation', subtitle: 'No commitment. We analyze your situation.' },
    initial_diagnosis: { title: 'Initial diagnosis', subtitle: 'We identify areas for improvement and risks.' },
    preliminary_valuation: { title: 'Preliminary valuation', subtitle: 'Value estimate for decision making.' },
    structure_review: { title: 'Structure review', subtitle: 'Optimize your corporate and tax structure.' },
  },
  ca: {
    strategic_conversation: { title: 'Primera conversa estratègica', subtitle: 'Sense compromís. Analitzem la teva situació.' },
    initial_diagnosis: { title: 'Diagnòstic inicial', subtitle: 'Identifiquem àrees de millora i riscos.' },
    preliminary_valuation: { title: 'Valoració preliminar', subtitle: 'Estimació de valor per prendre decisions.' },
    structure_review: { title: 'Revisió d\'estructura', subtitle: 'Optimitza la teva organització societària i fiscal.' },
  },
};

// ============ CONTENIDO REAL DE LA WEB nrro.es ============

// Datos Clave de la web (KPIs reales)
const WEB_DATOS_CLAVE = {
  es: [
    { categoria: "Clientes", valor: "300+", descripcion: "Más de 300 empresas familiares y grupos confían en navarro." },
    { categoria: "Proyectos", valor: "500+", descripcion: "Operaciones de reestructuración, sucesión y M&A completadas con éxito." },
    { categoria: "Años de experiencia", valor: "25+", descripcion: "Trayectoria sólida acompañando a empresas familiares en su crecimiento." },
    { categoria: "Equipo", valor: "70+", descripcion: "Abogados y profesionales especializados en fiscal, mercantil, laboral y M&A." },
    { categoria: "Compromiso", valor: "100%", descripcion: "Dedicación total a cada mandato, con rigor técnico y confidencialidad." },
    { categoria: "Operaciones M&A", valor: "100+", descripcion: "Mandatos de compra y venta asesorados con un enfoque integral." },
  ],
  en: [
    { categoria: "Clients", valor: "300+", descripcion: "Over 300 family businesses and groups trust navarro." },
    { categoria: "Projects", valor: "500+", descripcion: "Restructuring, succession, and M&A operations successfully completed." },
    { categoria: "Years of experience", valor: "25+", descripcion: "Solid track record supporting family businesses in their growth." },
    { categoria: "Team", valor: "70+", descripcion: "Lawyers and professionals specialized in tax, corporate, labor and M&A." },
    { categoria: "Commitment", valor: "100%", descripcion: "Total dedication to every mandate, with technical rigor and confidentiality." },
    { categoria: "M&A Operations", valor: "100+", descripcion: "Buy and sell mandates advised with a comprehensive approach." },
  ],
  ca: [
    { categoria: "Clients", valor: "300+", descripcion: "Més de 300 empreses familiars i grups confien en navarro." },
    { categoria: "Projectes", valor: "500+", descripcion: "Operacions de reestructuració, successió i M&A completades amb èxit." },
    { categoria: "Anys d'experiència", valor: "25+", descripcion: "Trajectòria sòlida acompanyant empreses familiars en el seu creixement." },
    { categoria: "Equip", valor: "70+", descripcion: "Advocats i professionals especialitzats en fiscal, mercantil, laboral i M&A." },
    { categoria: "Compromís", valor: "100%", descripcion: "Dedicació total a cada mandat, amb rigor tècnic i confidencialitat." },
    { categoria: "Operacions M&A", valor: "100+", descripcion: "Mandats de compra i venda assessorats amb un enfocament integral." },
  ],
};

// Sección "Quiénes somos" - Contenido real de la web
const WEB_NOSOTROS = {
  es: {
    overline: "Nosotros navarro",
    title: "Asesoramiento estratégico y legal para empresas y grupos.",
    paragraphs: [
      "En navarro ofrecemos asesoramiento legal, fiscal y estratégico especializado en empresas familiares y estructuras empresariales consolidadas.",
      "Nuestra visión parte de la comprensión profunda de los retos de continuidad, gobernanza y crecimiento que enfrentan las compañías familiares. Aportamos soluciones concretas para planificar el relevo generacional, proteger el patrimonio y estructurar la actividad con seguridad jurídica.",
      "Nuestro equipo trabaja con rigor técnico, experiencia transversal y compromiso absoluto con cada cliente.",
      "Ya sea en la gestión diaria, la toma de decisiones clave o en procesos de compraventa, acompañamos a nuestros clientes con total confidencialidad y enfoque a largo plazo."
    ]
  },
  en: {
    overline: "About navarro",
    title: "Strategic and legal advisory for companies and groups.",
    paragraphs: [
      "At navarro we offer specialized legal, tax and strategic advisory for family businesses and established corporate structures.",
      "Our vision is based on a deep understanding of the continuity, governance and growth challenges that family businesses face. We provide concrete solutions to plan generational succession, protect assets and structure operations with legal certainty.",
      "Our team works with technical rigor, cross-functional experience and absolute commitment to each client.",
      "Whether in daily management, key decision-making or buy/sell processes, we accompany our clients with total confidentiality and a long-term approach."
    ]
  },
  ca: {
    overline: "Nosaltres navarro",
    title: "Assessorament estratègic i legal per a empreses i grups.",
    paragraphs: [
      "A navarro oferim assessorament legal, fiscal i estratègic especialitzat en empreses familiars i estructures empresarials consolidades.",
      "La nostra visió parteix de la comprensió profunda dels reptes de continuïtat, governança i creixement que enfronten les companyies familiars. Aportem solucions concretes per planificar el relleu generacional, protegir el patrimoni i estructurar l'activitat amb seguretat jurídica.",
      "El nostre equip treballa amb rigor tècnic, experiència transversal i compromís absolut amb cada client.",
      "Ja sigui en la gestió diària, la presa de decisions clau o en processos de compravenda, acompanyem els nostres clients amb total confidencialitat i enfocament a llarg termini."
    ]
  },
};

// Iconos SVG profesionales para valores
const VALUE_ICONS = {
  award: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  trending: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
};

// Valores reales de la web con iconos SVG
const WEB_VALORES = {
  es: [
    { icon: VALUE_ICONS.award, titulo: "Experiencia consolidada", descripcion: "25 años en el sector garantizan conocimiento profundo, visión estratégica y capacidad de anticipación ante cualquier escenario fiscal o legal." },
    { icon: VALUE_ICONS.target, titulo: "Rigor técnico absoluto", descripcion: "Formados en los principales despachos nacionales, aplicamos los más altos estándares de calidad. Cada asesoramiento está respaldado por un análisis exhaustivo y actualización normativa constante." },
    { icon: VALUE_ICONS.users, titulo: "Servicio 100% personalizado", descripcion: "Atención directa del socio, sin intermediarios. Conocemos tu negocio, tus objetivos y tus preocupaciones. Relación de confianza a largo plazo." },
    { icon: VALUE_ICONS.trending, titulo: "Orientación a resultados", descripcion: "No solo cumplimiento: asesoramiento estratégico orientado a optimizar tu fiscalidad, proteger tu patrimonio e impulsar el crecimiento de tu empresa." }
  ],
  en: [
    { icon: VALUE_ICONS.award, titulo: "Consolidated experience", descripcion: "25 years in the sector guarantee deep knowledge, strategic vision and the ability to anticipate any tax or legal scenario." },
    { icon: VALUE_ICONS.target, titulo: "Absolute technical rigor", descripcion: "Trained at leading national firms, we apply the highest quality standards. Every advisory is backed by thorough analysis and constant regulatory updates." },
    { icon: VALUE_ICONS.users, titulo: "100% personalized service", descripcion: "Direct attention from the partner, no intermediaries. We know your business, your goals and your concerns. Long-term trust relationship." },
    { icon: VALUE_ICONS.trending, titulo: "Results-oriented", descripcion: "Not just compliance: strategic advisory aimed at optimizing your taxation, protecting your assets and driving your company's growth." }
  ],
  ca: [
    { icon: VALUE_ICONS.award, titulo: "Experiència consolidada", descripcion: "25 anys al sector garanteixen coneixement profund, visió estratègica i capacitat d'anticipació davant qualsevol escenari fiscal o legal." },
    { icon: VALUE_ICONS.target, titulo: "Rigor tècnic absolut", descripcion: "Formats als principals despatxos nacionals, apliquem els més alts estàndards de qualitat. Cada assessorament està recolzat per una anàlisi exhaustiva i actualització normativa constant." },
    { icon: VALUE_ICONS.users, titulo: "Servei 100% personalitzat", descripcion: "Atenció directa del soci, sense intermediaris. Coneixem el teu negoci, els teus objectius i les teves preocupacions. Relació de confiança a llarg termini." },
    { icon: VALUE_ICONS.trending, titulo: "Orientació a resultats", descripcion: "No només compliment: assessorament estratègic orientat a optimitzar la teva fiscalitat, protegir el teu patrimoni i impulsar el creixement de la teva empresa." }
  ],
};

// Traducciones completas
const TRANSLATIONS = {
  es: {
    title: 'Presentación Corporativa',
    preparedFor: 'Preparado para',
    tableOfContents: 'Contenido',
    services: 'Servicios',
    team: 'Equipo',
    caseStudies: 'Casos de Éxito',
    aboutUs: 'Quiénes Somos',
    keyData: 'Datos Clave',
    ourValues: 'Nuestros Valores',
    aboutText: 'Ayudamos a empresas familiares, grupos y empresarios cuando el problema ya no es contable, sino estratégico, societario o patrimonial.',
    aboutTextExtended: 'Combinamos experiencia fiscal, legal y corporativa para ofrecer soluciones integrales. No solo resolvemos problemas: anticipamos, planificamos y acompañamos.',
    whyNavarro: 'Por qué Navarro',
    differentiators: 'Diferenciadores',
    methodology: 'Cómo Trabajamos',
    contact: 'Contacto',
    phone: '+34 934 593 600',
    email: 'info@nrro.es',
    address: 'Barcelona',
    website: 'nrro.es',
    stats: {
      years: '25+',
      yearsLabel: 'años de experiencia',
      clients: '300+',
      clientsLabel: 'clientes asesorados',
      team: '70+',
      teamLabel: 'profesionales',
      operations: '100+',
      operationsLabel: 'operaciones M&A',
    },
    valueProps: [
      { title: 'Especialización', desc: 'Enfoque exclusivo en empresa familiar y estructuras consolidadas' },
      { title: 'Equipo multidisciplinar', desc: 'Fiscal, legal, contable y laboral bajo un mismo techo' },
      { title: 'Visión 360°', desc: 'Entendemos tu negocio como un todo, no como casos aislados' },
      { title: 'Acompañamiento', desc: 'Relaciones a largo plazo, no proyectos puntuales' },
    ],
    methodologySteps: [
      { num: '01', title: 'Análisis', desc: 'Escucha activa y recopilación de información clave' },
      { num: '02', title: 'Diagnóstico', desc: 'Identificación de riesgos, oportunidades y prioridades' },
      { num: '03', title: 'Estrategia', desc: 'Diseño de solución personalizada con tu equipo' },
      { num: '04', title: 'Ejecución', desc: 'Implementación coordinada por expertos multidisciplinares' },
      { num: '05', title: 'Seguimiento', desc: 'Acompañamiento continuo y revisiones periódicas' },
    ],
    ctaText: '¿Hablamos?',
    ctaSubtext: 'Estamos a tu disposición para resolver cualquier consulta',
    theChallenge: 'El reto',
    ourSolution: 'Nuestra solución',
    results: 'Resultados',
    features: 'Características',
    benefits: 'Beneficios',
    typicalClients: 'Clientes típicos',
    experienceFallback: 'Experiencia acumulada en múltiples operaciones bajo estricta confidencialidad. Más de 200 transacciones y reestructuraciones completadas con éxito.',
    teamAggregate: 'Equipo senior especializado, apoyado por un grupo de más de 70 profesionales en las áreas clave.',
    whatWeDo: 'Qué hacemos',
    proof: 'Prueba',
    impact: 'Impacto',
  },
  en: {
    title: 'Corporate Presentation',
    preparedFor: 'Prepared for',
    tableOfContents: 'Contents',
    services: 'Services',
    team: 'Team',
    caseStudies: 'Success Stories',
    aboutUs: 'Who We Are',
    keyData: 'Key Data',
    ourValues: 'Our Values',
    aboutText: 'We help family businesses, groups and entrepreneurs when the problem is no longer accounting, but strategic, corporate or patrimonial.',
    aboutTextExtended: 'We combine tax, legal and corporate experience to offer comprehensive solutions. We don\'t just solve problems: we anticipate, plan and accompany.',
    whyNavarro: 'Why Navarro',
    differentiators: 'Differentiators',
    methodology: 'How We Work',
    contact: 'Contact',
    phone: '+34 934 593 600',
    email: 'info@nrro.es',
    address: 'Barcelona',
    website: 'nrro.es',
    stats: {
      years: '25+',
      yearsLabel: 'years of experience',
      clients: '300+',
      clientsLabel: 'clients advised',
      team: '70+',
      teamLabel: 'professionals',
      operations: '100+',
      operationsLabel: 'M&A operations',
    },
    valueProps: [
      { title: 'Specialization', desc: 'Exclusive focus on family business and consolidated structures' },
      { title: 'Multidisciplinary team', desc: 'Tax, legal, accounting and labor under one roof' },
      { title: '360° Vision', desc: 'We understand your business as a whole, not isolated cases' },
      { title: 'Partnership', desc: 'Long-term relationships, not one-off projects' },
    ],
    methodologySteps: [
      { num: '01', title: 'Analysis', desc: 'Active listening and key information gathering' },
      { num: '02', title: 'Diagnosis', desc: 'Identification of risks, opportunities and priorities' },
      { num: '03', title: 'Strategy', desc: 'Custom solution design with your team' },
      { num: '04', title: 'Execution', desc: 'Coordinated implementation by multidisciplinary experts' },
      { num: '05', title: 'Follow-up', desc: 'Continuous support and periodic reviews' },
    ],
    ctaText: 'Let\'s talk',
    ctaSubtext: 'We are at your disposal to answer any questions',
    theChallenge: 'The Challenge',
    ourSolution: 'Our Solution',
    results: 'Results',
    features: 'Features',
    benefits: 'Benefits',
    typicalClients: 'Typical Clients',
    experienceFallback: 'Accumulated experience in multiple operations under strict confidentiality. Over 200 transactions and restructurings successfully completed.',
    teamAggregate: 'Senior specialized team, supported by a group of over 70 professionals in key areas.',
    whatWeDo: 'What we do',
    proof: 'Proof',
    impact: 'Impact',
  },
  ca: {
    title: 'Presentació Corporativa',
    preparedFor: 'Preparat per a',
    tableOfContents: 'Contingut',
    services: 'Serveis',
    team: 'Equip',
    caseStudies: 'Casos d\'Èxit',
    aboutUs: 'Qui Som',
    keyData: 'Dades Clau',
    ourValues: 'Els Nostres Valors',
    aboutText: 'Ajudem empreses familiars, grups i empresaris quan el problema ja no és comptable, sinó estratègic, societari o patrimonial.',
    aboutTextExtended: 'Combinem experiència fiscal, legal i corporativa per oferir solucions integrals. No només resolem problemes: anticipem, planifiquem i acompanyem.',
    whyNavarro: 'Per què Navarro',
    differentiators: 'Diferenciadors',
    methodology: 'Com Treballem',
    contact: 'Contacte',
    phone: '+34 934 593 600',
    email: 'info@nrro.es',
    address: 'Barcelona',
    website: 'nrro.es',
    stats: {
      years: '25+',
      yearsLabel: 'anys d\'experiència',
      clients: '300+',
      clientsLabel: 'clients assessorats',
      team: '70+',
      teamLabel: 'professionals',
      operations: '100+',
      operationsLabel: 'operacions M&A',
    },
    valueProps: [
      { title: 'Especialització', desc: 'Enfocament exclusiu en empresa familiar i estructures consolidades' },
      { title: 'Equip multidisciplinari', desc: 'Fiscal, legal, comptable i laboral sota un mateix sostre' },
      { title: 'Visió 360°', desc: 'Entenem el teu negoci com un tot, no com casos aïllats' },
      { title: 'Acompanyament', desc: 'Relacions a llarg termini, no projectes puntuals' },
    ],
    methodologySteps: [
      { num: '01', title: 'Anàlisi', desc: 'Escolta activa i recopilació d\'informació clau' },
      { num: '02', title: 'Diagnòstic', desc: 'Identificació de riscos, oportunitats i prioritats' },
      { num: '03', title: 'Estratègia', desc: 'Disseny de solució personalitzada amb el teu equip' },
      { num: '04', title: 'Execució', desc: 'Implementació coordinada per experts multidisciplinaris' },
      { num: '05', title: 'Seguiment', desc: 'Acompanyament continu i revisions periòdiques' },
    ],
    ctaText: 'Parlem?',
    ctaSubtext: 'Estem a la teva disposició per resoldre qualsevol consulta',
    theChallenge: 'El repte',
    ourSolution: 'La nostra solució',
    results: 'Resultats',
    features: 'Característiques',
    benefits: 'Beneficis',
    typicalClients: 'Clients típics',
    experienceFallback: 'Experiència acumulada en múltiples operacions sota estricta confidencialitat. Més de 200 transaccions i reestructuracions completades amb èxit.',
    teamAggregate: 'Equip senior especialitzat, recolzat per un grup de més de 70 professionals en les àrees clau.',
    whatWeDo: 'Què fem',
    proof: 'Prova',
    impact: 'Impacte',
  },
};

// Helper para obtener cover tagline
function getCoverTagline(presentation: GeneratedPresentation, lang: string): string {
  const type = presentation.presentation_type || 'corporate';
  const audience = presentation.audience_type || 'family_business';
  
  // Si hay un tagline personalizado, usarlo
  if (presentation.cover_tagline) {
    return presentation.cover_tagline;
  }
  
  const taglines = COVER_TAGLINES[lang as keyof typeof COVER_TAGLINES] || COVER_TAGLINES.es;
  const typeTaglines = taglines[type as keyof typeof taglines] || taglines.corporate;
  return typeTaglines[audience as keyof typeof typeTaglines] || typeTaglines.family_business;
}

// Helper para obtener CTA
function getCTA(presentation: GeneratedPresentation, lang: string) {
  const ctaType = presentation.cta_type || 'strategic_conversation';
  const ctas = CTA_TYPES[lang as keyof typeof CTA_TYPES] || CTA_TYPES.es;
  return ctas[ctaType as keyof typeof ctas] || ctas.strategic_conversation;
}

// Helper para obtener diferenciadores
function getDifferentiators(presentation: GeneratedPresentation, lang: string) {
  // Si hay diferenciadores personalizados, usarlos
  if (presentation.differentiators && presentation.differentiators.length > 0) {
    return presentation.differentiators;
  }
  return DIFFERENTIATORS[lang as keyof typeof DIFFERENTIATORS] || DIFFERENTIATORS.es;
}

// Helper para obtener datos clave de la web
function getWebDatosClave(lang: string) {
  return WEB_DATOS_CLAVE[lang as keyof typeof WEB_DATOS_CLAVE] || WEB_DATOS_CLAVE.es;
}

// Helper para obtener contenido "Nosotros" de la web
function getWebNosotros(lang: string) {
  return WEB_NOSOTROS[lang as keyof typeof WEB_NOSOTROS] || WEB_NOSOTROS.es;
}

// Helper para obtener valores de la web
function getWebValores(lang: string) {
  return WEB_VALORES[lang as keyof typeof WEB_VALORES] || WEB_VALORES.es;
}

function generateHTML(presentation: GeneratedPresentation): string {
  const lang = presentation.language as keyof typeof TRANSLATIONS;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
  const isHorizontal = presentation.format === 'horizontal';
  const qualityMode = presentation.quality_mode || 'professional';
  
  const pageWidth = isHorizontal ? '1920px' : '210mm';
  const pageHeight = isHorizontal ? '1080px' : '297mm';
  
  // Obtener contenido de módulos narrativos
  const coverTagline = getCoverTagline(presentation, presentation.language);
  const cta = getCTA(presentation, presentation.language);
  const differentiators = getDifferentiators(presentation, presentation.language);
  
  // Obtener contenido real de la web
  const webDatos = getWebDatosClave(presentation.language);
  const webNosotros = getWebNosotros(presentation.language);
  const webValores = getWebValores(presentation.language);
  
  // Paginar servicios (máx 4 por página en A4, 6 en horizontal)
  const SERVICES_PER_PAGE = isHorizontal ? 6 : 4;
  const servicePages: ServiceSummary[][] = [];
  for (let i = 0; i < presentation.services_included.length; i += SERVICES_PER_PAGE) {
    servicePages.push(presentation.services_included.slice(i, i + SERVICES_PER_PAGE));
  }
  
  // Equipo: core (máx 4) + agregado
  const coreTeam = presentation.team_members_included.slice(0, 4);
  const hasMoreTeam = presentation.team_members_included.length > 4;

  return `
<!DOCTYPE html>
<html lang="${presentation.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - ${presentation.client_name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'General Sans';
      src: url('https://cdn.fontshare.com/wf/QMZTWBJVGU5HFGTMVFXDOSJV6TMQPLNC/LN7BSFPBYMQBHMYC4LO3VNHRCXKWYKII/RDHEPGC7BXHXHXKX6FHXTWLQCF6WD6RM.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'General Sans';
      src: url('https://cdn.fontshare.com/wf/QMZTWBJVGU5HFGTMVFXDOSJV6TMQPLNC/TZTQ6DQRV2KZQGFEVDXHWETJJQJNQUJP/WGQJMW742BTLRLYTLZXPBYPB77TYJQZQ.woff2') format('woff2');
      font-weight: 500;
      font-style: normal;
    }
    @font-face {
      font-family: 'General Sans';
      src: url('https://cdn.fontshare.com/wf/QMZTWBJVGU5HFGTMVFXDOSJV6TMQPLNC/4BZDFFHVPDDSQVLWYJKJOGUZXYJRQHLK/HNPVL6BHRLX2OLH6AKASG6NGJFAXR6KE.woff2') format('woff2');
      font-weight: 600;
      font-style: normal;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --black: #000000;
      --accent: hsl(172, 60%, 15%);
      --accent-light: hsl(172, 40%, 25%);
      --foreground: hsl(190, 63%, 6%);
      --muted: hsl(195, 3%, 62%);
      --neutral-50: #fafafa;
      --neutral-100: #f5f5f5;
      --neutral-200: #e5e5e5;
      --neutral-800: #262626;
      --white: #ffffff;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: var(--neutral-100);
      color: var(--foreground);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'General Sans', 'Plus Jakarta Sans', system-ui, sans-serif;
      font-weight: 400;
      letter-spacing: -0.02em;
    }
    
    .page {
      width: ${pageWidth};
      min-height: ${pageHeight};
      height: ${pageHeight};
      background: var(--white);
      margin: 0 auto;
      padding: ${isHorizontal ? '60px 80px' : '40px 35px'};
      page-break-after: always;
      page-break-inside: avoid;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    /* ========== PORTADA ESTRATÉGICA (M1) ========== */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: var(--black);
      color: var(--white);
      position: relative;
    }
    
    .cover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at 30% 20%, rgba(19, 61, 52, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(19, 61, 52, 0.2) 0%, transparent 50%);
      pointer-events: none;
    }
    
    .cover-content {
      position: relative;
      z-index: 1;
    }
    
    .cover .logo {
      margin-bottom: ${isHorizontal ? '50px' : '35px'};
    }
    
    .cover-tagline {
      font-size: ${isHorizontal ? '48px' : '32px'};
      font-weight: 400;
      margin-bottom: 40px;
      letter-spacing: -0.03em;
      line-height: 1.3;
      white-space: pre-line;
      max-width: 800px;
    }
    
    .cover .prepared-for {
      font-size: ${isHorizontal ? '14px' : '11px'};
      text-transform: uppercase;
      letter-spacing: 0.2em;
      opacity: 0.5;
      margin-bottom: 8px;
    }
    
    .cover .client-name {
      font-size: ${isHorizontal ? '28px' : '20px'};
      font-weight: 500;
      color: var(--white);
      margin-bottom: 4px;
    }
    
    .cover .client-company {
      font-size: ${isHorizontal ? '20px' : '15px'};
      opacity: 0.7;
    }
    
    .cover .date {
      position: absolute;
      bottom: 50px;
      font-size: 12px;
      opacity: 0.4;
      letter-spacing: 0.1em;
    }
    
    /* ========== CABECERA DE PÁGINA ========== */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${isHorizontal ? '40px' : '28px'};
      padding-bottom: 16px;
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .page-header .logo-small {
      opacity: 0.8;
    }
    
    .page-number {
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 0.1em;
    }
    
    /* ========== TÍTULOS DE SECCIÓN ========== */
    .section-title {
      font-size: ${isHorizontal ? '42px' : '26px'};
      font-weight: 400;
      color: var(--foreground);
      margin-bottom: ${isHorizontal ? '36px' : '20px'};
      position: relative;
    }
    
    .section-title::after {
      content: '';
      display: block;
      width: 45px;
      height: 3px;
      background: var(--accent);
      margin-top: 10px;
    }
    
    /* ========== ÍNDICE / TOC ========== */
    .toc-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: calc(100% - 120px);
    }
    
    .toc-list {
      list-style: none;
    }
    
    .toc-item {
      display: flex;
      align-items: baseline;
      padding: ${isHorizontal ? '24px 0' : '16px 0'};
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .toc-number {
      font-family: 'General Sans', sans-serif;
      font-size: ${isHorizontal ? '48px' : '32px'};
      font-weight: 500;
      color: var(--accent);
      width: ${isHorizontal ? '100px' : '70px'};
      flex-shrink: 0;
    }
    
    .toc-title {
      font-size: ${isHorizontal ? '24px' : '18px'};
      color: var(--foreground);
      font-weight: 500;
    }
    
    /* ========== QUIÉNES SOMOS (M2) - Full width sin stats ========== */
    .about-content {
      display: flex;
      flex-direction: column;
      gap: ${isHorizontal ? '40px' : '24px'};
    }
    
    .about-text {
      font-size: ${isHorizontal ? '22px' : '16px'};
      line-height: 1.8;
      color: var(--foreground);
      max-width: 100%;
    }
    
    .about-text-extended {
      margin-top: 20px;
      font-size: ${isHorizontal ? '18px' : '14px'};
      color: var(--neutral-800);
      opacity: 0.85;
    }
    
    .about-paragraphs p {
      margin-bottom: ${isHorizontal ? '24px' : '18px'};
      font-size: ${isHorizontal ? '20px' : '15px'};
      line-height: 1.8;
      color: var(--foreground);
    }
    
    .about-paragraphs p:last-child {
      margin-bottom: 0;
    }
    
    .about-text .custom-intro {
      margin-top: 24px;
      padding: 20px 24px;
      background: var(--neutral-50);
      border-left: 3px solid var(--accent);
      font-style: italic;
      color: var(--neutral-800);
      font-size: ${isHorizontal ? '18px' : '14px'};
    }
    
    /* ========== DATOS CLAVE (KPIs) ========== */
    .key-data-section {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .key-data-subtitle {
      font-size: ${isHorizontal ? '16px' : '12px'};
      color: var(--muted);
      margin-bottom: ${isHorizontal ? '32px' : '20px'};
      margin-top: -${isHorizontal ? '20px' : '10px'};
    }
    
    .key-data-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${isHorizontal ? '16px' : '10px'};
      width: 100%;
      flex: 1;
      align-content: center;
    }
    
    .key-data-card {
      padding: ${isHorizontal ? '32px 24px' : '20px 16px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      border-left: 4px solid var(--accent);
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: ${isHorizontal ? '160px' : '100px'};
    }
    
    .key-data-category {
      font-size: ${isHorizontal ? '11px' : '9px'};
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--muted);
      margin-bottom: 12px;
    }
    
    .key-data-value {
      font-family: 'General Sans', sans-serif;
      font-size: ${isHorizontal ? '52px' : '32px'};
      font-weight: 500;
      color: var(--accent);
      line-height: 1;
      margin-bottom: 12px;
    }
    
    .key-data-desc {
      font-size: ${isHorizontal ? '14px' : '10px'};
      color: var(--neutral-800);
      line-height: 1.5;
    }
    
    /* ========== VALORES (de la web) ========== */
    .values-section {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .values-subtitle {
      font-size: ${isHorizontal ? '16px' : '12px'};
      color: var(--muted);
      margin-bottom: ${isHorizontal ? '32px' : '20px'};
      margin-top: -${isHorizontal ? '20px' : '10px'};
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: ${isHorizontal ? '20px' : '12px'};
      flex: 1;
      align-content: center;
    }
    
    .value-card {
      padding: ${isHorizontal ? '32px 28px' : '20px 16px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      display: flex;
      gap: ${isHorizontal ? '24px' : '16px'};
      align-items: flex-start;
      min-height: ${isHorizontal ? '140px' : '90px'};
    }
    
    .value-icon {
      width: ${isHorizontal ? '56px' : '40px'};
      height: ${isHorizontal ? '56px' : '40px'};
      background: var(--black);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .value-icon svg {
      width: ${isHorizontal ? '28px' : '20px'};
      height: ${isHorizontal ? '28px' : '20px'};
    }
    
    .value-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .value-title {
      font-family: 'General Sans', sans-serif;
      font-size: ${isHorizontal ? '20px' : '15px'};
      font-weight: 500;
      color: var(--foreground);
      margin-bottom: 8px;
    }
    
    .value-desc {
      font-size: ${isHorizontal ? '15px' : '11px'};
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: ${isHorizontal ? '20px' : '10px'};
      width: 100%;
    }
    
    .stat-item {
      text-align: center;
      padding: ${isHorizontal ? '28px 16px' : '16px 8px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
    }
    
    .stat-value {
      font-family: 'General Sans', sans-serif;
      font-size: ${isHorizontal ? '42px' : '26px'};
      font-weight: 500;
      color: var(--accent);
      line-height: 1;
    }
    
    .stat-label {
      font-size: ${isHorizontal ? '11px' : '9px'};
      color: var(--muted);
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* ========== DIFERENCIADORES (M3) ========== */
    .diff-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: ${isHorizontal ? '24px' : '14px'};
      margin-top: ${isHorizontal ? '30px' : '18px'};
    }
    
    .diff-card {
      padding: ${isHorizontal ? '32px 24px' : '18px 14px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      position: relative;
    }
    
    .diff-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--accent);
    }
    
    .diff-title {
      font-family: 'General Sans', sans-serif;
      font-size: ${isHorizontal ? '20px' : '14px'};
      font-weight: 500;
      color: var(--foreground);
      margin-bottom: 8px;
    }
    
    .diff-desc {
      font-size: ${isHorizontal ? '14px' : '11px'};
      color: var(--muted);
      margin-bottom: 12px;
    }
    
    .diff-proof {
      display: flex;
      gap: 16px;
      font-size: ${isHorizontal ? '12px' : '10px'};
      padding-top: 12px;
      border-top: 1px dashed var(--neutral-200);
    }
    
    .diff-proof-item {
      flex: 1;
    }
    
    .diff-proof-label {
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      font-size: ${isHorizontal ? '10px' : '8px'};
      margin-bottom: 4px;
    }
    
    .diff-proof-value {
      color: var(--neutral-800);
    }
    
    /* ========== METODOLOGÍA (M5) ========== */
    .methodology-grid {
      display: grid;
      grid-template-columns: repeat(${isHorizontal ? '5' : '2'}, 1fr);
      gap: ${isHorizontal ? '16px' : '12px'};
      margin-top: ${isHorizontal ? '40px' : '24px'};
    }
    
    .methodology-step {
      text-align: center;
      padding: ${isHorizontal ? '32px 16px' : '18px 10px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      position: relative;
    }
    
    .methodology-number {
      font-family: 'General Sans', sans-serif;
      font-size: ${isHorizontal ? '48px' : '32px'};
      font-weight: 600;
      color: var(--accent);
      opacity: 0.25;
      line-height: 1;
      margin-bottom: 8px;
    }
    
    .methodology-title {
      font-size: ${isHorizontal ? '18px' : '13px'};
      font-weight: 500;
      color: var(--foreground);
      margin-bottom: 6px;
    }
    
    .methodology-desc {
      font-size: ${isHorizontal ? '13px' : '10px'};
      color: var(--muted);
      line-height: 1.4;
    }
    
    /* ========== SERVICIOS (M4) ========== */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: ${isHorizontal ? '20px' : '12px'};
      width: 100%;
    }
    
    .service-card {
      padding: ${isHorizontal ? '24px 20px' : '14px 12px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
    }
    
    .service-card h4 {
      font-size: ${isHorizontal ? '16px' : '13px'};
      font-weight: 500;
      color: var(--foreground);
      margin-bottom: 4px;
      line-height: 1.3;
    }
    
    .service-card .service-area-tag {
      font-size: ${isHorizontal ? '10px' : '9px'};
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      font-weight: 600;
    }
    
    .service-card p {
      font-size: ${isHorizontal ? '13px' : '10px'};
      color: var(--muted);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .service-features {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed var(--neutral-200);
    }
    
    .service-features-title {
      font-size: ${isHorizontal ? '11px' : '9px'};
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      font-weight: 600;
    }
    
    .service-features-list {
      font-size: ${isHorizontal ? '11px' : '9px'};
      color: var(--muted);
      line-height: 1.4;
    }
    
    .service-feature-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 4px;
    }
    
    .service-feature-item:last-child {
      margin-bottom: 0;
    }
    
    .feature-check {
      color: var(--accent);
      font-weight: 600;
      flex-shrink: 0;
    }
    
    /* ========== EQUIPO (M7) ========== */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(${isHorizontal ? '4' : '2'}, 1fr);
      gap: ${isHorizontal ? '24px' : '14px'};
    }
    
    .team-card {
      text-align: center;
      padding: ${isHorizontal ? '28px 20px' : '16px 12px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
    }
    
    .team-avatar {
      width: ${isHorizontal ? '80px' : '60px'};
      height: ${isHorizontal ? '80px' : '60px'};
      border-radius: 50%;
      background: var(--accent);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${isHorizontal ? '28px' : '22px'};
      font-weight: 500;
      margin: 0 auto 14px;
      font-family: 'General Sans', sans-serif;
      overflow: hidden;
    }
    
    .team-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .team-name {
      font-size: ${isHorizontal ? '16px' : '13px'};
      font-weight: 500;
      color: var(--foreground);
    }
    
    .team-position {
      font-size: ${isHorizontal ? '13px' : '11px'};
      color: var(--muted);
      margin-top: 3px;
    }
    
    .team-specialization {
      font-size: ${isHorizontal ? '11px' : '10px'};
      color: var(--accent);
      margin-top: 6px;
      font-weight: 500;
    }
    
    .team-bio {
      font-size: ${isHorizontal ? '11px' : '9px'};
      color: var(--muted);
      margin-top: 8px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .team-aggregate {
      margin-top: ${isHorizontal ? '24px' : '16px'};
      padding: ${isHorizontal ? '20px 24px' : '14px 16px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      text-align: center;
      font-size: ${isHorizontal ? '16px' : '13px'};
      color: var(--neutral-800);
    }
    
    /* ========== CASOS DE ÉXITO (M6) ========== */
    .case-study-card {
      padding: ${isHorizontal ? '28px' : '20px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      margin-bottom: ${isHorizontal ? '20px' : '14px'};
    }
    
    .case-study-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 14px;
    }
    
    .case-study-title {
      font-size: ${isHorizontal ? '20px' : '16px'};
      font-weight: 500;
      color: var(--foreground);
    }
    
    .case-study-client {
      font-size: 13px;
      color: var(--muted);
      margin-top: 3px;
    }
    
    .case-study-industry {
      font-size: 11px;
      padding: 5px 12px;
      background: var(--accent);
      color: var(--white);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .case-study-content {
      display: grid;
      grid-template-columns: ${isHorizontal ? '1fr 1fr' : '1fr'};
      gap: ${isHorizontal ? '24px' : '14px'};
      margin-top: 14px;
    }
    
    .case-study-section {
      padding: ${isHorizontal ? '16px' : '12px'};
      background: var(--white);
      border: 1px solid var(--neutral-200);
    }
    
    .case-study-section-title {
      font-size: ${isHorizontal ? '12px' : '10px'};
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .case-study-section-text {
      font-size: ${isHorizontal ? '14px' : '11px'};
      color: var(--neutral-800);
      line-height: 1.5;
    }
    
    .case-study-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 14px;
    }
    
    .metric-item {
      text-align: center;
      padding: ${isHorizontal ? '16px' : '10px'};
      background: var(--white);
      border: 1px solid var(--accent);
    }
    
    .metric-value {
      font-family: 'General Sans', sans-serif;
      font-size: ${isHorizontal ? '28px' : '20px'};
      font-weight: 600;
      color: var(--accent);
    }
    
    .metric-label {
      font-size: ${isHorizontal ? '11px' : '9px'};
      color: var(--muted);
      margin-top: 4px;
    }
    
    .testimonial-block {
      margin-top: 16px;
      padding: ${isHorizontal ? '20px 24px' : '14px 16px'};
      background: var(--foreground);
      color: var(--white);
      position: relative;
    }
    
    .testimonial-block::before {
      content: '"';
      font-family: Georgia, serif;
      font-size: ${isHorizontal ? '60px' : '40px'};
      position: absolute;
      top: ${isHorizontal ? '-10px' : '-5px'};
      left: 16px;
      opacity: 0.3;
      color: var(--accent-light);
    }
    
    .testimonial-text {
      font-size: ${isHorizontal ? '15px' : '12px'};
      font-style: italic;
      line-height: 1.6;
      margin-bottom: 12px;
      padding-left: 20px;
    }
    
    .testimonial-author {
      font-size: ${isHorizontal ? '13px' : '11px'};
      font-weight: 500;
      padding-left: 20px;
    }
    
    .testimonial-position {
      font-size: ${isHorizontal ? '11px' : '10px'};
      opacity: 0.7;
      padding-left: 20px;
    }
    
    /* Fallback para casos bajo NDA */
    .case-fallback {
      padding: ${isHorizontal ? '40px' : '28px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      text-align: center;
    }
    
    .case-fallback h3 {
      font-size: ${isHorizontal ? '24px' : '18px'};
      margin-bottom: 16px;
      color: var(--foreground);
    }
    
    .case-fallback p {
      font-size: ${isHorizontal ? '16px' : '13px'};
      color: var(--muted);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    /* ========== CONTACTO / CTA (M8) ========== */
    .contact-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: var(--black);
      color: var(--white);
      position: relative;
    }
    
    .contact-page::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at 50% 50%, rgba(19, 61, 52, 0.4) 0%, transparent 60%);
      pointer-events: none;
    }
    
    .contact-content {
      position: relative;
      z-index: 1;
    }
    
    .contact-title {
      font-size: ${isHorizontal ? '56px' : '38px'};
      font-weight: 400;
      margin-bottom: 14px;
    }
    
    .contact-subtitle {
      font-size: ${isHorizontal ? '18px' : '14px'};
      opacity: 0.7;
      margin-bottom: 50px;
      max-width: 450px;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${isHorizontal ? '60px' : '32px'};
      margin-bottom: 50px;
    }
    
    .contact-item {
      text-align: center;
    }
    
    .contact-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      opacity: 0.5;
      margin-bottom: 6px;
    }
    
    .contact-value {
      font-size: ${isHorizontal ? '20px' : '16px'};
      font-weight: 500;
    }
    
    .contact-value a {
      color: var(--white);
      text-decoration: none;
    }
    
    .contact-logo {
      margin-top: 32px;
      opacity: 0.8;
    }
    
    @media print {
      @page {
        size: ${isHorizontal ? '1920px 1080px' : '210mm 297mm'};
        margin: 0;
      }
      
      html, body {
        width: ${pageWidth};
        height: ${pageHeight};
        margin: 0;
        padding: 0;
        background: white;
      }
      
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      .page {
        width: ${pageWidth} !important;
        min-height: ${pageHeight} !important;
        height: ${pageHeight} !important;
        margin: 0 !important;
        padding: ${isHorizontal ? '60px 80px' : '40px 35px'} !important;
        box-shadow: none !important;
        page-break-after: always !important;
        page-break-inside: avoid !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      
      .page:last-child {
        page-break-after: auto !important;
      }
      
      .cover, .contact-page {
        background: var(--black) !important;
        color: var(--white) !important;
      }
    }
  </style>
</head>
<body>
  <!-- M1: PORTADA ESTRATÉGICA -->
  <div class="page cover">
    <div class="cover-content">
      ${presentation.client_logo_url ? `
      <div class="cover-logos" style="display: flex; align-items: center; gap: 24px; margin-bottom: 50px;">
        <div class="cover-logo-navarro">${NAVARRO_LOGO_SVG}</div>
        <span style="font-size: 32px; opacity: 0.3;">×</span>
        <img src="${presentation.client_logo_url}" alt="${presentation.client_company || presentation.client_name}" style="max-height: 60px; max-width: 200px;" />
      </div>
      ` : `
      <div class="logo">${NAVARRO_LOGO_SVG}</div>
      `}
      <h1 class="cover-tagline">${coverTagline}</h1>
      <p class="prepared-for">${t.preparedFor}</p>
      <p class="client-name">${presentation.client_name}</p>
      ${presentation.client_company ? `<p class="client-company">${presentation.client_company}</p>` : ''}
    </div>
    <p class="date">${new Date().toLocaleDateString(presentation.language === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long' })}</p>
  </div>
  
  ${presentation.include_toc !== false ? `
  <!-- ÍNDICE -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">02</span>
    </div>
    <h2 class="section-title">${t.tableOfContents}</h2>
    <div class="toc-content">
      <ul class="toc-list">
        <li class="toc-item">
          <span class="toc-number">01</span>
          <span class="toc-title">${t.aboutUs}</span>
        </li>
        <li class="toc-item">
          <span class="toc-number">02</span>
          <span class="toc-title">${t.keyData}</span>
        </li>
        <li class="toc-item">
          <span class="toc-number">03</span>
          <span class="toc-title">${t.ourValues}</span>
        </li>
        ${presentation.include_value_proposition !== false ? `
        <li class="toc-item">
          <span class="toc-number">04</span>
          <span class="toc-title">${t.differentiators}</span>
        </li>
        ` : ''}
        ${presentation.include_methodology !== false ? `
        <li class="toc-item">
          <span class="toc-number">05</span>
          <span class="toc-title">${t.methodology}</span>
        </li>
        ` : ''}
        <li class="toc-item">
          <span class="toc-number">06</span>
          <span class="toc-title">${t.services}</span>
        </li>
        ${coreTeam.length > 0 ? `
        <li class="toc-item">
          <span class="toc-number">07</span>
          <span class="toc-title">${t.team}</span>
        </li>
        ` : ''}
        <li class="toc-item">
          <span class="toc-number">08</span>
          <span class="toc-title">${presentation.case_studies_included.length > 0 ? t.caseStudies : t.contact}</span>
        </li>
      </ul>
    </div>
  </div>
  ` : ''}
  
  <!-- M2: QUIÉNES SOMOS (contenido real de la web - sin stats duplicados) -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${presentation.include_toc !== false ? '03' : '02'}</span>
    </div>
    <h2 class="section-title">${t.aboutUs}</h2>
    <div class="about-content">
      <div class="about-text">
        <div class="about-paragraphs">
          ${webNosotros.paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>
        ${presentation.custom_intro ? `<div class="custom-intro"><p>${presentation.custom_intro}</p></div>` : ''}
      </div>
    </div>
  </div>
  
  <!-- DATOS CLAVE (KPIs reales de la web) -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${presentation.include_toc !== false ? '04' : '03'}</span>
    </div>
    <div class="key-data-section">
      <h2 class="section-title">${t.keyData}</h2>
      <p class="key-data-subtitle">${lang === 'es' ? 'Cifras que respaldan nuestra trayectoria' : lang === 'ca' ? 'Xifres que avalen la nostra trajectòria' : 'Numbers that back our track record'}</p>
      <div class="key-data-grid">
        ${webDatos.map(dato => `
          <div class="key-data-card">
            <div class="key-data-category">${dato.categoria}</div>
            <div class="key-data-value">${dato.valor}</div>
            <div class="key-data-desc">${dato.descripcion}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  
  <!-- NUESTROS VALORES (contenido real de la web) -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${presentation.include_toc !== false ? '05' : '04'}</span>
    </div>
    <div class="values-section">
      <h2 class="section-title">${t.ourValues}</h2>
      <p class="values-subtitle">${lang === 'es' ? 'Principios que guían nuestra práctica profesional' : lang === 'ca' ? 'Principis que guien la nostra pràctica professional' : 'Principles that guide our professional practice'}</p>
      <div class="values-grid">
        ${webValores.map(valor => `
          <div class="value-card">
            <div class="value-icon">${valor.icon}</div>
            <div class="value-content">
              <div class="value-title">${valor.titulo}</div>
              <div class="value-desc">${valor.descripcion}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  
  ${presentation.include_value_proposition !== false ? `
  <!-- M3: DIFERENCIADORES -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${presentation.include_toc !== false ? '06' : '05'}</span>
    </div>
    <h2 class="section-title">${t.whyNavarro}</h2>
    <div class="diff-grid">
      ${differentiators.map(diff => `
        <div class="diff-card">
          <div class="diff-title">${diff.title}</div>
          <div class="diff-desc">${diff.description}</div>
          <div class="diff-proof">
            <div class="diff-proof-item">
              <div class="diff-proof-label">${t.proof}</div>
              <div class="diff-proof-value">${diff.proof}</div>
            </div>
            <div class="diff-proof-item">
              <div class="diff-proof-label">${t.impact}</div>
              <div class="diff-proof-value">${diff.impact}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  
  ${presentation.include_methodology !== false ? `
  <!-- M5: METODOLOGÍA -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${presentation.include_toc !== false ? '07' : '06'}</span>
    </div>
    <h2 class="section-title">${t.methodology}</h2>
    <div class="methodology-grid">
      ${t.methodologySteps.map(step => `
        <div class="methodology-step">
          <div class="methodology-number">${step.num}</div>
          <div class="methodology-title">${step.title}</div>
          <div class="methodology-desc">${step.desc}</div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  
  <!-- M4: SERVICIOS (con checkmarks) -->
  ${servicePages.map((pageServices, pageIndex) => `
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${String(8 + pageIndex).padStart(2, '0')}</span>
    </div>
    <h2 class="section-title">${t.services}${servicePages.length > 1 ? ` (${pageIndex + 1}/${servicePages.length})` : ''}</h2>
    <div class="services-grid">
      ${pageServices.map(service => `
        <div class="service-card">
          <div class="service-area-tag">${service.area || 'Servicios'}</div>
          <h4>${service.name}</h4>
          <p>${service.description}</p>
          ${presentation.show_service_features !== false && service.features && service.features.length > 0 ? `
            <div class="service-features">
              <div class="service-features-title">${t.features}</div>
              <div class="service-features-list">
                ${service.features.slice(0, 3).map(f => `
                  <div class="service-feature-item">
                    <span class="feature-check">✓</span>
                    <span>${f}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  </div>
  `).join('')}
  
  ${coreTeam.length > 0 ? `
  <!-- M7: EQUIPO (Core + Agregado) -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${String(6 + servicePages.length).padStart(2, '0')}</span>
    </div>
    <h2 class="section-title">${t.team}</h2>
    <div class="team-grid">
      ${coreTeam.map(member => `
        <div class="team-card">
          <div class="team-avatar">
            ${member.avatar_url 
              ? `<img src="${member.avatar_url}" alt="${member.name}" />` 
              : member.name.charAt(0)
            }
          </div>
          <div class="team-name">${member.name}</div>
          <div class="team-position">${member.position}</div>
          ${member.specialization ? `<div class="team-specialization">${member.specialization}</div>` : ''}
          ${presentation.show_team_bio !== false && member.bio ? `<div class="team-bio">${member.bio}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ${hasMoreTeam ? `<div class="team-aggregate">${t.teamAggregate}</div>` : ''}
  </div>
  ` : ''}
  
  <!-- M6: CASOS DE ÉXITO (con fallback inteligente) -->
  ${presentation.case_studies_included.length > 0 ? presentation.case_studies_included.map((cs, csIndex) => `
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${String(7 + servicePages.length + (coreTeam.length > 0 ? 1 : 0) + csIndex).padStart(2, '0')}</span>
    </div>
    <h2 class="section-title">${t.caseStudies}${presentation.case_studies_included.length > 1 ? ` (${csIndex + 1}/${presentation.case_studies_included.length})` : ''}</h2>
    <div class="case-study-card">
      <div class="case-study-header">
        <div>
          <div class="case-study-title">${cs.title}</div>
          <div class="case-study-client">${cs.client_name}</div>
        </div>
        <span class="case-study-industry">${cs.client_industry}</span>
      </div>
      
      ${cs.challenge || cs.solution ? `
      <div class="case-study-content">
        ${cs.challenge ? `
        <div class="case-study-section">
          <div class="case-study-section-title">${t.theChallenge}</div>
          <div class="case-study-section-text">${cs.challenge}</div>
        </div>
        ` : ''}
        ${cs.solution ? `
        <div class="case-study-section">
          <div class="case-study-section-title">${t.ourSolution}</div>
          <div class="case-study-section-text">${cs.solution}</div>
        </div>
        ` : ''}
      </div>
      ` : `
      <div class="case-study-section">
        <div class="case-study-section-title">${t.results}</div>
        <div class="case-study-section-text">${cs.results_summary}</div>
      </div>
      `}
      
      ${presentation.show_case_metrics !== false && cs.metrics && cs.metrics.length > 0 ? `
      <div class="case-study-metrics">
        ${cs.metrics.slice(0, 3).map(metric => `
          <div class="metric-item">
            <div class="metric-value">${metric.value}</div>
            <div class="metric-label">${metric.label}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${presentation.show_testimonials !== false && cs.testimonial_text ? `
      <div class="testimonial-block">
        <div class="testimonial-text">${cs.testimonial_text}</div>
        ${cs.testimonial_author ? `<div class="testimonial-author">${cs.testimonial_author}</div>` : ''}
        ${cs.testimonial_position ? `<div class="testimonial-position">${cs.testimonial_position}</div>` : ''}
      </div>
      ` : ''}
    </div>
  </div>
  `).join('') : ''}
  
  <!-- M8: CONTACTO / CTA INTELIGENTE -->
  <div class="page contact-page">
    <div class="contact-content">
      <h2 class="contact-title">${cta.title}</h2>
      <p class="contact-subtitle">${cta.subtitle}</p>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-label">Email</div>
          <div class="contact-value"><a href="mailto:${t.email}">${t.email}</a></div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Teléfono</div>
          <div class="contact-value"><a href="tel:${t.phone}">${t.phone}</a></div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Web</div>
          <div class="contact-value"><a href="https://${t.website}" target="_blank">${t.website}</a></div>
        </div>
      </div>
      <div class="contact-logo">${NAVARRO_LOGO_SVG}</div>
    </div>
  </div>
</body>
</html>
`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { presentation_id } = await req.json();
    console.log('Generating presentation for ID:', presentation_id);

    // Fetch presentation data
    const { data: presentation, error: fetchError } = await supabase
      .from('generated_presentations')
      .select('*')
      .eq('id', presentation_id)
      .single();

    if (fetchError || !presentation) {
      console.error('Error fetching presentation:', fetchError);
      throw new Error('Presentation not found');
    }

    console.log('Presentation data:', JSON.stringify(presentation, null, 2));

    // Parse JSON fields if they're strings
    const parsedPresentation: GeneratedPresentation = {
      ...presentation,
      client_logo_url: presentation.client_logo_url || null,
      services_included: typeof presentation.services_included === 'string' 
        ? JSON.parse(presentation.services_included) 
        : presentation.services_included || [],
      team_members_included: typeof presentation.team_members_included === 'string'
        ? JSON.parse(presentation.team_members_included)
        : presentation.team_members_included || [],
      case_studies_included: typeof presentation.case_studies_included === 'string'
        ? JSON.parse(presentation.case_studies_included)
        : presentation.case_studies_included || [],
      differentiators: typeof presentation.differentiators === 'string'
        ? JSON.parse(presentation.differentiators)
        : presentation.differentiators || [],
      // Defaults para nuevos campos
      include_toc: presentation.include_toc ?? true,
      include_methodology: presentation.include_methodology ?? true,
      include_value_proposition: presentation.include_value_proposition ?? true,
      show_service_features: presentation.show_service_features ?? true,
      show_team_bio: presentation.show_team_bio ?? true,
      show_case_metrics: presentation.show_case_metrics ?? true,
      show_testimonials: presentation.show_testimonials ?? true,
      // Nuevos campos narrativos
      presentation_type: presentation.presentation_type || 'corporate',
      audience_type: presentation.audience_type || 'family_business',
      presentation_objective: presentation.presentation_objective || 'meet',
      quality_mode: presentation.quality_mode || 'professional',
      cover_tagline: presentation.cover_tagline || null,
      cta_type: presentation.cta_type || 'strategic_conversation',
    };

    // Generate HTML
    const htmlContent = generateHTML(parsedPresentation);
    console.log('HTML generated, length:', htmlContent.length);

    // Update presentation with HTML content
    const { error: updateError } = await supabase
      .from('generated_presentations')
      .update({
        html_content: htmlContent,
        status: 'generated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', presentation_id);

    if (updateError) {
      console.error('Error updating presentation:', updateError);
      throw updateError;
    }

    console.log('Presentation updated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Presentation generated successfully',
        presentation_id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-presentation-pdf:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
