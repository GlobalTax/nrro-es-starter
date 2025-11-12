-- Grant INSERT permissions for public forms
-- This allows anonymous and authenticated users to submit forms

-- 1. Contact form (general inquiries)
GRANT INSERT ON public.contact_leads TO anon, authenticated;

-- 2. Ley Beckham lead form
GRANT INSERT ON public.ley_beckham_leads TO anon, authenticated;

-- 3. Demo requests form (Orquest + KairosHR)
GRANT INSERT ON public.demo_requests TO anon, authenticated;

-- 4. Security events (used by edge functions for logging)
GRANT INSERT ON public.security_events TO anon, authenticated;

-- 5. Rate limit tracking (used by edge functions for rate limiting)
GRANT INSERT, UPDATE, SELECT ON public.rate_limit_tracking TO anon, authenticated;