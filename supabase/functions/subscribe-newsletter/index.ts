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
  const content: Record<string, { subject: string; html: string }> = {
    es: {
      subject: "¡Bienvenido a la newsletter de Navarro!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Navarro Tax Legal</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1a365d; margin-top: 0;">¡Gracias por suscribirte!</h2>
            
            <p>Te damos la bienvenida a nuestra newsletter. A partir de ahora recibirás:</p>
            
            <ul style="padding-left: 20px;">
              <li><strong>Novedades fiscales y legales</strong> que pueden afectar a tu empresa</li>
              <li><strong>Actualizaciones regulatorias</strong> importantes</li>
              <li><strong>Artículos y análisis</strong> de nuestro equipo de expertos</li>
              <li><strong>Consejos prácticos</strong> para la gestión empresarial</li>
            </ul>
            
            <p>Nos comprometemos a enviarte contenido de valor y relevante para tu actividad profesional.</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #4a5568;">
                <strong>¿Tienes alguna consulta?</strong><br>
                Puedes contactarnos en <a href="mailto:info@navarro.legal" style="color: #2c5282;">info@navarro.legal</a> o llamarnos al <a href="tel:+34932722580" style="color: #2c5282;">+34 932 722 580</a>
              </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 0;">
              Un saludo cordial,<br>
              <strong>El equipo de Navarro Tax Legal</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
            <p style="margin: 0;">
              Navarro Tax Legal<br>
              Passeig de Gràcia, 103, 08008 Barcelona<br>
              <a href="https://navarro.legal" style="color: #2c5282;">navarro.legal</a>
            </p>
            <p style="margin: 10px 0 0 0;">
              Puedes darte de baja en cualquier momento respondiendo a este email.
            </p>
          </div>
        </body>
        </html>
      `,
    },
    en: {
      subject: "Welcome to Navarro's newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Navarro Tax Legal</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1a365d; margin-top: 0;">Thank you for subscribing!</h2>
            
            <p>Welcome to our newsletter. From now on you will receive:</p>
            
            <ul style="padding-left: 20px;">
              <li><strong>Tax and legal news</strong> that may affect your business</li>
              <li><strong>Important regulatory updates</strong></li>
              <li><strong>Articles and analysis</strong> from our team of experts</li>
              <li><strong>Practical advice</strong> for business management</li>
            </ul>
            
            <p>We are committed to sending you valuable and relevant content for your professional activity.</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #4a5568;">
                <strong>Have any questions?</strong><br>
                Contact us at <a href="mailto:info@navarro.legal" style="color: #2c5282;">info@navarro.legal</a> or call us at <a href="tel:+34932722580" style="color: #2c5282;">+34 932 722 580</a>
              </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 0;">
              Best regards,<br>
              <strong>The Navarro Tax Legal Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
            <p style="margin: 0;">
              Navarro Tax Legal<br>
              Passeig de Gràcia, 103, 08008 Barcelona, Spain<br>
              <a href="https://navarro.legal" style="color: #2c5282;">navarro.legal</a>
            </p>
            <p style="margin: 10px 0 0 0;">
              You can unsubscribe at any time by replying to this email.
            </p>
          </div>
        </body>
        </html>
      `,
    },
    ca: {
      subject: "Benvingut a la newsletter de Navarro!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Navarro Tax Legal</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1a365d; margin-top: 0;">Gràcies per subscriure't!</h2>
            
            <p>Et donem la benvinguda a la nostra newsletter. A partir d'ara rebràs:</p>
            
            <ul style="padding-left: 20px;">
              <li><strong>Novetats fiscals i legals</strong> que poden afectar la teva empresa</li>
              <li><strong>Actualitzacions regulatòries</strong> importants</li>
              <li><strong>Articles i anàlisis</strong> del nostre equip d'experts</li>
              <li><strong>Consells pràctics</strong> per a la gestió empresarial</li>
            </ul>
            
            <p>Ens comprometem a enviar-te contingut de valor i rellevant per a la teva activitat professional.</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #4a5568;">
                <strong>Tens alguna consulta?</strong><br>
                Pots contactar-nos a <a href="mailto:info@navarro.legal" style="color: #2c5282;">info@navarro.legal</a> o trucar-nos al <a href="tel:+34932722580" style="color: #2c5282;">+34 932 722 580</a>
              </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 0;">
              Una salutació cordial,<br>
              <strong>L'equip de Navarro Tax Legal</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
            <p style="margin: 0;">
              Navarro Tax Legal<br>
              Passeig de Gràcia, 103, 08008 Barcelona<br>
              <a href="https://navarro.legal" style="color: #2c5282;">navarro.legal</a>
            </p>
            <p style="margin: 10px 0 0 0;">
              Pots donar-te de baixa en qualsevol moment responent a aquest email.
            </p>
          </div>
        </body>
        </html>
      `,
    },
  };

  return content[language] || content.es;
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, consent, source_page, language }: SubscribeRequest = await req.json();

    // Validate required fields
    if (!email || typeof email !== 'string' || !email.includes('@')) {
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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
          source_site: "navarro",
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
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
