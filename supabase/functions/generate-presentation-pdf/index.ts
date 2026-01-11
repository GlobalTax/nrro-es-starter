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
}

interface TeamMemberSummary {
  id: string;
  name: string;
  position: string;
  specialization?: string;
  avatar_url?: string;
}

interface CaseStudySummary {
  id: string;
  title: string;
  client_name: string;
  client_industry: string;
  results_summary: string;
}

interface GeneratedPresentation {
  id: string;
  client_name: string;
  client_company: string | null;
  sector: string | null;
  language: string;
  format: string;
  services_included: ServiceSummary[];
  team_members_included: TeamMemberSummary[];
  case_studies_included: CaseStudySummary[];
  include_stats: boolean;
  custom_intro: string | null;
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

// Traducciones con contenido real de navarro
const TRANSLATIONS = {
  es: {
    title: 'Presentación Corporativa',
    preparedFor: 'Preparado para',
    services: 'Servicios',
    team: 'Equipo',
    caseStudies: 'Casos de Éxito',
    aboutUs: 'Sobre Navarro',
    aboutText: 'En navarro ofrecemos asesoramiento legal, fiscal y estratégico especializado en empresas familiares y estructuras empresariales consolidadas. Acompañamos a nuestros clientes en cada etapa de su crecimiento.',
    contact: 'Contacto',
    phone: '+34 934 593 600',
    email: 'info@nrro.es',
    address: 'Barcelona',
    website: 'nrro.es',
    stats: {
      years: '15',
      yearsLabel: 'años de experiencia',
      clients: '300',
      clientsLabel: 'clientes asesorados',
      team: '70+',
      teamLabel: 'profesionales',
    },
    serviceAreas: {
      fiscal: 'Asesoramiento Fiscal',
      legal: 'Asesoramiento Legal',
      mercantil: 'Mercantil y Societario',
      laboral: 'Laboral',
      contable: 'Contabilidad',
      ma: 'M&A y Operaciones',
    },
    ctaText: '¿Hablamos?',
    ctaSubtext: 'Estamos a tu disposición para resolver cualquier consulta',
  },
  en: {
    title: 'Corporate Presentation',
    preparedFor: 'Prepared for',
    services: 'Services',
    team: 'Team',
    caseStudies: 'Success Stories',
    aboutUs: 'About Navarro',
    aboutText: 'At navarro we provide specialized legal, tax and strategic advisory services for family businesses and consolidated corporate structures. We accompany our clients at every stage of their growth.',
    contact: 'Contact',
    phone: '+34 934 593 600',
    email: 'info@nrro.es',
    address: 'Barcelona',
    website: 'nrro.es',
    stats: {
      years: '15',
      yearsLabel: 'years of experience',
      clients: '300',
      clientsLabel: 'clients advised',
      team: '70+',
      teamLabel: 'professionals',
    },
    serviceAreas: {
      fiscal: 'Tax Advisory',
      legal: 'Legal Advisory',
      mercantil: 'Corporate & Commercial',
      laboral: 'Employment Law',
      contable: 'Accounting',
      ma: 'M&A and Transactions',
    },
    ctaText: 'Let\'s talk',
    ctaSubtext: 'We are at your disposal to answer any questions',
  },
  ca: {
    title: 'Presentació Corporativa',
    preparedFor: 'Preparat per a',
    services: 'Serveis',
    team: 'Equip',
    caseStudies: 'Casos d\'Èxit',
    aboutUs: 'Sobre Navarro',
    aboutText: 'A navarro oferim assessorament legal, fiscal i estratègic especialitzat en empreses familiars i estructures empresarials consolidades. Acompanyem els nostres clients en cada etapa del seu creixement.',
    contact: 'Contacte',
    phone: '+34 934 593 600',
    email: 'info@nrro.es',
    address: 'Barcelona',
    website: 'nrro.es',
    stats: {
      years: '15',
      yearsLabel: 'anys d\'experiència',
      clients: '300',
      clientsLabel: 'clients assessorats',
      team: '70+',
      teamLabel: 'professionals',
    },
    serviceAreas: {
      fiscal: 'Assessorament Fiscal',
      legal: 'Assessorament Legal',
      mercantil: 'Mercantil i Societari',
      laboral: 'Laboral',
      contable: 'Comptabilitat',
      ma: 'M&A i Operacions',
    },
    ctaText: 'Parlem?',
    ctaSubtext: 'Estem a la teva disposició per resoldre qualsevol consulta',
  },
};

function generateHTML(presentation: GeneratedPresentation): string {
  const t = TRANSLATIONS[presentation.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.es;
  const isHorizontal = presentation.format === 'horizontal';
  
  const pageWidth = isHorizontal ? '1920px' : '210mm';
  const pageHeight = isHorizontal ? '1080px' : '297mm';
  
  // Services will be paginated automatically in the HTML generation

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
      /* Colores corporativos de navarro */
      --black: #000000;
      --accent: hsl(172, 60%, 15%); /* Verde oscuro #133D34 */
      --accent-light: hsl(172, 40%, 25%);
      --foreground: hsl(190, 63%, 6%); /* #0C1E21 */
      --muted: hsl(195, 3%, 62%); /* #9A9FA0 */
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
      padding: ${isHorizontal ? '80px 100px' : '50px 40px'};
      page-break-after: always;
      page-break-inside: avoid;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    /* ========== PORTADA ========== */
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
      margin-bottom: ${isHorizontal ? '60px' : '40px'};
    }
    
    .cover h1 {
      font-size: ${isHorizontal ? '72px' : '48px'};
      font-weight: 400;
      margin-bottom: 24px;
      letter-spacing: -0.03em;
    }
    
    .cover .prepared-for {
      font-size: ${isHorizontal ? '18px' : '14px'};
      text-transform: uppercase;
      letter-spacing: 0.2em;
      opacity: 0.6;
      margin-bottom: 12px;
    }
    
    .cover .client-name {
      font-size: ${isHorizontal ? '36px' : '28px'};
      font-weight: 500;
      color: var(--white);
      margin-bottom: 8px;
    }
    
    .cover .client-company {
      font-size: ${isHorizontal ? '24px' : '18px'};
      opacity: 0.7;
    }
    
    .cover .date {
      position: absolute;
      bottom: 60px;
      font-size: 14px;
      opacity: 0.5;
      letter-spacing: 0.1em;
    }
    
    /* ========== CABECERA DE PÁGINA ========== */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${isHorizontal ? '60px' : '40px'};
      padding-bottom: 24px;
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .page-header .logo-small {
      opacity: 0.8;
    }
    
    .page-number {
      font-size: 12px;
      color: var(--muted);
      letter-spacing: 0.1em;
    }
    
    /* ========== TÍTULOS DE SECCIÓN ========== */
    .section-title {
      font-size: ${isHorizontal ? '48px' : '28px'};
      font-weight: 400;
      color: var(--foreground);
      margin-bottom: ${isHorizontal ? '48px' : '24px'};
      position: relative;
    }
    
    .section-title::after {
      content: '';
      display: block;
      width: 50px;
      height: 3px;
      background: var(--accent);
      margin-top: 12px;
    }
    
    /* ========== SOBRE NOSOTROS ========== */
    .about-content {
      display: grid;
      grid-template-columns: ${isHorizontal ? '1fr 1fr' : '1fr'};
      gap: ${isHorizontal ? '80px' : '40px'};
      align-items: start;
    }
    
    .about-text {
      font-size: ${isHorizontal ? '22px' : '18px'};
      line-height: 1.8;
      color: var(--foreground);
    }
    
    .about-text .custom-intro {
      margin-top: 32px;
      padding: 24px 28px;
      background: var(--neutral-50);
      border-left: 3px solid var(--accent);
      font-style: italic;
      color: var(--neutral-800);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${isHorizontal ? '32px' : '12px'};
      width: 100%;
      max-width: 100%;
    }
    
    .stat-item {
      text-align: center;
      padding: ${isHorizontal ? '40px 24px' : '20px 10px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
    }
    
    .stat-value {
      font-family: 'General Sans', sans-serif;
      font-size: ${isHorizontal ? '56px' : '32px'};
      font-weight: 500;
      color: var(--accent);
      line-height: 1;
    }
    
    .stat-label {
      font-size: ${isHorizontal ? '14px' : '10px'};
      color: var(--muted);
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* ========== SERVICIOS ========== */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: ${isHorizontal ? '24px' : '12px'};
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
      margin-bottom: 6px;
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
      font-size: ${isHorizontal ? '13px' : '11px'};
      color: var(--muted);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    /* ========== EQUIPO ========== */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(${isHorizontal ? '4' : '2'}, 1fr);
      gap: ${isHorizontal ? '32px' : '24px'};
    }
    
    .team-card {
      text-align: center;
      padding: ${isHorizontal ? '32px 24px' : '24px 16px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
    }
    
    .team-avatar {
      width: ${isHorizontal ? '100px' : '80px'};
      height: ${isHorizontal ? '100px' : '80px'};
      border-radius: 50%;
      background: var(--accent);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${isHorizontal ? '36px' : '28px'};
      font-weight: 500;
      margin: 0 auto 20px;
      font-family: 'General Sans', sans-serif;
    }
    
    .team-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .team-name {
      font-size: ${isHorizontal ? '18px' : '16px'};
      font-weight: 500;
      color: var(--foreground);
    }
    
    .team-position {
      font-size: ${isHorizontal ? '14px' : '12px'};
      color: var(--muted);
      margin-top: 4px;
    }
    
    .team-specialization {
      font-size: ${isHorizontal ? '12px' : '11px'};
      color: var(--accent);
      margin-top: 8px;
      font-weight: 500;
    }
    
    /* ========== CASOS DE ÉXITO ========== */
    .case-study-card {
      padding: ${isHorizontal ? '32px' : '24px'};
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      margin-bottom: 24px;
    }
    
    .case-study-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 16px;
    }
    
    .case-study-title {
      font-size: ${isHorizontal ? '22px' : '18px'};
      font-weight: 500;
      color: var(--foreground);
    }
    
    .case-study-client {
      font-size: 14px;
      color: var(--muted);
      margin-top: 4px;
    }
    
    .case-study-industry {
      font-size: 12px;
      padding: 6px 14px;
      background: var(--accent);
      color: var(--white);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .case-study-results {
      font-size: ${isHorizontal ? '16px' : '14px'};
      color: var(--neutral-800);
      line-height: 1.7;
    }
    
    /* ========== CONTACTO ========== */
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
      font-size: ${isHorizontal ? '64px' : '42px'};
      font-weight: 400;
      margin-bottom: 16px;
    }
    
    .contact-subtitle {
      font-size: ${isHorizontal ? '20px' : '16px'};
      opacity: 0.7;
      margin-bottom: 60px;
      max-width: 500px;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${isHorizontal ? '80px' : '40px'};
      margin-bottom: 60px;
    }
    
    .contact-item {
      text-align: center;
    }
    
    .contact-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      opacity: 0.5;
      margin-bottom: 8px;
    }
    
    .contact-value {
      font-size: ${isHorizontal ? '22px' : '18px'};
      font-weight: 500;
    }
    
    .contact-value a {
      color: var(--white);
      text-decoration: none;
    }
    
    .contact-logo {
      margin-top: 40px;
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
        padding: ${isHorizontal ? '80px 100px' : '50px 40px'} !important;
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
      
      .stats-grid {
        width: 100% !important;
        max-width: 100% !important;
      }
      
      .stat-item {
        background: var(--neutral-50) !important;
      }
      
      .service-card, .team-card, .case-study-card {
        background: var(--neutral-50) !important;
        border: 1px solid var(--neutral-200) !important;
      }
    }
  </style>
</head>
<body>
  <!-- PORTADA -->
  <div class="page cover">
    <div class="cover-content">
      <div class="logo">${NAVARRO_LOGO_SVG}</div>
      <p class="prepared-for">${t.preparedFor}</p>
      <p class="client-name">${presentation.client_name}</p>
      ${presentation.client_company ? `<p class="client-company">${presentation.client_company}</p>` : ''}
    </div>
    <p class="date">${new Date().toLocaleDateString(presentation.language === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long' })}</p>
  </div>
  
  <!-- SOBRE NAVARRO -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">01</span>
    </div>
    <h2 class="section-title">${t.aboutUs}</h2>
    <div class="about-content">
      <div class="about-text">
        <p>${t.aboutText}</p>
        ${presentation.custom_intro ? `<div class="custom-intro"><p>${presentation.custom_intro}</p></div>` : ''}
      </div>
      ${presentation.include_stats ? `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${t.stats.years}</div>
          <div class="stat-label">${t.stats.yearsLabel}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${t.stats.clients}</div>
          <div class="stat-label">${t.stats.clientsLabel}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${t.stats.team}</div>
          <div class="stat-label">${t.stats.teamLabel}</div>
        </div>
      </div>
      ` : ''}
    </div>
  </div>
  
  <!-- SERVICIOS (paginados automáticamente, máx 4 por página) -->
  ${(() => {
    const allServices = presentation.services_included;
    const SERVICES_PER_PAGE = 4;
    const servicePages: ServiceSummary[][] = [];
    
    for (let i = 0; i < allServices.length; i += SERVICES_PER_PAGE) {
      servicePages.push(allServices.slice(i, i + SERVICES_PER_PAGE));
    }
    
    return servicePages.map((pageServices, pageIndex) => `
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${String(pageIndex + 2).padStart(2, '0')}</span>
    </div>
    <h2 class="section-title">${t.services}${servicePages.length > 1 ? ` (${pageIndex + 1}/${servicePages.length})` : ''}</h2>
    <div class="services-grid">
      ${pageServices.map(service => `
        <div class="service-card">
          <div class="service-area-tag">${service.area || 'Servicios'}</div>
          <h4>${service.name}</h4>
          <p>${service.description}</p>
        </div>
      `).join('')}
    </div>
  </div>
    `).join('');
  })()}
  
  ${presentation.team_members_included.length > 0 ? `
  <!-- EQUIPO -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${String(Math.ceil(presentation.services_included.length / 4) + 2).padStart(2, '0')}</span>
    </div>
    <h2 class="section-title">${t.team}</h2>
    <div class="team-grid">
      ${presentation.team_members_included.map(member => `
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
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  
  ${presentation.case_studies_included.length > 0 ? `
  <!-- CASOS DE ÉXITO -->
  <div class="page">
    <div class="page-header">
      <div class="logo-small">${NAVARRO_LOGO_BLACK_SVG}</div>
      <span class="page-number">${String(Math.ceil(presentation.services_included.length / 4) + (presentation.team_members_included.length > 0 ? 3 : 2)).padStart(2, '0')}</span>
    </div>
    <h2 class="section-title">${t.caseStudies}</h2>
    ${presentation.case_studies_included.map(cs => `
      <div class="case-study-card">
        <div class="case-study-header">
          <div>
            <div class="case-study-title">${cs.title}</div>
            <div class="case-study-client">${cs.client_name}</div>
          </div>
          <span class="case-study-industry">${cs.client_industry}</span>
        </div>
        <p class="case-study-results">${cs.results_summary}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <!-- CONTACTO -->
  <div class="page contact-page">
    <div class="contact-content">
      <h2 class="contact-title">${t.ctaText}</h2>
      <p class="contact-subtitle">${t.ctaSubtext}</p>
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
      services_included: typeof presentation.services_included === 'string' 
        ? JSON.parse(presentation.services_included) 
        : presentation.services_included || [],
      team_members_included: typeof presentation.team_members_included === 'string'
        ? JSON.parse(presentation.team_members_included)
        : presentation.team_members_included || [],
      case_studies_included: typeof presentation.case_studies_included === 'string'
        ? JSON.parse(presentation.case_studies_included)
        : presentation.case_studies_included || [],
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
