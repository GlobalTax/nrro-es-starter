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

const TRANSLATIONS = {
  es: {
    title: 'Presentación Corporativa',
    services: 'Nuestros Servicios',
    team: 'Equipo',
    caseStudies: 'Casos de Éxito',
    aboutUs: 'Sobre Navarro',
    aboutText: 'Somos un despacho de asesoría fiscal, legal y contable con más de 30 años de experiencia ayudando a empresas y familias empresarias a alcanzar sus objetivos.',
    contact: 'Contacto',
    phone: '+34 934 872 000',
    email: 'info@navarro.es',
    address: 'Passeig de Gràcia 55, 08007 Barcelona',
    stats: {
      years: '30+ años',
      yearsLabel: 'de experiencia',
      clients: '500+',
      clientsLabel: 'clientes activos',
      team: '50+',
      teamLabel: 'profesionales',
    },
  },
  en: {
    title: 'Corporate Presentation',
    services: 'Our Services',
    team: 'Team',
    caseStudies: 'Success Stories',
    aboutUs: 'About Navarro',
    aboutText: 'We are a tax, legal and accounting advisory firm with over 30 years of experience helping businesses and family enterprises achieve their goals.',
    contact: 'Contact',
    phone: '+34 934 872 000',
    email: 'info@navarro.es',
    address: 'Passeig de Gràcia 55, 08007 Barcelona',
    stats: {
      years: '30+ years',
      yearsLabel: 'of experience',
      clients: '500+',
      clientsLabel: 'active clients',
      team: '50+',
      teamLabel: 'professionals',
    },
  },
  ca: {
    title: 'Presentació Corporativa',
    services: 'Els Nostres Serveis',
    team: 'Equip',
    caseStudies: 'Casos d\'Èxit',
    aboutUs: 'Sobre Navarro',
    aboutText: 'Som un despatx d\'assessoria fiscal, legal i comptable amb més de 30 anys d\'experiència ajudant a empreses i famílies empresàries a assolir els seus objectius.',
    contact: 'Contacte',
    phone: '+34 934 872 000',
    email: 'info@navarro.es',
    address: 'Passeig de Gràcia 55, 08007 Barcelona',
    stats: {
      years: '30+ anys',
      yearsLabel: 'd\'experiència',
      clients: '500+',
      clientsLabel: 'clients actius',
      team: '50+',
      teamLabel: 'professionals',
    },
  },
};

