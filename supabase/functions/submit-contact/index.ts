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
  company: z.string().trim().min(1, "Company is required").max(100, "Company name too long"),
  subject: z.string().trim().min(1, "Subject is required").max(100, "Subject too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message too long"),
});

// Email service stub
async function sendEmailStub(to: string, subject: string, html: string): Promise<{ success: boolean }> {
  console.log('[EMAIL STUB] Sending email:', { to, subject });
  // TODO: Integrate Resend API when ready
  return { success: true };
}

// Map form subjects to database service_type_enum
function mapSubjectToServiceType(subject: string): "vender" | "comprar" | "otros" {
  const mapping: Record<string, "vender" | "comprar" | "otros"> = {
    'investment': 'comprar',
    'partnership': 'otros',
    'press': 'otros',
    'careers': 'otros',
    'other': 'otros',
  };
  return mapping[subject] || 'otros';
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
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

    const { name, email, company, subject, message } = validation.data;

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
        full_name: name,
        email: email,
        company: company,
        service_type: serviceType,
        referral: message,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'new',
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

    // Send confirmation email (stub)
    await sendEmailStub(
      email,
      'Thank you for contacting Ethos Ventures',
      `<h1>Thank you for contacting us, ${name}!</h1><p>We have received your message and will get back to you as soon as possible.</p>`
    );

    // Update email_sent status
    await supabase
      .from('contact_leads')
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', contactLead.id);

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
