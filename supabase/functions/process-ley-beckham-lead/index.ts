import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeyBeckhamContactData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country: string;
  jobSituation: string;
  estimatedMoveDate?: string;
  currentSalary?: number;
  message?: string;
  ipAddress?: string;
  userAgent?: string;
}

const calculateEligibilityScore = (data: LeyBeckhamContactData): number => {
  let score = 50; // Base score

  // Job situation scoring
  if (data.jobSituation === "contrato_espana") score += 25;
  else if (data.jobSituation === "oferta_empleo") score += 20;
  else if (data.jobSituation === "emprendedor") score += 15;
  else if (data.jobSituation === "autonomo") score += 10;

  // Salary scoring (if provided)
  if (data.currentSalary) {
    if (data.currentSalary >= 60000) score += 15;
    else if (data.currentSalary >= 40000) score += 10;
    else score += 5;
  }

  // Move date scoring (urgency)
  if (data.estimatedMoveDate) {
    const moveDate = new Date(data.estimatedMoveDate);
    const today = new Date();
    const daysUntilMove = Math.floor((moveDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilMove < 30) score += 10;
    else if (daysUntilMove < 90) score += 5;
  }

  return Math.min(100, Math.max(0, score));
};

const calculatePriority = (moveDate?: string): string => {
  if (!moveDate) return "media";
  
  const move = new Date(moveDate);
  const today = new Date();
  const daysUntilMove = Math.floor((move.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilMove < 30) return "urgente";
  if (daysUntilMove < 90) return "alta";
  if (daysUntilMove < 180) return "media";
  return "baja";
};

const sendConfirmationEmail = async (resendApiKey: string, data: LeyBeckhamContactData): Promise<boolean> => {
  try {
    const resend = new Resend(resendApiKey);
    
    const jobSituationText = {
      contrato_espana: "tienes un contrato de trabajo en España",
      oferta_empleo: "tienes una oferta de empleo",
      emprendedor: "planeas emprender en España",
      autonomo: "trabajas como autónomo",
      investigador: "eres investigador",
      otro: "tienes otra situación laboral"
    }[data.jobSituation] || "estás interesado en la Ley Beckham";

    await resend.emails.send({
      from: "NRRO Tax & Legal <info@nrro.es>",
      to: [data.email],
      subject: "Tu consulta sobre la Ley Beckham - NRRO",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .cta-button { display: inline-block; background: #e94560; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .checklist { background: white; padding: 20px; border-left: 4px solid #e94560; margin: 20px 0; }
            .checklist-item { padding: 8px 0; border-bottom: 1px solid #eee; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por tu interés en la Ley Beckham!</h1>
            </div>
            <div class="content">
              <p>Hola ${data.name},</p>
              
              <p>Hemos recibido tu consulta sobre el <strong>Régimen Especial de Impatriados (Ley Beckham)</strong>. Entendemos que ${jobSituationText} y queremos ayudarte a optimizar tu situación fiscal.</p>
              
              <h3>📋 Documentación recomendada</h3>
              <p>Para agilizar el proceso, te recomendamos ir preparando estos documentos:</p>
              
              <div class="checklist">
                <div class="checklist-item">✓ Pasaporte o DNI vigente</div>
                <div class="checklist-item">✓ Contrato de trabajo o carta de oferta</div>
                <div class="checklist-item">✓ Certificado de residencia fiscal del país de origen</div>
                <div class="checklist-item">✓ Certificado de antecedentes penales</div>
                <div class="checklist-item">✓ Título académico o certificado de experiencia profesional</div>
                <div class="checklist-item">✓ Documentación que acredite no haber sido residente fiscal en España en los últimos 10 años</div>
              </div>
              
              <h3>⏱️ Próximos pasos</h3>
              <p><strong>Nuestro equipo especializado te responderá en menos de 24 horas</strong> para:</p>
              <ul>
                <li>Confirmar tu elegibilidad para el régimen</li>
                <li>Explicarte los beneficios fiscales específicos para tu caso</li>
                <li>Establecer un plan de acción personalizado</li>
              </ul>
              
              <p>Si necesitas hablar con nosotros antes, puedes agendar una llamada directamente:</p>
              <a href="https://nrro.es/contacto" class="cta-button">Agendar Llamada</a>
              
              <p>También puedes consultar más información en nuestra página dedicada:</p>
              <a href="https://nrro.es/ley-beckham" style="color: #e94560;">Ver más sobre la Ley Beckham →</a>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="margin-top: 30px;"><strong>Contacto directo:</strong></p>
              <p>
                📧 <a href="mailto:info@nrro.es">info@nrro.es</a><br>
                📱 +34 912 345 678<br>
                🌐 <a href="https://nrro.es">nrro.es</a>
              </p>
              
              <p style="margin-top: 20px;">Un cordial saludo,<br><strong>Equipo NRRO Tax & Legal</strong></p>
            </div>
            <div class="footer">
              <p>Este correo es una confirmación automática. Por favor, no respondas a este email.</p>
              <p>&copy; ${new Date().getFullYear()} NRRO Tax & Legal. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
};

const sendInternalNotification = async (resendApiKey: string, data: LeyBeckhamContactData, leadId: string, eligibilityScore: number, priority: string): Promise<boolean> => {
  try {
    const resend = new Resend(resendApiKey);
    
    const priorityColors = {
      urgente: "#dc2626",
      alta: "#ea580c",
      media: "#ca8a04",
      baja: "#16a34a"
    };
    
    const priorityEmojis = {
      urgente: "🔴",
      alta: "🟠",
      media: "🟡",
      baja: "🟢"
    };

    await resend.emails.send({
      from: "NRRO Leads <info@nrro.es>",
      to: ["info@nrro.es"],
      subject: `${priorityEmojis[priority as keyof typeof priorityEmojis]} Nuevo Lead Ley Beckham - ${data.name} [Score: ${eligibilityScore}/100]`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .priority-banner { padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; color: white; font-weight: bold; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .info-card { background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #e94560; }
            .info-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
            .info-value { font-size: 16px; margin-top: 5px; }
            .score-bar { background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
            .score-fill { background: linear-gradient(90deg, #10b981, #3b82f6); height: 100%; display: flex; align-items: center; padding-left: 10px; color: white; font-size: 12px; font-weight: bold; }
            .action-buttons { margin: 20px 0; }
            .btn { display: inline-block; padding: 10px 20px; margin: 5px; background: #e94560; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="priority-banner" style="background-color: ${priorityColors[priority as keyof typeof priorityColors]};">
              PRIORIDAD ${priority.toUpperCase()} - Responder antes de 24h
            </div>
            
            <h2>🎯 Nuevo Lead: Ley Beckham</h2>
            
            <h3>Score de Elegibilidad</h3>
            <div class="score-bar">
              <div class="score-fill" style="width: ${eligibilityScore}%;">
                ${eligibilityScore}/100
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-card">
                <div class="info-label">👤 Nombre</div>
                <div class="info-value">${data.name}</div>
              </div>
              
              <div class="info-card">
                <div class="info-label">📧 Email</div>
                <div class="info-value">${data.email}</div>
              </div>
              
              ${data.phone ? `
              <div class="info-card">
                <div class="info-label">📱 Teléfono</div>
                <div class="info-value">${data.phone}</div>
              </div>
              ` : ''}
              
              ${data.company ? `
              <div class="info-card">
                <div class="info-label">🏢 Empresa</div>
                <div class="info-value">${data.company}</div>
              </div>
              ` : ''}
              
              <div class="info-card">
                <div class="info-label">🌍 País</div>
                <div class="info-value">${data.country}</div>
              </div>
              
              <div class="info-card">
                <div class="info-label">💼 Situación Laboral</div>
                <div class="info-value">${data.jobSituation}</div>
              </div>
              
              ${data.estimatedMoveDate ? `
              <div class="info-card">
                <div class="info-label">📅 Fecha Estimada Traslado</div>
                <div class="info-value">${new Date(data.estimatedMoveDate).toLocaleDateString('es-ES')}</div>
              </div>
              ` : ''}
              
              ${data.currentSalary ? `
              <div class="info-card">
                <div class="info-label">💰 Salario Actual</div>
                <div class="info-value">${data.currentSalary.toLocaleString('es-ES')} €</div>
              </div>
              ` : ''}
            </div>
            
            ${data.message ? `
            <div class="info-card" style="margin-top: 20px;">
              <div class="info-label">💬 Mensaje</div>
              <div class="info-value">${data.message}</div>
            </div>
            ` : ''}
            
            <div class="action-buttons">
              <a href="https://nrro.es/admin/ley-beckham-leads" class="btn">Ver en Dashboard</a>
              <a href="mailto:${data.email}" class="btn" style="background: #3b82f6;">Responder</a>
            </div>
            
            <hr style="margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666;">
              <strong>Metadatos:</strong><br>
              ID Lead: ${leadId}<br>
              IP: ${data.ipAddress || 'N/A'}<br>
              User Agent: ${data.userAgent || 'N/A'}<br>
              Fecha: ${new Date().toLocaleString('es-ES')}
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending internal notification:", error);
    return false;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const contactData: LeyBeckhamContactData = await req.json();

    // Extract IP address and user agent
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log('[LEY_BECKHAM] Processing lead:', { email: contactData.email });

    // Check rate limiting by email (5 requests per hour, fail-closed)
    const { data: emailRateLimitOk, error: emailRateLimitError } = await supabaseClient.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: contactData.email,
        p_category: 'ley_beckham_lead',
        p_max_requests: 5,
        p_window_minutes: 60,
      }
    );

    if (emailRateLimitError || emailRateLimitOk === false) {
      console.warn('[LEY_BECKHAM] Rate limit exceeded:', { email: contactData.email });
      
      await supabaseClient.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        table_name: 'ley_beckham_leads',
        operation: 'INSERT',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: {
          email: contactData.email,
          category: 'ley_beckham_lead',
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: 3600 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '3600',
          } 
        }
      );
    }

    // Check rate limiting by IP (10 requests per hour, fail-closed)
    const { data: ipRateLimitOk, error: ipRateLimitError } = await supabaseClient.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: ipAddress,
        p_category: 'ley_beckham_lead_ip',
        p_max_requests: 10,
        p_window_minutes: 60,
      }
    );

    if (ipRateLimitError || ipRateLimitOk === false) {
      console.warn('[LEY_BECKHAM] IP rate limit exceeded:', { ip: ipAddress });
      
      await supabaseClient.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        table_name: 'ley_beckham_leads',
        operation: 'INSERT',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: {
          ip: ipAddress,
          category: 'ley_beckham_lead_ip',
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: 3600 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '3600',
          } 
        }
      );
    }

    // Calculate eligibility score and priority
    const eligibilityScore = calculateEligibilityScore(contactData);
    const priority = calculatePriority(contactData.estimatedMoveDate);

    // Insert into ley_beckham_leads table
    const { data: lead, error: leadError } = await supabaseClient
      .from("ley_beckham_leads")
      .insert({
        name: contactData.name,
        email: contactData.email,
        company: contactData.company,
        phone: contactData.phone,
        country: contactData.country,
        job_situation: contactData.jobSituation,
        estimated_move_date: contactData.estimatedMoveDate,
        current_salary: contactData.currentSalary,
        message: contactData.message,
        status: "nuevo",
        priority,
        eligibility_score: eligibilityScore,
        ip_address: contactData.ipAddress,
        user_agent: contactData.userAgent,
      })
      .select()
      .single();

    if (leadError) {
      console.error("Error inserting lead:", leadError);
      throw leadError;
    }

    // Initialize document checklist
    const documents = [
      { document_type: "identificacion", document_name: "Pasaporte o DNI" },
      { document_type: "laboral", document_name: "Contrato de trabajo" },
      { document_type: "fiscal", document_name: "Certificado residencia fiscal" },
      { document_type: "legal", document_name: "Antecedentes penales" },
      { document_type: "academico", document_name: "Título académico" },
      { document_type: "fiscal", document_name: "Certificado no residencia España (10 años)" },
    ];

    await supabaseClient.from("lead_documents").insert(
      documents.map(doc => ({
        lead_id: lead.id,
        ...doc,
      }))
    );

    // Send emails
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      await Promise.all([
        sendConfirmationEmail(resendApiKey, contactData),
        sendInternalNotification(resendApiKey, contactData, lead.id, eligibilityScore, priority),
      ]);
    }

    console.log("Ley Beckham lead processed successfully:", lead.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadId: lead.id,
        eligibilityScore,
        priority 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in process-ley-beckham-lead:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
