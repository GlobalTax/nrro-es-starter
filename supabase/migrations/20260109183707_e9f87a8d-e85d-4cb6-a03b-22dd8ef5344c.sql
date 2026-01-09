-- Create internal_tools table for the tools hub
CREATE TABLE public.internal_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  login_url TEXT NOT NULL,
  icon TEXT DEFAULT 'ExternalLink',
  category TEXT DEFAULT 'admin',
  color TEXT DEFAULT 'primary',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.internal_tools ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated admin users can view active tools
CREATE POLICY "Authenticated users can view active tools"
ON public.internal_tools
FOR SELECT
USING (is_active = true);

-- Policy: Admins can view all tools (including inactive)
CREATE POLICY "Admins can view all tools"
ON public.internal_tools
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Only admins can insert tools
CREATE POLICY "Admins can insert tools"
ON public.internal_tools
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Only admins can update tools
CREATE POLICY "Admins can update tools"
ON public.internal_tools
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Only admins can delete tools
CREATE POLICY "Admins can delete tools"
ON public.internal_tools
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_internal_tools_updated_at
BEFORE UPDATE ON public.internal_tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some example tools
INSERT INTO public.internal_tools (name, description, login_url, icon, category, color, sort_order) VALUES
('Panel Navarro', 'Panel de administración principal', '/admin', 'LayoutDashboard', 'admin', 'primary', 1),
('Gestión de Blog', 'Crear y editar artículos del blog', '/admin/blog', 'FileText', 'admin', 'blue', 2),
('Leads Contacto', 'Gestión de leads de contacto', '/admin/contact-leads', 'Users', 'comercial', 'green', 3),
('Candidatos', 'Gestión de candidatos y RRHH', '/admin/candidatos', 'UserCheck', 'rrhh', 'purple', 4);