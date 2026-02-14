import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const careerApplicationSchema = z.object({
  nombre: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  telefono: z.string().trim().max(20, "Phone number too long").optional(),
  linkedin_url: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  puesto_solicitado: z.string().trim().min(2, "Position required").max(200, "Position too long"),
  departamento: z.enum(["Fiscal", "Laboral", "Contable", "Legal", "Administración", "Tecnología", "Otro"]).optional(),
  notas: z.string().trim().min(20, "Message must be at least 20 characters").max(1000, "Message too long"),
  cv_url: z.string().url("Invalid CV URL"),
  job_position_id: z.string().uuid().optional().nullable(),
});

// Send confirmation email to candidate
async function sendCandidateConfirmationEmail(
  resendApiKey: string,
  toEmail: string,
  name: string,
  position: string
): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'NRRO - Recursos Humanos <info@nrro.es>',
        to: [toEmail],
        subject: 'Hemos recibido tu candidatura - NRRO',
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
                .info-box { background: white; padding: 20px; border-left: 4px solid #e94560; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>¡Gracias por tu interés en unirte a NRRO!</h1>
                </div>
                <div class="content">
                  <p>Hola ${name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')},</p>

                  <p>Hemos recibido tu candidatura para el puesto de <strong>${position.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong>.</p>
                  
                  <div class="info-box">
                    <h3 style="margin-top: 0;">⏱️ Próximos pasos</h3>
                    <ul>
                      <li>Nuestro equipo de Recursos Humanos revisará tu perfil detalladamente</li>
                      <li>Si tu perfil encaja con lo que buscamos, te contactaremos en los próximos <strong>5-7 días laborables</strong></li>
                      <li>Te mantendremos informado sobre el estado de tu candidatura</li>
                    </ul>
                  </div>
                  
                  <p><strong>¿Por qué trabajar en NRRO?</strong></p>
                  <ul>
                    <li>🚀 Proyectos innovadores y retadores</li>
                    <li>👥 Equipo profesional y colaborativo</li>
                    <li>📚 Formación continua y desarrollo profesional</li>
                    <li>🏢 Excelente ambiente de trabajo</li>
                    <li>💼 Oportunidades de crecimiento</li>
                  </ul>
                  
                  <p style="margin-top: 30px;">Si tienes alguna pregunta, no dudes en contactarnos:</p>
                  <p>
                    📧 <a href="mailto:rrhh@nrro.es">rrhh@nrro.es</a><br>
                    📱 +34 93 459 36 00<br>
                    🌐 <a href="https://nrro.es/trabaja-con-nosotros">nrro.es/trabaja-con-nosotros</a>
                  </p>
                  
                  <p style="margin-top: 20px;">Un cordial saludo,<br><strong>Equipo de RRHH - NRRO</strong></p>
                </div>
                <div class="footer">
                  <p>Este correo es una confirmación automática. Por favor, no respondas a este email.</p>
                  <p>&copy; ${new Date().getFullYear()} NRRO Tax & Legal. Todos los derechos reservados.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[EMAIL] Resend API error:', errorData);
      return false;
    }

    console.log('[EMAIL] Candidate confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending candidate confirmation:', error);
    return false;
  }
}

