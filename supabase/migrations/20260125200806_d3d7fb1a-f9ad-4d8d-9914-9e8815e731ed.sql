-- ===========================================
-- RLS Policies for topbar_config (UPDATE only)
-- ===========================================

CREATE POLICY "Admins can update topbar_config" 
ON public.topbar_config 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===========================================
-- RLS Policies for topbar_links (INSERT, UPDATE, DELETE)
-- ===========================================

CREATE POLICY "Admins can insert topbar_links" 
ON public.topbar_links 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update topbar_links" 
ON public.topbar_links 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete topbar_links" 
ON public.topbar_links 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- ===========================================
-- RLS Policies for topbar_group_companies (INSERT, UPDATE, DELETE)
-- ===========================================

CREATE POLICY "Admins can insert topbar_group_companies" 
ON public.topbar_group_companies 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update topbar_group_companies" 
ON public.topbar_group_companies 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete topbar_group_companies" 
ON public.topbar_group_companies 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));