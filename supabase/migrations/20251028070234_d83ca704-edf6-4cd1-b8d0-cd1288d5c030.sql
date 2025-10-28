-- Create services table
CREATE TABLE public.services (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  
  -- Información básica
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  area TEXT NOT NULL CHECK (area IN ('Fiscal', 'Contable', 'Legal', 'Laboral')),
  
  -- Contenido estructurado
  features TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT,
  typical_clients TEXT[] NOT NULL DEFAULT '{}',
  
  -- Metodología (JSON)
  metodologia JSONB,
  
  -- Servicios transversales (JSON Array)
  servicios_transversales JSONB,
  
  -- Estadísticas (JSON Array)
  stats JSONB,
  
  -- Control de publicación
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT
);

-- Índices
CREATE INDEX idx_services_slug ON public.services(slug);
CREATE INDEX idx_services_area ON public.services(area);
CREATE INDEX idx_services_active ON public.services(is_active);
CREATE INDEX idx_services_display_order ON public.services(display_order);

-- Trigger para updated_at
CREATE TRIGGER update_services_updated_at 
  BEFORE UPDATE ON public.services
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- 1. Lectura pública de servicios activos
CREATE POLICY "Public can view active services"
  ON public.services
  FOR SELECT
  USING (is_active = true);

-- 2. Usuarios autenticados pueden ver todos los servicios
CREATE POLICY "Authenticated users can view all services"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Editores y admins pueden crear servicios
CREATE POLICY "Editors can create services"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role)
  );

-- 4. Editores y admins pueden actualizar servicios
CREATE POLICY "Editors can update services"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role)
  );

-- 5. Solo admins pueden eliminar servicios
CREATE POLICY "Admins can delete services"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));