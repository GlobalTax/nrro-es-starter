
-- Drop existing restrictive policy for contact_leads
DROP POLICY IF EXISTS "System can insert contact leads" ON public.contact_leads;

-- Create new policy allowing anonymous submissions for contact_leads
CREATE POLICY "Public can submit contact forms"
ON public.contact_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Verify and update ley_beckham_leads policy if needed
DROP POLICY IF EXISTS "Admins can insert Ley Beckham leads" ON public.ley_beckham_leads;

-- Ensure public submissions work for Ley Beckham
CREATE POLICY "Public can submit Ley Beckham forms"
ON public.ley_beckham_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
