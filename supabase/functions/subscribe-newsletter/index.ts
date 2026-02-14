import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  consent: boolean;
  source_page?: string;
  language?: string;
}

const getEmailContent = (language: string = 'es') => {
  const content = {
    es: {
      subject: "¡Bienvenido/a a la newsletter de navarro!",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a navarro</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 40px 40px 30px;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        navarro
                      </h1>
                      <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">
                        Asesoría legal y fiscal
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1a365d; font-size: 24px; font-weight: 600;">
                        ¡Gracias por suscribirte!
                      </h2>
                      <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Nos alegra que hayas decidido unirte a nuestra comunidad. A partir de ahora, recibirás en tu correo:
                      </p>
                      <ul style="margin: 0 0 24px; padding-left: 20px; color: #4a5568; font-size: 15px; line-height: 1.8;">
                        <li>Análisis de novedades fiscales y legales</li>
                        <li>Consejos prácticos para empresas y empresas familiares</li>
                        <li>Actualizaciones sobre cambios normativos relevantes</li>
                        <li>Invitaciones a eventos y webinars exclusivos</li>
                      </ul>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="margin: 32px 0;">
                        <tr>
                          <td style="background-color: #1a365d; border-radius: 8px;">
                            <a href="https://navarro.legal/blog" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600;">
                              Explorar nuestro blog →
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                        Si tienes alguna pregunta o necesitas asesoramiento, no dudes en 
                        <a href="https://navarro.legal/contacto" style="color: #2c5282; text-decoration: underline;">contactarnos</a>.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 8px; color: #718096; font-size: 13px;">
                        navarro · Asesoría legal y fiscal
                      </p>
                      <p style="margin: 0 0 16px; color: #a0aec0; font-size: 12px;">
                        Barcelona, España
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 11px;">
                        Puedes darte de baja en cualquier momento haciendo clic 
                        <a href="https://navarro.legal/unsubscribe" style="color: #718096;">aquí</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    },
    ca: {
      subject: "Benvingut/da a la newsletter de navarro!",
      html: `
        <!DOCTYPE html>
        <html lang="ca">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Benvingut a navarro</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 40px 40px 30px;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        navarro
                      </h1>
                      <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">
                        Assessoria legal i fiscal
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1a365d; font-size: 24px; font-weight: 600;">
                        Gràcies per subscriure't!
                      </h2>
                      <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Ens alegra que hagis decidit unir-te a la nostra comunitat. A partir d'ara, rebràs al teu correu:
                      </p>
                      <ul style="margin: 0 0 24px; padding-left: 20px; color: #4a5568; font-size: 15px; line-height: 1.8;">
                        <li>Anàlisi de novetats fiscals i legals</li>
                        <li>Consells pràctics per a empreses i empreses familiars</li>
                        <li>Actualitzacions sobre canvis normatius rellevants</li>
                        <li>Invitacions a esdeveniments i webinars exclusius</li>
                      </ul>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="margin: 32px 0;">
                        <tr>
                          <td style="background-color: #1a365d; border-radius: 8px;">
                            <a href="https://navarro.legal/ca/blog" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600;">
                              Explorar el nostre blog →
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                        Si tens alguna pregunta o necessites assessorament, no dubtis a 
                        <a href="https://navarro.legal/ca/contacte" style="color: #2c5282; text-decoration: underline;">contactar-nos</a>.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 8px; color: #718096; font-size: 13px;">
                        navarro · Assessoria legal i fiscal
                      </p>
                      <p style="margin: 0 0 16px; color: #a0aec0; font-size: 12px;">
                        Barcelona, Espanya
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 11px;">
                        Pots donar-te de baixa en qualsevol moment fent clic 
                        <a href="https://navarro.legal/unsubscribe" style="color: #718096;">aquí</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    },
    en: {
      subject: "Welcome to navarro's newsletter!",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to navarro</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 40px 40px 30px;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        navarro
                      </h1>
                      <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">
                        Legal and tax advisory
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1a365d; font-size: 24px; font-weight: 600;">
                        Thank you for subscribing!
                      </h2>
                      <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        We're glad you've decided to join our community. From now on, you'll receive:
                      </p>
                      <ul style="margin: 0 0 24px; padding-left: 20px; color: #4a5568; font-size: 15px; line-height: 1.8;">
                        <li>Analysis of tax and legal developments</li>
                        <li>Practical advice for businesses and family enterprises</li>
                        <li>Updates on relevant regulatory changes</li>
                        <li>Invitations to exclusive events and webinars</li>
                      </ul>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="margin: 32px 0;">
                        <tr>
                          <td style="background-color: #1a365d; border-radius: 8px;">
                            <a href="https://navarro.legal/en/blog" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600;">
                              Explore our blog →
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                        If you have any questions or need advice, don't hesitate to 
                        <a href="https://navarro.legal/en/contact" style="color: #2c5282; text-decoration: underline;">contact us</a>.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 8px; color: #718096; font-size: 13px;">
                        navarro · Legal and tax advisory
                      </p>
                      <p style="margin: 0 0 16px; color: #a0aec0; font-size: 12px;">
                        Barcelona, Spain
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 11px;">
                        You can unsubscribe at any time by clicking 
                        <a href="https://navarro.legal/unsubscribe" style="color: #718096;">here</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    },
  };

  return content[language as keyof typeof content] || content.es;
};

// Notification email content for admin
const getNotificationEmailContent = (subscriberEmail: string, sourcePage?: string) => {
  return {
    subject: "Nueva suscripción a la newsletter",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <h2 style="color: #1a365d;">Nueva suscripción a la newsletter</h2>
        <p>Se ha registrado una nueva suscripción:</p>
        <ul>
          <li><strong>Email:</strong> ${subscriberEmail.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>
          <li><strong>Página de origen:</strong> ${(sourcePage || 'No especificada').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>
          <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</li>
        </ul>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #718096; font-size: 12px;">
          Este es un email automático del sistema de newsletter de navarro.legal
        </p>
      </body>
      </html>
    `,
  };
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { email, consent, source_page, language }: SubscribeRequest = await req.json();

    // Validate required fields with proper email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!consent) {
      return new Response(
        JSON.stringify({ error: "Consent is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) {
      console.error("[NEWSLETTER] Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract IP for rate limiting
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    // Rate limiting by IP (10 subscriptions per hour, fail-closed)
    const { data: rateLimitOk, error: rateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: ipAddress,
        p_category: 'newsletter_subscription',
        p_max_requests: 10,
        p_window_minutes: 60,
      }
    );

    if (rateLimitError || rateLimitOk === false) {
      console.warn('[NEWSLETTER] Rate limit exceeded:', { ip: ipAddress });
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "3600" }
        }
      );
    }

    // Check for existing subscription
    const { data: existingSubscription } = await supabase
      .from("newsletter_subscriptions")
      .select("id, is_active")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return new Response(
          JSON.stringify({ error: "already_subscribed" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from("newsletter_subscriptions")
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq("id", existingSubscription.id);

        if (updateError) {
          console.error("Error reactivating subscription:", updateError);
          throw updateError;
        }
      }
    } else {
      // Insert new subscription
      const { error: insertError } = await supabase
        .from("newsletter_subscriptions")
        .insert({
          email: email.toLowerCase().trim(),
          consent: true,
          source_page: source_page || null,
          source_site: "es",
          is_active: true,
          subscribed_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Error inserting subscription:", insertError);
        throw insertError;
      }
    }

    console.log(`Newsletter subscription successful for: ${email}`);

    // Send welcome email using fetch (Resend API)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const emailContent = getEmailContent(language);

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Navarro Tax Legal <onboarding@resend.dev>",
            to: [email],
            subject: emailContent.subject,
            html: emailContent.html,
          }),
        });

        const emailResult = await emailResponse.json();
        console.log("Welcome email sent successfully:", emailResult);

        // Send notification email to admin
        try {
          const notificationContent = getNotificationEmailContent(email, source_page);
          
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Navarro Newsletter <onboarding@resend.dev>",
              to: ["s.navarro@nrro.es"],
              subject: notificationContent.subject,
              html: notificationContent.html,
            }),
          });
          
          console.log("Notification email sent to admin");
        } catch (notifyError) {
          console.error("Error sending notification email:", notifyError);
        }
      } catch (emailError) {
        // Log but don't fail the subscription if email fails
        console.error("Error sending welcome email:", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY not configured, skipping welcome email");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Subscription successful" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in subscribe-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
