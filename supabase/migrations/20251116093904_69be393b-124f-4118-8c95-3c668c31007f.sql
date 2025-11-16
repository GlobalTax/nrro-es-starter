-- Crear enum para roles de aplicación (si no existe)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user', 'hr_viewer', 'marketing');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Crear tabla landing_pages
CREATE TABLE IF NOT EXISTS public.landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  slug_es TEXT,
  slug_ca TEXT,
  slug_en TEXT,
  
  -- Metadata
  title TEXT NOT NULL,
  title_es TEXT,
  title_ca TEXT,
  title_en TEXT,
  
  meta_title TEXT,
  meta_title_es TEXT,
  meta_title_ca TEXT,
  meta_title_en TEXT,
  
  meta_description TEXT,
  meta_description_es TEXT,
  meta_description_ca TEXT,
  meta_description_en TEXT,
  
  keywords TEXT[],
  
  -- Content structure (JSONB para flexibilidad)
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Configuración
  layout_type TEXT DEFAULT 'default',
  use_navbar BOOLEAN DEFAULT true,
  use_footer BOOLEAN DEFAULT true,
  custom_navbar TEXT DEFAULT 'default',
  
  -- CTA Configuration
  primary_cta_text TEXT,
  primary_cta_text_es TEXT,
  primary_cta_text_ca TEXT,
  primary_cta_text_en TEXT,
  primary_cta_url TEXT,
  primary_cta_variant TEXT DEFAULT 'default',
  
  secondary_cta_text TEXT,
  secondary_cta_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft',
  is_active BOOLEAN DEFAULT true,
  
  -- Featured image
  featured_image TEXT,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON public.landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON public.landing_pages(status);
CREATE INDEX IF NOT EXISTS idx_landing_pages_is_active ON public.landing_pages(is_active);

-- RLS Policies
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- Públicas pueden ser leídas por todos
CREATE POLICY "Landing pages públicas son visibles para todos"
  ON public.landing_pages
  FOR SELECT
  USING (status = 'published' AND is_active = true);

-- Admins y editores pueden hacer todo
CREATE POLICY "Admins y editores pueden gestionar landing pages"
  ON public.landing_pages
  FOR ALL
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role) OR 
    has_role(auth.uid(), 'marketing'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role) OR 
    has_role(auth.uid(), 'marketing'::app_role)
  );

-- Crear tabla landing_sections (componentes reutilizables)
CREATE TABLE IF NOT EXISTS public.landing_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  component_type TEXT NOT NULL,
  default_props JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para landing_sections
ALTER TABLE public.landing_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden leer secciones activas"
  ON public.landing_sections
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins y editores pueden gestionar secciones"
  ON public.landing_sections
  FOR ALL
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role) OR 
    has_role(auth.uid(), 'marketing'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role) OR 
    has_role(auth.uid(), 'marketing'::app_role)
  );