import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, password } = await req.json();

    // Validate inputs
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Password length validation
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract IP and User Agent
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log('[ADMIN_AUTH] Login attempt:', { email, ip: ipAddress });

    // Check rate limit
    const { data: rateLimitOk, error: rateLimitError } = await supabase.rpc(
      'check_login_rate_limit',
      {
        p_identifier: ipAddress,
        p_max_attempts: 5,
        p_window_minutes: 15,
      }
    );

    if (rateLimitError) {
      console.error('[ADMIN_AUTH] Rate limit check error:', rateLimitError);
    }

    if (rateLimitOk === false) {
      console.warn('[ADMIN_AUTH] Rate limit exceeded:', { email, ip: ipAddress });
      
      await supabase.from('security_events').insert({
        event_type: 'RATE_LIMIT_EXCEEDED',
        severity: 'high',
        user_id: null,
        ip_address: ipAddress,
        user_agent: userAgent,
        table_name: 'admin_login',
        operation: 'LOGIN',
        details: {
          email,
          reason: 'Too many login attempts',
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({ 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: 900 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '900',
          } 
        }
      );
    }

    // Authenticate user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.warn('[ADMIN_AUTH] Authentication failed:', { email, error: authError.message });
      
      // Log failed attempt
      await supabase.from('security_events').insert({
        event_type: 'LOGIN_FAILED',
        severity: 'medium',
        user_id: null,
        ip_address: ipAddress,
        user_agent: userAgent,
        table_name: 'admin_login',
        operation: 'LOGIN',
        details: {
          email,
          reason: 'Invalid credentials',
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user has admin panel access by checking user_roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id);

    if (rolesError) {
      console.error('[ADMIN_AUTH] Error fetching user roles:', rolesError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const roles = userRoles?.map(r => r.role) || [];
    const hasPanelAccess = roles.some(r => ['admin', 'editor', 'marketing'].includes(r));

    if (!hasPanelAccess) {
      console.warn('[ADMIN_AUTH] User has no panel access:', { email, userId: authData.user.id });
      
      // Log unauthorized access attempt
      await supabase.from('security_events').insert({
        event_type: 'UNAUTHORIZED_ACCESS',
        severity: 'high',
        user_id: authData.user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        table_name: 'admin_login',
        operation: 'LOGIN',
        details: {
          email,
          reason: 'No admin panel access',
          timestamp: new Date().toISOString(),
        },
      });

      // Sign out the user
      await supabase.auth.signOut();

      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get profile info
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', authData.user.id)
      .single();

    // Construct admin user object
    const adminUser = {
      id: authData.user.id,
      user_id: authData.user.id,
      email: profile?.email || authData.user.email,
      full_name: profile?.email || authData.user.email,
      role: roles.includes('admin') ? 'admin' : 'editor',
      is_active: true,
    };

    // Log successful login
    await supabase.from('security_events').insert({
      event_type: 'LOGIN_SUCCESS',
      severity: 'info',
      user_id: authData.user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      table_name: 'admin_login',
      operation: 'LOGIN',
      details: {
        email,
        roles: roles,
        timestamp: new Date().toISOString(),
      },
    });

    console.log('[ADMIN_AUTH] Login successful:', { email, userId: authData.user.id, roles });

    return new Response(
      JSON.stringify({
        session: authData.session,
        adminUser: adminUser,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[ADMIN_AUTH] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred during authentication' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
