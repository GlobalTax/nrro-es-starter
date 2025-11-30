-- Create enum types for site_pages
CREATE TYPE page_type AS ENUM (
  'home',
  'service',
  'landing',
  'blog',
  'case_study',
  'legal',
  'contact',
  'about',
  'careers',
  'job_position',
  'other'
);

CREATE TYPE page_status AS ENUM (
  'published',
  'draft',
  'archived',
  'redirect'
);

CREATE TYPE traffic_source AS ENUM (
  'seo',
  'sem',
  'social',
  'email',
  'referral',
  'direct',
  'other'
);

-- Create site_pages table
CREATE TABLE IF NOT EXISTS public.site_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  page_type page_type NOT NULL DEFAULT 'other',
  source_table TEXT,
  source_id UUID,
  language TEXT NOT NULL DEFAULT 'es',
  business_area TEXT,
  owner TEXT,
  status page_status NOT NULL DEFAULT 'published',
  meta_title TEXT,
  meta_description TEXT,
  is_noindex BOOLEAN DEFAULT false,
  is_landing BOOLEAN DEFAULT false,
  campaign_name TEXT,
  traffic_source traffic_source,
  conversion_goal TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_site_pages_url ON public.site_pages(url);
CREATE INDEX idx_site_pages_page_type ON public.site_pages(page_type);
CREATE INDEX idx_site_pages_language ON public.site_pages(language);
CREATE INDEX idx_site_pages_status ON public.site_pages(status);
CREATE INDEX idx_site_pages_source ON public.site_pages(source_table, source_id);
CREATE INDEX idx_site_pages_is_landing ON public.site_pages(is_landing);

-- Add trigger for updated_at
CREATE TRIGGER update_site_pages_updated_at
  BEFORE UPDATE ON public.site_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all site pages"
  ON public.site_pages
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert site pages"
  ON public.site_pages
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site pages"
  ON public.site_pages
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site pages"
  ON public.site_pages
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Initial data migration: Landing Pages
INSERT INTO public.site_pages (
  url, title, page_type, source_table, source_id, language, 
  business_area, status, meta_title, meta_description, 
  is_landing, campaign_name, last_updated
)
SELECT 
  COALESCE(url, CONCAT('https://nrro.es/', slug)) as url,
  title as title,
  'landing'::page_type as page_type,
  'landing_pages' as source_table,
  id as source_id,
  'es' as language,
  category as business_area,
  CASE 
    WHEN status = 'published' AND is_active THEN 'published'::page_status
    WHEN status = 'draft' THEN 'draft'::page_status
    ELSE 'archived'::page_status
  END as status,
  meta_title,
  meta_description,
  true as is_landing,
  ads_campaigns as campaign_name,
  updated_at as last_updated
FROM public.landing_pages
WHERE slug IS NOT NULL;

-- Initial data migration: Services (Spanish)
INSERT INTO public.site_pages (
  url, title, page_type, source_table, source_id, language, 
  business_area, status, meta_title, meta_description, last_updated
)
SELECT 
  CONCAT('https://nrro.es/servicios/', slug_es) as url,
  name_es as title,
  'service'::page_type as page_type,
  'services' as source_table,
  id as source_id,
  'es' as language,
  area_es as business_area,
  CASE 
    WHEN is_active THEN 'published'::page_status
    ELSE 'archived'::page_status
  END as status,
  meta_title,
  meta_description,
  updated_at as last_updated
FROM public.services
WHERE slug_es IS NOT NULL;

-- Initial data migration: Services (Catalan)
INSERT INTO public.site_pages (
  url, title, page_type, source_table, source_id, language, 
  business_area, status, last_updated
)
SELECT 
  CONCAT('https://nrro.es/ca/serveis/', slug_ca) as url,
  name_ca as title,
  'service'::page_type as page_type,
  'services' as source_table,
  id as source_id,
  'ca' as language,
  area_ca as business_area,
  CASE 
    WHEN is_active THEN 'published'::page_status
    ELSE 'archived'::page_status
  END as status,
  updated_at as last_updated
FROM public.services
WHERE slug_ca IS NOT NULL;

-- Initial data migration: Services (English)
INSERT INTO public.site_pages (
  url, title, page_type, source_table, source_id, language, 
  business_area, status, last_updated
)
SELECT 
  CONCAT('https://nrro.es/en/services/', slug_en) as url,
  name_en as title,
  'service'::page_type as page_type,
  'services' as source_table,
  id as source_id,
  'en' as language,
  area_en as business_area,
  CASE 
    WHEN is_active THEN 'published'::page_status
    ELSE 'archived'::page_status
  END as status,
  updated_at as last_updated
FROM public.services
WHERE slug_en IS NOT NULL;

-- Initial data migration: Blog Posts (Spanish)
INSERT INTO public.site_pages (
  url, title, page_type, source_table, source_id, language, 
  status, meta_title, meta_description, last_updated
)
SELECT 
  CONCAT('https://nrro.es/blog/', slug_es) as url,
  title_es as title,
  'blog'::page_type as page_type,
  'blog_posts' as source_table,
  id as source_id,
  'es' as language,
  CASE 
    WHEN status = 'published' THEN 'published'::page_status
    WHEN status = 'draft' THEN 'draft'::page_status
    ELSE 'archived'::page_status
  END as status,
  seo_title_es as meta_title,
  seo_description_es as meta_description,
  updated_at as last_updated
