import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HTML escape helper to prevent injection in emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validation schema
const companySetupLeadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().trim().max(20, "Phone too long").optional(),
  company_name: z.string().trim().max(200, "Company name too long").optional(),
  country_origin: z.string().trim().min(1, "Country is required").max(100, "Country too long"),
  landing_variant: z.enum(['calculator', 'nie-hell', 'tech-startup', 'express', 'general']),
  timeline: z.string().trim().max(50).optional(),
  company_stage: z.string().trim().max(50).optional(),
  estimated_revenue: z.string().trim().max(50).optional(),
  message: z.string().trim().max(5000, "Message too long").optional(),
  landing_page_url: z.string().trim().max(500).optional(),
  consent: z.boolean().optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      console.error('[COMPANY_SETUP] Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const rawBody = await req.json();
    const validation = companySetupLeadSchema.safeParse(rawBody);

    if (!validation.success) {
      console.warn('[COMPANY_SETUP] Validation failed:', validation.error.flatten());
      return new Response(
        JSON.stringify({
          error: 'Invalid input data',
          fields: validation.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = validation.data;

    console.log('Company Setup Lead received:', {
      name: body.name,
      email: body.email,
      variant: body.landing_variant,
      country: body.country_origin
    });

    // Rate limiting check (max 3 submissions per hour per email)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentLeads } = await supabase
      .from('company_setup_leads')
      .select('id')
      .eq('email', body.email)
      .gte('created_at', oneHourAgo);

    if (recentLeads && recentLeads.length >= 3) {
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Lead scoring logic
    let leadScore = 50;
    if (body.timeline === 'immediate') leadScore += 30;
    else if (body.timeline === '1-month') leadScore += 20;
    else if (body.timeline === '3-months') leadScore += 10;
    
    if (body.company_stage === 'ready-to-register') leadScore += 20;
    else if (body.company_stage === 'registered-abroad') leadScore += 15;
    
    if (body.estimated_revenue) {
      const revenue = parseInt(body.estimated_revenue.replace(/[^0-9]/g, ''));
      if (revenue > 100000) leadScore += 15;
      else if (revenue > 50000) leadScore += 10;
    }
    
    if (body.landing_variant === 'express' || body.landing_variant === 'tech-startup') {
      leadScore += 10;
    }
    
    // Priority calculation
    let priority = 'medium';
    if (leadScore >= 80) priority = 'urgent';
    else if (leadScore >= 65) priority = 'high';
    else if (leadScore < 40) priority = 'low';

    // Extract IP and User Agent from headers (not from user body)
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                     req.headers.get('cf-connecting-ip') ||
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Insert lead with explicit fields only
    const { data: lead, error: insertError } = await supabase
      .from('company_setup_leads')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        company_name: body.company_name || null,
        country_origin: body.country_origin,
        landing_variant: body.landing_variant,
        timeline: body.timeline || null,
        company_stage: body.company_stage || null,
        estimated_revenue: body.estimated_revenue || null,
        message: body.message || null,
        lead_score: leadScore,
        priority,
        landing_page_url: body.landing_page_url || req.headers.get('referer'),
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lead:', insertError);
      throw insertError;
    }

    console.log('Lead created successfully:', lead.id, 'Priority:', priority, 'Score:', leadScore);

    // Send confirmation email to lead
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (RESEND_API_KEY) {
      const safeName = escapeHtml(body.name);
      const safeCompanyName = escapeHtml(body.company_name || 'your company');

      const emailTemplates: Record<string, { subject: string; html: string }> = {
        'calculator': {
          subject: 'Your Spain Company Setup Cost Estimate',
          html: `
            <h2>Hi ${safeName},</h2>
            <p>Thank you for using our company setup calculator!</p>
            <p>We've received your request and will send you a detailed cost breakdown shortly.</p>
            <p>In the meantime, feel free to reply to this email if you have any questions.</p>
            <p>Best regards,<br>Navarro Tax Legal Team</p>
          `
        },
        'nie-hell': {
          subject: 'Your NIE Express Service Request',
          html: `
            <h2>Hi ${safeName},</h2>
            <p>Great news! We've received your NIE express service request.</p>
            <p>Our team will contact you within 24 hours to start the process.</p>
            <p>We'll get your NIE in 7 days - no queues, no hassle!</p>
            <p>Best regards,<br>Navarro Tax Legal Team</p>
          `
        },
        'tech-startup': {
          subject: 'Your Startup Package Quote - Navarro Tax Legal',
          html: `
            <h2>Hi ${safeName},</h2>
            <p>Thank you for your interest in launching your startup in Spain!</p>
            <p>We're preparing a custom quote for ${safeCompanyName}.</p>
            <p>Our startup specialists will reach out within 24 hours to discuss your specific needs.</p>
            <p>Best regards,<br>Navarro Tax Legal Team</p>
          `
        },
        'express': {
          subject: 'Express Registration Confirmed - 30 Days Start Now!',
          html: `
            <h2>Hi ${safeName},</h2>
            <p>Your express company registration slot is secured!</p>
            <p>We'll have your Spanish company registered in 30 days or you get 50% back.</p>
            <p>Our team will contact you today to kick things off.</p>
            <p>Best regards,<br>Navarro Tax Legal Team</p>
          `
        }
      };

      const template = emailTemplates[body.landing_variant] || emailTemplates['calculator'];

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Navarro Tax Legal <info@nrro.es>',
            to: [body.email],
            subject: template.subject,
            html: template.html,
          }),
        });
        
        console.log('Confirmation email sent to:', body.email);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }

      // Send internal notification to admin
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Leads Automation <leads@nrro.es>',
            to: ['info@nrro.es'],
            subject: `New ${priority.toUpperCase()} Lead: ${escapeHtml(body.landing_variant)} - ${safeName}`,
            html: `
              <h2>New Company Setup Lead</h2>
              <p><strong>Landing:</strong> ${escapeHtml(body.landing_variant)}</p>
              <p><strong>Priority:</strong> ${escapeHtml(priority)} (Score: ${leadScore})</p>
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(body.phone || 'N/A')}</p>
              <p><strong>Company:</strong> ${safeCompanyName}</p>
              <p><strong>Country:</strong> ${escapeHtml(body.country_origin)}</p>
              <p><strong>Timeline:</strong> ${escapeHtml(body.timeline || 'N/A')}</p>
              <p><strong>Stage:</strong> ${escapeHtml(body.company_stage || 'N/A')}</p>
              ${body.message ? `<p><strong>Message:</strong> ${escapeHtml(body.message)}</p>` : ''}
              <p><a href="https://nrro.es/admin/company-setup-leads">View in Admin Panel</a></p>
            `,
          }),
        });
        
        console.log('Admin notification sent');
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadId: lead.id, 
        priority,
        leadScore 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-company-setup-lead:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
