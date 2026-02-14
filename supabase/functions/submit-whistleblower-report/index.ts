import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Valid categories for whistleblower reports
const VALID_CATEGORIES = [
  "fraude_financiero",
  "corrupcion",
  "acoso_laboral",
  "discriminacion",
  "seguridad_laboral",
  "medioambiental",
  "proteccion_datos",
  "blanqueo_capitales",
  "competencia_desleal",
  "otro",
];

interface WhistleblowerSubmission {
  category: string;
  description: string;
  dateOfIncident?: string;
  location?: string;
  personsInvolved?: string;
  contactEmail?: string;
  isAnonymous: boolean;
  acceptedPolicy: boolean;
}

// Generate unique tracking code using crypto-safe random: WB-YYYY-XXXXXX
function generateTrackingCode(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomBytes = new Uint8Array(6);
  crypto.getRandomValues(randomBytes);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(randomBytes[i] % chars.length);
  }
  return `WB-${year}-${code}`;
}

// Cryptographic hash for IP using HMAC-SHA256 with secret salt
async function hashIP(ip: string): Promise<string> {
  const salt = Deno.env.get('WHISTLEBLOWER_IP_SALT') || 'default-whistleblower-salt-change-in-production';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(salt);
  const ipData = encoder.encode(ip);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, ipData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[WHISTLEBLOWER] Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Error interno del servidor" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: WhistleblowerSubmission = await req.json();

    // Validation
    if (!body.category) {
      return new Response(
        JSON.stringify({ error: "La categoría es obligatoria" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate category against allowed enum values
    if (!VALID_CATEGORIES.includes(body.category)) {
      return new Response(
        JSON.stringify({ error: "Categoría no válida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "La descripción debe tener al menos 50 caracteres" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.description.trim().length > 10000) {
      return new Response(
        JSON.stringify({ error: "La descripción es demasiado larga (máximo 10000 caracteres)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof body.isAnonymous !== 'boolean') {
      return new Response(
        JSON.stringify({ error: "El campo de anonimato es obligatorio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.acceptedPolicy) {
      return new Response(
        JSON.stringify({ error: "Debe aceptar la política de privacidad" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate optional field lengths
    if (body.location && body.location.length > 500) {
      return new Response(
        JSON.stringify({ error: "La ubicación es demasiado larga" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.personsInvolved && body.personsInvolved.length > 2000) {
      return new Response(
        JSON.stringify({ error: "El campo de personas involucradas es demasiado largo" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.dateOfIncident && body.dateOfIncident.length > 20) {
      return new Response(
        JSON.stringify({ error: "La fecha del incidente no es válida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format if provided
    if (body.contactEmail && !body.isAnonymous) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.contactEmail) || body.contactEmail.length > 255) {
        return new Response(
          JSON.stringify({ error: "El formato del email no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Get client IP for rate limiting (hashed for privacy with HMAC-SHA256)
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] ||
                     req.headers.get("x-real-ip") ||
                     "unknown";
    const ipHash = await hashIP(clientIP);

    // Rate limiting: Check for recent submissions from same IP hash (fail-closed)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentSubmissions, error: rateLimitError } = await supabase
      .from("whistleblower_reports")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);

    // SECURITY: Fail-closed - block if rate limit query fails or is exceeded
    if (rateLimitError || (recentSubmissions !== null && recentSubmissions >= 3)) {
      if (rateLimitError) {
        console.error("[WHISTLEBLOWER] Rate limit query failed:", rateLimitError);
      }
      return new Response(
        JSON.stringify({ error: "Demasiadas denuncias desde esta conexión. Intente más tarde." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique tracking code
    let trackingCode = generateTrackingCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from("whistleblower_reports")
        .select("id")
        .eq("tracking_code", trackingCode)
        .maybeSingle();

      if (!existing) break;

      trackingCode = generateTrackingCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.error("Could not generate unique tracking code after max attempts");
      return new Response(
        JSON.stringify({ error: "Error interno. Intente de nuevo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert the report
    const { data: report, error: insertError } = await supabase
      .from("whistleblower_reports")
      .insert({
        tracking_code: trackingCode,
        category: body.category,
        description: body.description.trim(),
        date_of_incident: body.dateOfIncident || null,
        location: body.location?.trim() || null,
        persons_involved: body.personsInvolved?.trim() || null,
        contact_email: body.isAnonymous ? null : body.contactEmail?.trim() || null,
        is_anonymous: body.isAnonymous,
        ip_hash: ipHash,
        status: "nuevo",
        priority: "media",
      })
      .select("id, tracking_code")
      .single();

    if (insertError) {
      console.error("Error inserting report:", insertError);
      return new Response(
        JSON.stringify({ error: "Error al registrar la denuncia" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log security event
    await supabase.from("security_events").insert({
      event_type: "WHISTLEBLOWER_SUBMISSION",
      severity: "info",
      details: {
        report_id: report.id,
        category: body.category,
        is_anonymous: body.isAnonymous,
        ip_hash: ipHash,
      },
    });

    // Send notification email to compliance officer (optional)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Canal de Denuncias <compliance@navarro.legal>",
            to: ["compliance@navarro.legal"],
            subject: `[NUEVA DENUNCIA] ${trackingCode} - ${body.category}`,
            html: `
              <h2>Nueva denuncia recibida</h2>
              <p><strong>Código:</strong> ${trackingCode}</p>
              <p><strong>Categoría:</strong> ${body.category}</p>
              <p><strong>Anónimo:</strong> ${body.isAnonymous ? "Sí" : "No"}</p>
              <p><strong>Fecha del incidente:</strong> ${body.dateOfIncident || "No especificada"}</p>
              <hr>
              <p>Accede al panel de administración para revisar los detalles.</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
        // Don't fail the submission if email fails
      }
    }

    console.log(`Whistleblower report created: ${trackingCode}`);

    return new Response(
      JSON.stringify({
        success: true,
        trackingCode: report.tracking_code,
        message: "Denuncia registrada correctamente",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in submit-whistleblower-report:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