FROM public.blog_posts
WHERE slug_es IS NOT NULL;

-- Initial data migration: Blog Posts (English)
INSERT INTO public.site_pages (
  url, title, page_type, source_table, source_id, language, 
  status, meta_title, meta_description, last_updated
)
SELECT 
  CONCAT('https://nrro.es/en/blog/', slug_en) as url,
  title_en as title,
  'blog'::page_type as page_type,
  'blog_posts' as source_table,
  id as source_id,
  'en' as language,
  CASE 
    WHEN status = 'published' THEN 'published'::page_status
    WHEN status = 'draft' THEN 'draft'::page_status
    ELSE 'archived'::page_status
  END as status,
  seo_title_en as meta_title,
  seo_description_en as meta_description,
  updated_at as last_updated
FROM public.blog_posts
WHERE slug_en IS NOT NULL;

-- Initial data migration: Case Studies (Spanish)
INSERT INTO public.site_pages (
  url, title, page_type, source_table, source_id, language, 
  status, meta_title, meta_description, last_updated
)
SELECT 
  CONCAT('https://nrro.es/casos-exito/', slug_es) as url,
  title_es as title,
  'case_study'::page_type as page_type,
  'case_studies' as source_table,
  id as source_id,
  'es' as language,
  CASE 
    WHEN status = 'published' THEN 'published'::page_status
    WHEN status = 'draft' THEN 'draft'::page_status
    ELSE 'archived'::page_status
  END as status,
  meta_title_es as meta_title,
  meta_description_es as meta_description,
  updated_at as last_updated
FROM public.case_studies
WHERE slug_es IS NOT NULL;

-- Initial data migration: Job Positions (Spanish)
INSERT INTO public.site_pages (
  url, title, page_type, source_table, source_id, language, 
  business_area, status, last_updated
)
SELECT 
  CONCAT('https://nrro.es/empleo/', slug_es) as url,
  title_es as title,
  'job_position'::page_type as page_type,
  'job_positions' as source_table,
  id as source_id,
  'es' as language,
  department as business_area,
  CASE 
    WHEN status = 'published' THEN 'published'::page_status
    WHEN status = 'draft' THEN 'draft'::page_status
    ELSE 'archived'::page_status
  END as status,
  updated_at as last_updated
FROM public.job_positions
WHERE slug_es IS NOT NULL;

-- Static pages (Spanish)
INSERT INTO public.site_pages (url, title, page_type, language, status, source_table) VALUES
  ('https://nrro.es/', 'Inicio', 'home', 'es', 'published', 'static'),
  ('https://nrro.es/servicios', 'Servicios', 'service', 'es', 'published', 'static'),
  ('https://nrro.es/blog', 'Blog', 'blog', 'es', 'published', 'static'),
  ('https://nrro.es/casos-exito', 'Casos de Éxito', 'case_study', 'es', 'published', 'static'),
  ('https://nrro.es/nosotros', 'Nosotros', 'about', 'es', 'published', 'static'),
  ('https://nrro.es/equipo', 'Equipo', 'about', 'es', 'published', 'static'),
  ('https://nrro.es/contacto', 'Contacto', 'contact', 'es', 'published', 'static'),
  ('https://nrro.es/empleo', 'Empleo', 'careers', 'es', 'published', 'static'),
  ('https://nrro.es/aviso-legal', 'Aviso Legal', 'legal', 'es', 'published', 'static'),
  ('https://nrro.es/politica-privacidad', 'Política de Privacidad', 'legal', 'es', 'published', 'static'),
  ('https://nrro.es/politica-cookies', 'Política de Cookies', 'legal', 'es', 'published', 'static');

-- Static pages (English)
INSERT INTO public.site_pages (url, title, page_type, language, status, source_table) VALUES
  ('https://nrro.es/en/', 'Home', 'home', 'en', 'published', 'static'),
  ('https://nrro.es/en/services', 'Services', 'service', 'en', 'published', 'static'),
  ('https://nrro.es/en/blog', 'Blog', 'blog', 'en', 'published', 'static'),
  ('https://nrro.es/en/about', 'About', 'about', 'en', 'published', 'static'),
  ('https://nrro.es/en/team', 'Team', 'about', 'en', 'published', 'static'),
  ('https://nrro.es/en/contact', 'Contact', 'contact', 'en', 'published', 'static'),
  ('https://nrro.es/en/careers', 'Careers', 'careers', 'en', 'published', 'static');

-- Static pages (Catalan)
INSERT INTO public.site_pages (url, title, page_type, language, status, source_table) VALUES
  ('https://nrro.es/ca/', 'Inici', 'home', 'ca', 'published', 'static'),
  ('https://nrro.es/ca/serveis', 'Serveis', 'service', 'ca', 'published', 'static'),
  ('https://nrro.es/ca/blog', 'Blog', 'blog', 'ca', 'published', 'static'),
  ('https://nrro.es/ca/nosaltres', 'Nosaltres', 'about', 'ca', 'published', 'static'),
  ('https://nrro.es/ca/equip', 'Equip', 'about', 'ca', 'published', 'static'),
  ('https://nrro.es/ca/contacte', 'Contacte', 'contact', 'ca', 'published', 'static'),
  ('https://nrro.es/ca/ocupacio', 'Ocupació', 'careers', 'ca', 'published', 'static')
ON CONFLICT (url) DO NOTHING;