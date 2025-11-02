import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const demoRequestSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  company: z.string().trim().max(100, "Company name too long").optional(),
  restaurant_name: z.string().trim().max(100, "Restaurant name too long").optional(),
  phone: z.string().trim().max(20, "Phone number too long").optional(),
  message: z.string().trim().max(1000, "Message too long").optional(),
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
        from: 'NRRO - Orquest + KairosHR <info@nrro.es>',
        to: [toEmail],
        subject: 'Solicitud de demo recibida - Orquest + KairosHR',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #1a1a1a; margin-bottom: 20px;">Gracias por tu interés, ${name}</h1>
                <p>Hemos recibido tu solicitud de demo para la solución Orquest + KairosHR.</p>
                <p>Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas para coordinar una presentación personalizada.</p>
                <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Solución Orquest + KairosHR</h3>
                  <p style="margin: 0;">La mejor herramienta integrada para gestión de RRHH y planificación de turnos en restaurantes McDonald's.</p>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Gestión automatizada de turnos</li>
                    <li>Control de nóminas y asistencia</li>
                    <li>Optimización de costes laborales</li>
                    <li>Integración completa y sin complicaciones</li>
                  </ul>
                </div>
                <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #1a1a1a;">
                  <p style="margin: 0;"><strong>Contacto directo:</strong></p>
                  <p style="margin: 10px 0 0 0;">📞 +34 93 459 36 00</p>
                  <p style="margin: 5px 0 0 0;">📧 info@nrro.es</p>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Saludos cordiales,<br>
                  <strong>Equipo NRRO</strong>
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
  requestData: any
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
        subject: `Nueva solicitud de demo: ${requestData.name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #1a1a1a; margin-bottom: 20px;">Nueva solicitud de demo Orquest + KairosHR</h1>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p><strong>Nombre:</strong> ${requestData.name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${requestData.email}">${requestData.email}</a></p>
                  ${requestData.restaurant_name ? `<p><strong>Restaurante:</strong> ${requestData.restaurant_name}</p>` : ''}
                </div>
                ${requestData.message ? `
                <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Mensaje:</h3>
                  <p style="white-space: pre-wrap;">${requestData.message}</p>
                </div>
                ` : ''}
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('[DEMO] Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse and validate request body
    const body = await req.json();
    const validation = demoRequestSchema.safeParse(body);

    if (!validation.success) {
      console.warn('[DEMO] Validation failed:', validation.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data',
          fields: validation.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, company, restaurant_name, phone, message } = validation.data;

    // Extract IP address and user agent
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log('[DEMO] Processing request:', { email, company: company || restaurant_name });

    // Check rate limiting by email (5 requests per hour, fail-closed)
    const { data: emailRateLimitOk, error: emailRateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: email,
        p_category: 'demo_request',
        p_max_requests: 5,
        p_window_minutes: 60,
      }
    );

    // SECURITY: Fail-closed - block if error OR exceeded
    if (emailRateLimitError || emailRateLimitOk === false) {
      console.warn('[DEMO] Rate limit check failed or exceeded:', { email, error: emailRateLimitError });
      
      await supabase.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        table_name: 'demo_requests',
        operation: 'INSERT',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: {
          email,
          category: 'demo_request',
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
    const { data: ipRateLimitOk, error: ipRateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: ipAddress,
        p_category: 'demo_request_ip',
        p_max_requests: 10,
        p_window_minutes: 60,
      }
    );

    // SECURITY: Fail-closed - block if error OR exceeded
    if (ipRateLimitError || ipRateLimitOk === false) {
      console.warn('[DEMO] Rate limit check failed or exceeded:', { ip: ipAddress, error: ipRateLimitError });
      
      await supabase.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        table_name: 'demo_requests',
        operation: 'INSERT',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: {
          ip: ipAddress,
          category: 'demo_request_ip',
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

    // Insert demo request
    const { data, error: insertError } = await supabase
      .from('demo_requests')
      .insert({
        name,
        email: email.toLowerCase(),
        restaurant_name: restaurant_name || company || null,
        message: message || null,
        source: 'orquest-kairoshr-landing',
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[DEMO] Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save your request. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[DEMO] Request created successfully:', data.id);

    // Log security event
    await supabase.from('security_events').insert({
      event_type: 'DEMO_REQUEST_SUBMISSION',
      severity: 'info',
      table_name: 'demo_requests',
      operation: 'INSERT',
      ip_address: ipAddress,
      user_agent: userAgent,
      details: {
        request_id: data.id,
        email,
        company: company || restaurant_name,
        timestamp: new Date().toISOString(),
      },
    });

    // Send emails if Resend API key is configured
    if (resendApiKey) {
      console.log('[DEMO] Sending confirmation email...');
      await sendConfirmationEmail(
        resendApiKey,
        email,
        name
      );

      console.log('[DEMO] Sending notification email...');
      await sendNotificationEmail(
        resendApiKey,
        {
          name,
          email,
          restaurant_name: restaurant_name || company,
          message,
        }
      );
    } else {
      console.warn('[DEMO] RESEND_API_KEY not configured, skipping emails');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo request received successfully',
        id: data.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[DEMO] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
