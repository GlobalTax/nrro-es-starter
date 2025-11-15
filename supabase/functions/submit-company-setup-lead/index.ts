import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    console.log('Company Setup Lead received:', {
      name: body.name,
      email: body.email,
      variant: body.landing_variant,
      country: body.country_origin
    });
    
    // Validation
    if (!body.name || !body.email || !body.country_origin || !body.landing_variant) {
      throw new Error('Missing required fields: name, email, country_origin, landing_variant');
    }

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

    // Insert lead
    const { data: lead, error: insertError } = await supabase
      .from('company_setup_leads')
      .insert({
        ...body,
        lead_score: leadScore,
        priority,
        landing_page_url: body.landing_page_url || req.headers.get('referer'),
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip'),
        user_agent: req.headers.get('user-agent'),
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
      const emailTemplates: Record<string, { subject: string; html: string }> = {
        'calculator': {
          subject: 'Your Spain Company Setup Cost Estimate',
          html: `
            <h2>Hi ${body.name},</h2>
            <p>Thank you for using our company setup calculator!</p>
            <p>We've received your request and will send you a detailed cost breakdown shortly.</p>
            <p>In the meantime, feel free to reply to this email if you have any questions.</p>
            <p>Best regards,<br>Navarro Tax Legal Team</p>
          `
        },
        'nie-hell': {
          subject: 'Your NIE Express Service Request',
          html: `
            <h2>Hi ${body.name},</h2>
            <p>Great news! We've received your NIE express service request.</p>
            <p>Our team will contact you within 24 hours to start the process.</p>
            <p>We'll get your NIE in 7 days - no queues, no hassle!</p>
            <p>Best regards,<br>Navarro Tax Legal Team</p>
          `
        },
        'tech-startup': {
          subject: 'Your Startup Package Quote - Navarro Tax Legal',
          html: `
            <h2>Hi ${body.name},</h2>
            <p>Thank you for your interest in launching your startup in Spain!</p>
            <p>We're preparing a custom quote for ${body.company_name || 'your company'}.</p>
            <p>Our startup specialists will reach out within 24 hours to discuss your specific needs.</p>
            <p>Best regards,<br>Navarro Tax Legal Team</p>
          `
        },
        'express': {
          subject: 'Express Registration Confirmed - 30 Days Start Now!',
          html: `
            <h2>Hi ${body.name},</h2>
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
            subject: `🚨 ${priority.toUpperCase()} Lead: ${body.landing_variant} - ${body.name}`,
            html: `
              <h2>New Company Setup Lead</h2>
              <p><strong>Landing:</strong> ${body.landing_variant}</p>
              <p><strong>Priority:</strong> ${priority} (Score: ${leadScore})</p>
              <p><strong>Name:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone:</strong> ${body.phone || 'N/A'}</p>
              <p><strong>Company:</strong> ${body.company_name || 'N/A'}</p>
              <p><strong>Country:</strong> ${body.country_origin}</p>
              <p><strong>Timeline:</strong> ${body.timeline || 'N/A'}</p>
              <p><strong>Stage:</strong> ${body.company_stage || 'N/A'}</p>
              ${body.message ? `<p><strong>Message:</strong> ${body.message}</p>` : ''}
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