// Send notification email to HR team
async function sendHRNotificationEmail(
  resendApiKey: string,
  candidateData: any
): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'NRRO Sistema <info@nrro.es>',
        to: ['rrhh@nrro.es', 'info@nrro.es'],
        subject: `Nueva candidatura: ${candidateData.nombre} - ${candidateData.puesto_solicitado}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 700px; margin: 0 auto; padding: 20px; }
                .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                .info-card { background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #e94560; }
                .info-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
                .info-value { font-size: 16px; margin-top: 5px; }
                .btn { display: inline-block; padding: 10px 20px; margin: 5px; background: #e94560; color: white; text-decoration: none; border-radius: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>🎯 Nueva Candidatura Recibida</h2>
                </div>
                
                <div style="background: #fff; padding: 20px; border-radius: 0 0 10px 10px;">
                  <div class="info-grid">
                    <div class="info-card">
                      <div class="info-label">👤 Nombre</div>
                      <div class="info-value">${(candidateData.nombre || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    </div>

                    <div class="info-card">
                      <div class="info-label">📧 Email</div>
                      <div class="info-value">${(candidateData.email || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    </div>

                    ${candidateData.telefono ? `
                    <div class="info-card">
                      <div class="info-label">📱 Teléfono</div>
                      <div class="info-value">${candidateData.telefono.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    </div>
                    ` : ''}
                    
                    ${candidateData.linkedin_url ? `
                    <div class="info-card">
                      <div class="info-label">🔗 LinkedIn</div>
                      <div class="info-value"><a href="${candidateData.linkedin_url}" target="_blank">Ver perfil</a></div>
                    </div>
                    ` : ''}
                    
                    <div class="info-card">
                      <div class="info-label">💼 Puesto Solicitado</div>
                      <div class="info-value">${(candidateData.puesto_solicitado || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    </div>
                    
                    ${candidateData.departamento ? `
                    <div class="info-card">
                      <div class="info-label">🏢 Departamento</div>
                      <div class="info-value">${candidateData.departamento}</div>
                    </div>
                    ` : ''}
                  </div>
                  
                  <div class="info-card" style="margin-top: 20px;">
                    <div class="info-label">💬 Mensaje Motivacional</div>
                    <div class="info-value" style="white-space: pre-wrap;">${(candidateData.notas || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                  </div>
                  
                  <div style="margin-top: 20px; text-align: center;">
                    <a href="${candidateData.cv_url}" class="btn" target="_blank">📄 Descargar CV</a>
                    <a href="https://nrro.es/admin/candidatos" class="btn" style="background: #3b82f6;">Ver en Dashboard</a>
                    <a href="mailto:${candidateData.email}" class="btn" style="background: #10b981;">Contactar Candidato</a>
                  </div>
                  
                  <hr style="margin: 30px 0;">
                  
                  <p style="font-size: 12px; color: #666;">
                    <strong>Metadatos:</strong><br>
                    ID Candidato: ${candidateData.id}<br>
                    Fuente: Web (formulario de carreras)<br>
                    IP: ${candidateData.ip_address || 'N/A'}<br>
                    Fecha: ${new Date().toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[EMAIL] Resend HR notification API error:', errorData);
      return false;
    }

    console.log('[EMAIL] HR notification email sent successfully');
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending HR notification:', error);
    return false;
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse and validate request body
    const body = await req.json();
    const validation = careerApplicationSchema.safeParse(body);

    if (!validation.success) {
      console.warn('[CAREER] Validation failed:', validation.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data',
          fields: validation.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const candidateData = validation.data;

    // Extract IP address and user agent
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log('[CAREER] Processing application:', { email: candidateData.email, position: candidateData.puesto_solicitado });

    // Check rate limiting by email (3 CVs per day, fail-closed)
    const { data: emailRateLimitOk, error: emailRateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: candidateData.email,
        p_category: 'career_application',
        p_max_requests: 3,
        p_window_minutes: 1440, // 24 hours
      }
    );

    if (emailRateLimitError || emailRateLimitOk === false) {
      console.warn('[CAREER] Rate limit exceeded:', { email: candidateData.email });
      
      await supabase.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        table_name: 'candidatos',
        operation: 'INSERT',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: {
          email: candidateData.email,
          category: 'career_application',
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({ 
          error: 'Has alcanzado el límite de candidaturas. Por favor, inténtalo mañana.',
          retryAfter: 86400 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '86400',
          } 
        }
      );
    }

    // Check rate limiting by IP (10 CVs per day, fail-closed)
    const { data: ipRateLimitOk, error: ipRateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: ipAddress,
        p_category: 'career_application_ip',
        p_max_requests: 10,
        p_window_minutes: 1440,
      }
    );

    if (ipRateLimitError || ipRateLimitOk === false) {
      console.warn('[CAREER] IP rate limit exceeded:', { ip: ipAddress });
      
      await supabase.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        table_name: 'candidatos',
        operation: 'INSERT',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: {
          ip: ipAddress,
          category: 'career_application_ip',
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({ 
          error: 'Demasiadas solicitudes desde tu ubicación. Por favor, inténtalo más tarde.',
          retryAfter: 86400 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '86400',
          } 
        }
      );
    }

    // Insert candidate into database
    const { data: candidate, error: insertError } = await supabase
      .from('candidatos')
      .insert({
        nombre: candidateData.nombre,
        email: candidateData.email,
        telefono: candidateData.telefono || null,
        linkedin_url: candidateData.linkedin_url || null,
        puesto_solicitado: candidateData.puesto_solicitado,
        departamento: candidateData.departamento || null,
        notas: candidateData.notas,
        cv_url: candidateData.cv_url,
        estado: 'nuevo',
        fuente: 'web',
        job_position_id: candidateData.job_position_id || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[CAREER] Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Error al guardar tu candidatura. Por favor, inténtalo de nuevo.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[CAREER] Candidate created successfully:', candidate.id);

    // Log security event
    await supabase.from('security_events').insert({
      event_type: 'CAREER_APPLICATION_SUBMISSION',
      severity: 'info',
      table_name: 'candidatos',
      operation: 'INSERT',
      ip_address: ipAddress,
      user_agent: userAgent,
      details: {
        candidate_id: candidate.id,
        email: candidateData.email,
        position: candidateData.puesto_solicitado,
        timestamp: new Date().toISOString(),
      },
    });

    // Send emails if Resend API key is configured
    if (resendApiKey) {
      console.log('[CAREER] Sending confirmation email to candidate...');
      await sendCandidateConfirmationEmail(
        resendApiKey,
        candidateData.email,
        candidateData.nombre,
        candidateData.puesto_solicitado
      );

      console.log('[CAREER] Sending notification email to HR...');
      await sendHRNotificationEmail(
        resendApiKey,
        {
          ...candidateData,
          id: candidate.id,
          ip_address: ipAddress,
        }
      );
    } else {
      console.warn('[CAREER] RESEND_API_KEY not configured, skipping emails');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Candidatura enviada con éxito',
        candidateId: candidate.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[CAREER] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Ha ocurrido un error. Por favor, inténtalo más tarde.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
