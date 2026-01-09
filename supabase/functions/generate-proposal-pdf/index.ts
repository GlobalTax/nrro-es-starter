import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProposalData {
  proposal_number: string;
  client_name: string;
  client_company?: string;
  client_email?: string;
  services: Array<{
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    price_type: string;
  }>;
  total_amount: number;
  valid_until?: string;
  notes?: string;
}

// Generate HTML template for the proposal
function generateProposalHTML(data: ProposalData): string {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const validUntil = data.valid_until 
    ? new Date(data.valid_until).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  const priceTypeLabels: Record<string, string> = {
    fixed: 'Precio único',
    monthly: '/mes',
    annual: '/año'
  };

  const categoryLabels: Record<string, string> = {
    fiscal: 'Asesoramiento Fiscal',
    contabilidad: 'Contabilidad',
    laboral: 'Laboral',
    mercantil: 'Mercantil',
    ma: 'M&A',
    integral: 'Servicios Integrales'
  };

  // Group services by category
  const servicesByCategory = data.services.reduce((acc, service) => {
    const cat = service.category || 'otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {} as Record<string, typeof data.services>);

  const servicesHTML = Object.entries(servicesByCategory).map(([category, services]) => `
    <div class="service-category">
      <h3>${categoryLabels[category] || category}</h3>
      <table class="services-table">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Honorarios</th>
          </tr>
        </thead>
        <tbody>
          ${services.map(s => `
            <tr>
              <td>
                <strong>${s.name}</strong>
                ${s.description ? `<p class="service-desc">${s.description}</p>` : ''}
              </td>
              <td class="price">${s.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}${priceTypeLabels[s.price_type] || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Propuesta ${data.proposal_number}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 25mm 20mm;
      margin: 0 auto;
      background: white;
      position: relative;
    }
    
    /* Cover Page */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 247mm;
    }
    
    .cover-header {
      text-align: right;
    }
    
    .logo {
      font-size: 28pt;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: -1px;
    }
    
    .logo span {
      color: #666;
      font-weight: 300;
    }
    
    .cover-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .cover-title {
      font-size: 36pt;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 20mm;
      line-height: 1.2;
    }
    
    .cover-subtitle {
      font-size: 14pt;
      color: #666;
      margin-bottom: 10mm;
    }
    
    .cover-client {
      font-size: 18pt;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .cover-company {
      font-size: 14pt;
      color: #666;
      margin-top: 2mm;
    }
    
    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10mm;
      border-top: 1px solid #e0e0e0;
    }
    
    .cover-date {
      font-size: 10pt;
      color: #666;
    }
    
    .cover-number {
      font-size: 10pt;
      color: #666;
    }
    
    /* Content Pages */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8mm;
      border-bottom: 2px solid #1a1a1a;
      margin-bottom: 10mm;
    }
    
    .header-logo {
      font-size: 16pt;
      font-weight: 700;
    }
    
    .header-logo span {
      color: #666;
      font-weight: 300;
    }
    
    .header-number {
      font-size: 10pt;
      color: #666;
    }
    
    h2 {
      font-size: 18pt;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8mm;
      padding-bottom: 3mm;
      border-bottom: 1px solid #e0e0e0;
    }
    
    h3 {
      font-size: 13pt;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 5mm;
      margin-top: 8mm;
    }
    
    p {
      margin-bottom: 5mm;
    }
    
    .intro-text {
      font-size: 11pt;
      line-height: 1.7;
      color: #333;
      margin-bottom: 10mm;
    }
    
    /* Services Table */
    .service-category {
      margin-bottom: 8mm;
    }
    
    .services-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 5mm;
    }
    
    .services-table th {
      background: #f5f5f5;
      padding: 3mm 4mm;
      text-align: left;
      font-weight: 600;
      font-size: 10pt;
      border-bottom: 2px solid #1a1a1a;
    }
    
    .services-table th:last-child {
      text-align: right;
      width: 100px;
    }
    
    .services-table td {
      padding: 4mm;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: top;
    }
    
    .services-table td.price {
      text-align: right;
      font-weight: 600;
      white-space: nowrap;
    }
    
    .service-desc {
      font-size: 9pt;
      color: #666;
      margin-top: 2mm;
    }
    
    /* Total Box */
    .total-box {
      background: #1a1a1a;
      color: white;
      padding: 6mm 8mm;
      margin-top: 10mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .total-label {
      font-size: 12pt;
      font-weight: 600;
    }
    
    .total-amount {
      font-size: 18pt;
      font-weight: 700;
    }
    
    /* Notes */
    .notes-section {
      margin-top: 10mm;
      padding: 5mm;
      background: #f9f9f9;
      border-left: 3px solid #1a1a1a;
    }
    
    .notes-section h4 {
      font-size: 10pt;
      font-weight: 600;
      margin-bottom: 3mm;
    }
    
    .notes-section p {
      font-size: 10pt;
      color: #333;
      margin: 0;
    }
    
    /* Validity */
    .validity {
      margin-top: 10mm;
      padding: 4mm;
      background: #fff3cd;
      border: 1px solid #ffc107;
      font-size: 10pt;
    }
    
    /* Conditions */
    .conditions {
      margin-top: 10mm;
    }
    
    .conditions h3 {
      font-size: 12pt;
    }
    
    .conditions ul {
      list-style: none;
      padding-left: 0;
    }
    
    .conditions li {
      font-size: 10pt;
      color: #333;
      margin-bottom: 3mm;
      padding-left: 5mm;
      position: relative;
    }
    
    .conditions li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #1a1a1a;
    }
    
    /* Contact Section */
    .contact-section {
      margin-top: 15mm;
      padding-top: 8mm;
      border-top: 1px solid #e0e0e0;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10mm;
    }
    
    .contact-item h4 {
      font-size: 10pt;
      font-weight: 600;
      color: #666;
      margin-bottom: 2mm;
    }
    
    .contact-item p {
      font-size: 11pt;
      margin: 0;
    }
    
    /* Footer */
    .footer {
      position: absolute;
      bottom: 15mm;
      left: 20mm;
      right: 20mm;
      font-size: 8pt;
      color: #999;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      padding-top: 5mm;
    }
    
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="page cover">
    <div class="cover-header">
      <div class="logo">navarro <span>tax & legal</span></div>
    </div>
    
    <div class="cover-content">
      <div class="cover-subtitle">Propuesta de servicios profesionales</div>
      <h1 class="cover-title">Propuesta de<br/>Honorarios</h1>
      <div class="cover-client">${data.client_name}</div>
      ${data.client_company ? `<div class="cover-company">${data.client_company}</div>` : ''}
    </div>
    
    <div class="cover-footer">
      <div class="cover-date">${currentDate}</div>
      <div class="cover-number">${data.proposal_number}</div>
    </div>
  </div>
  
  <div class="page-break"></div>
  
  <!-- Services Page -->
  <div class="page">
    <div class="header">
      <div class="header-logo">navarro <span>tax & legal</span></div>
      <div class="header-number">${data.proposal_number}</div>
    </div>
    
    <h2>Servicios Propuestos</h2>
    
    <p class="intro-text">
      Estimado/a ${data.client_name},<br/><br/>
      Nos complace presentarle nuestra propuesta de servicios profesionales adaptada a las necesidades de 
      ${data.client_company || 'su empresa'}. A continuación, detallamos los servicios incluidos y sus correspondientes honorarios.
    </p>
    
    ${servicesHTML}
    
    <div class="total-box">
      <span class="total-label">Total Honorarios</span>
      <span class="total-amount">${data.total_amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
    </div>
    
    ${data.notes ? `
    <div class="notes-section">
      <h4>Observaciones</h4>
      <p>${data.notes}</p>
    </div>
    ` : ''}
    
    ${validUntil ? `
    <div class="validity">
      <strong>Validez de la propuesta:</strong> Esta propuesta es válida hasta el ${validUntil}.
    </div>
    ` : ''}
    
    <div class="conditions">
      <h3>Condiciones Generales</h3>
      <ul>
        <li>Los honorarios indicados no incluyen IVA (21%)</li>
        <li>Facturación mensual a mes vencido</li>
        <li>Pago mediante domiciliación bancaria</li>
        <li>Los servicios adicionales no incluidos se presupuestarán por separado</li>
        <li>Compromiso de confidencialidad sobre toda la información facilitada</li>
      </ul>
    </div>
    
    <div class="contact-section">
      <h3>Información de Contacto</h3>
      <div class="contact-grid">
        <div class="contact-item">
          <h4>Dirección</h4>
          <p>Passeig de Gràcia, 12<br/>08007 Barcelona</p>
        </div>
        <div class="contact-item">
          <h4>Contacto</h4>
          <p>info@navarro.legal<br/>+34 93 XXX XX XX</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      navarro tax & legal · Passeig de Gràcia, 12, 08007 Barcelona · CIF: XXXXXXXXX
    </div>
  </div>

</body>
</html>
  `;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { proposal_id } = await req.json();

    if (!proposal_id) {
      return new Response(
        JSON.stringify({ error: 'proposal_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch proposal data
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposal_id)
      .single();

    if (fetchError || !proposal) {
      console.error('Error fetching proposal:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Proposal not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate HTML
    const html = generateProposalHTML({
      proposal_number: proposal.proposal_number,
      client_name: proposal.client_name,
      client_company: proposal.client_company,
      client_email: proposal.client_email,
      services: proposal.services || [],
      total_amount: proposal.total_amount || 0,
      valid_until: proposal.valid_until,
      notes: proposal.notes
    });

    // Return HTML for now - PDF generation would require additional library
    // In production, you'd use a service like Puppeteer, wkhtmltopdf, or a PDF API
    return new Response(
      JSON.stringify({ 
        success: true, 
        html,
        message: 'HTML generated successfully. For PDF conversion, use browser print or a PDF service.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating proposal:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