function generateHTML(presentation: GeneratedPresentation): string {
  const t = TRANSLATIONS[presentation.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.es;
  const isHorizontal = presentation.format === 'horizontal';
  
  const pageWidth = isHorizontal ? '1920px' : '210mm';
  const pageHeight = isHorizontal ? '1080px' : '297mm';
  
  // Group services by area
  const servicesByArea: Record<string, ServiceSummary[]> = {};
  presentation.services_included.forEach((service) => {
    const area = service.area || 'Otros';
    if (!servicesByArea[area]) servicesByArea[area] = [];
    servicesByArea[area].push(service);
  });

  return `
<!DOCTYPE html>
<html lang="${presentation.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - ${presentation.client_name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    
    .page {
      width: ${pageWidth};
      min-height: ${pageHeight};
      background: white;
      margin: 0 auto;
      padding: ${isHorizontal ? '60px 80px' : '40px 50px'};
      page-break-after: always;
      position: relative;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    /* Cover page */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      color: white;
    }
    
    .cover .logo {
      font-size: ${isHorizontal ? '48px' : '36px'};
      font-weight: 700;
      letter-spacing: -1px;
      margin-bottom: 20px;
    }
    
    .cover .logo span {
      color: #60a5fa;
    }
    
    .cover h1 {
      font-size: ${isHorizontal ? '64px' : '42px'};
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .cover .client-name {
      font-size: ${isHorizontal ? '32px' : '24px'};
      opacity: 0.9;
      margin-bottom: 8px;
    }
    
    .cover .client-company {
      font-size: ${isHorizontal ? '24px' : '18px'};
      opacity: 0.7;
    }
    
    .cover .date {
      position: absolute;
      bottom: 40px;
      font-size: 14px;
      opacity: 0.6;
    }
    
    /* Section headers */
    .section-header {
      font-size: ${isHorizontal ? '42px' : '28px'};
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 40px;
      padding-bottom: 16px;
      border-bottom: 4px solid #60a5fa;
    }
    
    /* About section */
    .about-content {
      display: flex;
      gap: 60px;
      align-items: center;
    }
    
    .about-text {
      flex: 1;
      font-size: ${isHorizontal ? '20px' : '16px'};
      line-height: 1.8;
    }
    
    .about-text .custom-intro {
      margin-top: 24px;
      padding: 20px;
      background: #f1f5f9;
      border-radius: 12px;
      border-left: 4px solid #60a5fa;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 40px;
    }
    
    .stat-item {
      text-align: center;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
    }
    
    .stat-value {
      font-size: ${isHorizontal ? '48px' : '32px'};
      font-weight: 700;
      color: #0f172a;
    }
    
    .stat-label {
      font-size: 14px;
      color: #64748b;
      margin-top: 4px;
    }
    
    /* Services section */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(${isHorizontal ? '2' : '1'}, 1fr);
      gap: 24px;
    }
    
    .service-area {
      margin-bottom: 32px;
    }
    
    .service-area h3 {
      font-size: ${isHorizontal ? '24px' : '18px'};
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 16px;
      padding: 8px 16px;
      background: #f1f5f9;
      border-radius: 8px;
      display: inline-block;
    }
    
    .service-card {
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 12px;
    }
    
    .service-card h4 {
      font-size: ${isHorizontal ? '18px' : '16px'};
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
    }
    
    .service-card p {
      font-size: ${isHorizontal ? '14px' : '12px'};
      color: #64748b;
      line-height: 1.6;
    }
    
    /* Team section */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(${isHorizontal ? '4' : '2'}, 1fr);
      gap: 24px;
    }
    
    .team-card {
      text-align: center;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
    }
    
    .team-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #60a5fa;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 600;
      margin: 0 auto 16px;
    }
    
    .team-name {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
    }
    
    .team-position {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    
    /* Case studies section */
    .case-study-card {
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    
    .case-study-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }
    
    .case-study-title {
      font-size: ${isHorizontal ? '20px' : '16px'};
      font-weight: 600;
      color: #0f172a;
    }
    
    .case-study-client {
      font-size: 13px;
      color: #64748b;
    }
    
    .case-study-industry {
      font-size: 12px;
      padding: 4px 12px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 20px;
    }
    
    .case-study-results {
      font-size: 14px;
      color: #475569;
      line-height: 1.7;
    }
    
    /* Contact page */
    .contact-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      color: white;
    }
    
    .contact-title {
      font-size: ${isHorizontal ? '48px' : '32px'};
      font-weight: 700;
      margin-bottom: 40px;
    }
    
    .contact-info {
      font-size: ${isHorizontal ? '24px' : '18px'};
      margin-bottom: 16px;
      opacity: 0.9;
    }
    
    .contact-info a {
      color: #60a5fa;
      text-decoration: none;
    }
    
    @media print {
      .page {
        margin: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="page cover">
    <div class="logo">navarro<span>.</span></div>
    <h1>${t.title}</h1>
    <p class="client-name">${presentation.client_name}</p>
    ${presentation.client_company ? `<p class="client-company">${presentation.client_company}</p>` : ''}
    <p class="date">${new Date().toLocaleDateString(presentation.language === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long' })}</p>
  </div>
  
  <!-- About Page -->
  <div class="page">
    <h2 class="section-header">${t.aboutUs}</h2>
    <div class="about-content">
      <div class="about-text">
        <p>${t.aboutText}</p>
        ${presentation.custom_intro ? `<div class="custom-intro"><p>${presentation.custom_intro}</p></div>` : ''}
      </div>
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
  
  <!-- Services Page -->
  <div class="page">
    <h2 class="section-header">${t.services}</h2>
    <div class="services-grid">
      ${Object.entries(servicesByArea).map(([area, services]) => `
        <div class="service-area">
          <h3>${area}</h3>
          ${services.map(service => `
            <div class="service-card">
              <h4>${service.name}</h4>
              <p>${service.description}</p>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  </div>
  
  ${presentation.team_members_included.length > 0 ? `
  <!-- Team Page -->
  <div class="page">
    <h2 class="section-header">${t.team}</h2>
    <div class="team-grid">
      ${presentation.team_members_included.map(member => `
        <div class="team-card">
          <div class="team-avatar">${member.name.charAt(0)}</div>
          <div class="team-name">${member.name}</div>
          <div class="team-position">${member.position}</div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  
  ${presentation.case_studies_included.length > 0 ? `
  <!-- Case Studies Page -->
  <div class="page">
    <h2 class="section-header">${t.caseStudies}</h2>
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
  
  <!-- Contact Page -->
  <div class="page contact-page">
    <h2 class="contact-title">${t.contact}</h2>
    <p class="contact-info">${t.phone}</p>
    <p class="contact-info"><a href="mailto:${t.email}">${t.email}</a></p>
    <p class="contact-info">${t.address}</p>
    <div class="logo" style="margin-top: 60px;">navarro<span>.</span></div>
  </div>
</body>
</html>
  `;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { presentation_id } = await req.json();

    if (!presentation_id) {
      return new Response(
        JSON.stringify({ error: 'presentation_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating PDF for presentation:', presentation_id);

    // Fetch presentation data
    const { data: presentation, error: fetchError } = await supabase
      .from('generated_presentations')
      .select('*')
      .eq('id', presentation_id)
      .single();

    if (fetchError || !presentation) {
      console.error('Error fetching presentation:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Presentation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse JSON fields
    const presentationData: GeneratedPresentation = {
      ...presentation,
      services_included: Array.isArray(presentation.services_included) 
        ? presentation.services_included 
        : JSON.parse(presentation.services_included || '[]'),
      team_members_included: Array.isArray(presentation.team_members_included)
        ? presentation.team_members_included
        : JSON.parse(presentation.team_members_included || '[]'),
      case_studies_included: Array.isArray(presentation.case_studies_included)
        ? presentation.case_studies_included
        : JSON.parse(presentation.case_studies_included || '[]'),
    };

    // Generate HTML
    const html = generateHTML(presentationData);

    // Save HTML content directly to database instead of storage
    const { error: updateError } = await supabase
      .from('generated_presentations')
      .update({ 
        html_content: html,
        status: 'generated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', presentation_id);

    if (updateError) {
      console.error('Error updating presentation:', updateError);
      throw updateError;
    }

    console.log('Presentation generated successfully, ID:', presentation_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        presentation_id: presentation_id,
        message: 'Presentation generated successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-presentation-pdf:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
