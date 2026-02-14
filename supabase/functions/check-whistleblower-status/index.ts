import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusRequest {
  trackingCode: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[WHISTLEBLOWER_STATUS] Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Error interno del servidor" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: StatusRequest = await req.json();

    if (!body.trackingCode || body.trackingCode.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "El código de seguimiento es obligatorio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trackingCode = body.trackingCode.trim().toUpperCase();

    // Validate format
    const formatRegex = /^WB-\d{4}-[A-Z0-9]{4,6}$/;
    if (!formatRegex.test(trackingCode)) {
      return new Response(
        JSON.stringify({ error: "Formato de código inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting: Check for too many status checks
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    // Simple rate limit check - 10 requests per minute
    const rateLimitResult = await supabase.rpc("check_rate_limit_enhanced_safe", {
      p_identifier: `whistleblower_status_${clientIP}`,
      p_category: "whistleblower_status",
      p_max_requests: 10,
      p_window_minutes: 1,
    });

    // SECURITY: Fail-closed - block if rate limit RPC fails OR returns false
    if (rateLimitResult.error || rateLimitResult.data === false) {
      if (rateLimitResult.error) {
        console.error("[WHISTLEBLOWER_STATUS] Rate limit RPC failed:", rateLimitResult.error);
      }
      return new Response(
        JSON.stringify({ error: "Demasiadas consultas. Espere un momento." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch report status
    const { data: report, error: fetchError } = await supabase
      .from("whistleblower_reports")
      .select("status, created_at, updated_at, resolved_at")
      .eq("tracking_code", trackingCode)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching report:", fetchError);
      return new Response(
        JSON.stringify({ error: "Error al consultar el estado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!report) {
      return new Response(
        JSON.stringify({ error: "No se encontró ninguna denuncia con ese código" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch public messages (visible to reporter)
    const { data: messages } = await supabase
      .from("whistleblower_messages")
      .select("message, created_at, sender_type")
      .eq("report_id", (
        await supabase
          .from("whistleblower_reports")
          .select("id")
          .eq("tracking_code", trackingCode)
          .single()
      ).data?.id)
      .eq("is_visible_to_reporter", true)
      .order("created_at", { ascending: true });

    // Map status to user-friendly text
    const statusLabels: Record<string, string> = {
      nuevo: "Recibida - Pendiente de revisión",
      en_revision: "En revisión por el equipo de compliance",
      investigando: "En proceso de investigación",
      resuelto: "Caso resuelto",
      archivado: "Caso archivado",
    };

    return new Response(
      JSON.stringify({
        success: true,
        status: report.status,
        statusLabel: statusLabels[report.status] || report.status,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
        resolvedAt: report.resolved_at,
        messages: messages?.map(m => ({
          message: m.message,
          date: m.created_at,
          from: m.sender_type === "admin" ? "Equipo de Compliance" : "Usted",
        })) || [],
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in check-whistleblower-status:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
