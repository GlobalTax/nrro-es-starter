import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  company: z.string().trim().max(100, "Company name too long").optional().default(""),
  phone: z.string().trim().max(20, "Phone number too long").optional().default(""),
  subject: z.string().trim().min(1, "Subject is required").max(100, "Subject too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message too long"),
});

// Send confirmation email using Resend
async function sendConfirmationEmail(
  resendApiKey: string,
  toEmail: string,
  name: string
): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'NRRO - Navarro Tax Legal <info@nrro.es>',
        to: [toEmail],
        subject: 'Hemos recibido tu mensaje - NRRO',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #1a1a1a; margin-bottom: 20px;">Gracias por contactarnos, ${name}</h1>
                <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
                <p>Nuestro equipo revisará tu consulta y te responderemos en un plazo máximo de 24-48 horas laborables.</p>
                <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                  <p style="margin: 0;"><strong>Información de contacto:</strong></p>
                  <p style="margin: 10px 0 0 0;">📞 Teléfono: +34 93 459 36 00</p>
                  <p style="margin: 5px 0 0 0;">📧 Email: info@nrro.es</p>
                  <p style="margin: 5px 0 0 0;">📍 Carrer Ausias March, 36, 08010 Barcelona</p>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Saludos cordiales,<br>
                  <strong>Equipo NRRO - Navarro Tax Legal</strong>
                </p>
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

    console.log('[EMAIL] Confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending confirmation:', error);
    return false;
  }
}

// Send notification email to team
async function sendNotificationEmail(
  resendApiKey: string,
  contactData: any
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
        to: ['info@nrro.es'],
        subject: `Nuevo contacto: ${contactData.name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #1a1a1a; margin-bottom: 20px;">Nuevo mensaje de contacto</h1>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p><strong>Nombre:</strong> ${contactData.name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
                  ${contactData.company ? `<p><strong>Empresa:</strong> ${contactData.company}</p>` : ''}
                  ${contactData.phone ? `<p><strong>Teléfono:</strong> ${contactData.phone}</p>` : ''}
                  <p><strong>Asunto:</strong> ${contactData.subject}</p>
                  <p><strong>Tipo de servicio:</strong> ${contactData.service_type}</p>
                </div>
                <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Mensaje:</h3>
                  <p style="white-space: pre-wrap;">${contactData.message}</p>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  <strong>IP:</strong> ${contactData.ip_address || 'No disponible'}<br>
                  <strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[EMAIL] Resend notification API error:', errorData);
      return false;
    }

    console.log('[EMAIL] Notification email sent successfully');
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending notification:', error);
    return false;
  }
}

// Map form subjects to database service_type_enum
function mapSubjectToServiceType(subject: string): "empresa_familiar" | "tax_advisory" | "legal_advisory" | "financial_planning" | "other" {
  const mapping: Record<string, "empresa_familiar" | "tax_advisory" | "legal_advisory" | "financial_planning" | "other"> = {
    'family_business': 'empresa_familiar',
    'tax': 'tax_advisory',
    'legal': 'legal_advisory',
    'financial': 'financial_planning',
    'investment': 'financial_planning',
    'partnership': 'other',
    'press': 'other',
    'careers': 'other',
    'other': 'other',
  };
  return mapping[subject] || 'other';
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
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      console.warn('[CONTACT] Validation failed:', validation.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data',
          fields: validation.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, company, phone, subject, message } = validation.data;

    // Extract IP address and user agent
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log('[CONTACT] Processing submission:', { email, company, subject });

    // Check rate limiting by email (10 requests per hour, fail-closed)
    const { data: emailRateLimitOk, error: emailRateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: email,
        p_category: 'contact_form',
        p_max_requests: 10,
        p_window_minutes: 60,
      }
    );

    // SECURITY: Fail-closed - block if error OR exceeded
    if (emailRateLimitError || emailRateLimitOk === false) {
      console.warn('[CONTACT] Rate limit check failed or exceeded:', { email, error: emailRateLimitError });
      
      await supabase.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        table_name: 'contact_leads',
        operation: 'INSERT',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: {
          email,
          category: 'contact_form_email',
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({ 
          error: 'Too many submissions. Please try again later.',
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

    // Check rate limiting by IP (20 requests per hour, fail-closed)
    const { data: ipRateLimitOk, error: ipRateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: ipAddress,
        p_category: 'contact_form_ip',
        p_max_requests: 20,
        p_window_minutes: 60,
      }
    );

    // SECURITY: Fail-closed - block if error OR exceeded
    if (ipRateLimitError || ipRateLimitOk === false) {
      console.warn('[CONTACT] Rate limit check failed or exceeded:', { ip: ipAddress, error: ipRateLimitError });
      
      await supabase.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        table_name: 'contact_leads',
        operation: 'INSERT',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: {
          ip: ipAddress,
          category: 'contact_form_ip',
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({ 
          error: 'Too many submissions. Please try again later.',
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

    // Map subject to service_type
    const serviceType = mapSubjectToServiceType(subject);

    // Insert into contact_leads table
    const { data: contactLead, error: insertError } = await supabase
      .from('contact_leads')
      .insert({
        name: name,
        email: email,
        company: company,
        subject: subject,
        message: message,
        service_type: serviceType,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[CONTACT] Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save your submission. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[CONTACT] Lead created successfully:', contactLead.id);

    // Log security event for audit trail
    await supabase.from('security_events').insert({
      event_type: 'CONTACT_FORM_SUBMISSION',
      severity: 'info',
      table_name: 'contact_leads',
      operation: 'INSERT',
      ip_address: ipAddress,
      user_agent: userAgent,
      details: {
        lead_id: contactLead.id,
        email,
        company,
        service_type: serviceType,
        timestamp: new Date().toISOString(),
      },
    });

    // Send emails if Resend API key is configured
    if (resendApiKey) {
      console.log('[CONTACT] Sending confirmation email...');
      const confirmationSent = await sendConfirmationEmail(
        resendApiKey,
        email,
        name
      );

      console.log('[CONTACT] Sending notification email...');
      const notificationSent = await sendNotificationEmail(
        resendApiKey,
        {
          name,
          email,
          company,
          phone,
          subject,
          message,
          service_type: serviceType,
          ip_address: ipAddress,
        }
      );

      // Update email_sent status if at least one email was sent
      if (confirmationSent || notificationSent) {
        await supabase
          .from('contact_leads')
          .update({
            email_sent: true,
          })
          .eq('id', contactLead.id);
      }

      console.log('[CONTACT] Emails sent:', { confirmationSent, notificationSent });
    } else {
      console.warn('[CONTACT] RESEND_API_KEY not configured, skipping emails');
    }

    console.log('[CONTACT] Processing completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact submission received successfully',
        id: contactLead.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[CONTACT] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
