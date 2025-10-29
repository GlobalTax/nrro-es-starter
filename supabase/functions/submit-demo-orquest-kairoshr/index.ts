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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

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

    // Check rate limiting by email (5 requests per hour)
    const { data: emailRateLimitOk, error: emailRateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: email,
        p_category: 'demo_request',
        p_max_requests: 5,
        p_window_minutes: 60,
      }
    );

    if (emailRateLimitError) {
      console.error('[DEMO] Email rate limit check error:', emailRateLimitError);
    }

    if (emailRateLimitOk === false) {
      console.log('[DEMO] Email rate limit exceeded:', email);
      
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

    // Check rate limiting by IP (10 requests per hour)
    const { data: ipRateLimitOk, error: ipRateLimitError } = await supabase.rpc(
      'check_rate_limit_enhanced_safe',
      {
        p_identifier: ipAddress,
        p_category: 'demo_request_ip',
        p_max_requests: 10,
        p_window_minutes: 60,
      }
    );

    if (ipRateLimitError) {
      console.error('[DEMO] IP rate limit check error:', ipRateLimitError);
    }

    if (ipRateLimitOk === false) {
      console.log('[DEMO] IP rate limit exceeded:', ipAddress);
      
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
        company: company || null,
        restaurant_name: restaurant_name || null,
        phone: phone || null,
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
