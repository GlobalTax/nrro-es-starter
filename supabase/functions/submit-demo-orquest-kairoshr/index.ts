import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DemoRequest {
  name: string;
  email: string;
  restaurant_name?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { name, email, restaurant_name, message }: DemoRequest = await req.json();

    console.log("Received demo request:", { name, email, restaurant_name });

    // Validate required fields
    if (!name || !email) {
      console.error("Validation error: Missing required fields");
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Validation error: Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Insert demo request into database
    const { data, error } = await supabase
      .from("demo_requests")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        restaurant_name: restaurant_name?.trim() || null,
        message: message?.trim() || null,
        source: "orquest-kairoshr-landing",
        status: "pending",
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Demo request saved successfully:", data.id);

    // Future: Send notification email via Brevo or other service
    // await sendNotificationEmail(name, email, restaurant_name);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Demo request received successfully",
        id: data.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Error processing demo request:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);
