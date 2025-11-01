-- Create enum for case study status
CREATE TYPE public.case_study_status AS ENUM ('draft', 'review', 'published', 'archived');

-- Create case_studies table
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  client_industry TEXT NOT NULL,
  client_size TEXT,
  project_duration TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Hero Section
  hero_image_url TEXT,
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT,
  
  -- Executive Summary
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results_summary TEXT NOT NULL,
  
  -- Metrics (JSONB array)
  metrics JSONB DEFAULT '[]'::jsonb,
  
  -- Detailed Content (Markdown)
  detailed_content TEXT,
  
  -- Timeline (JSONB array)
  timeline JSONB DEFAULT '[]'::jsonb,
  
  -- Testimonial
  testimonial_text TEXT,
  testimonial_author TEXT,
  testimonial_position TEXT,
  testimonial_avatar_url TEXT,
  
  -- Related Services (array of service IDs)
  related_services UUID[] DEFAULT '{}'::uuid[],
  
  -- Media Gallery (JSONB array)
  gallery JSONB DEFAULT '[]'::jsonb,
  
  -- Tags & Categories
  tags TEXT[] DEFAULT '{}'::text[],
  primary_service TEXT,
  
  -- Publishing
  status case_study_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- View Count
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX idx_case_studies_status ON public.case_studies(status);
CREATE INDEX idx_case_studies_featured ON public.case_studies(is_featured);
CREATE INDEX idx_case_studies_industry ON public.case_studies(client_industry);
CREATE INDEX idx_case_studies_service ON public.case_studies(primary_service);
CREATE INDEX idx_case_studies_tags ON public.case_studies USING GIN(tags);

-- Enable RLS
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view published case studies"
ON public.case_studies
FOR SELECT
USING (status = 'published');

CREATE POLICY "Authenticated users can view all case studies"
ON public.case_studies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Editors can create case studies"
ON public.case_studies
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role)
);

CREATE POLICY "Editors can update case studies"
ON public.case_studies
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role)
);

CREATE POLICY "Admins can delete case studies"
ON public.case_studies
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to search case studies
CREATE OR REPLACE FUNCTION public.search_case_studies(
  search_query TEXT DEFAULT NULL,
  filter_industry TEXT DEFAULT NULL,
  filter_service TEXT DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL,
  filter_status case_study_status DEFAULT 'published',
  limit_count INTEGER DEFAULT 12,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  client_name TEXT,
  client_logo_url TEXT,
  client_industry TEXT,
  hero_image_url TEXT,
  hero_subtitle TEXT,
  results_summary TEXT,
  metrics JSONB,
  tags TEXT[],
  primary_service TEXT,
  status case_study_status,
  is_featured BOOLEAN,
  view_count INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  relevance NUMERIC
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cs.id,
    cs.title,
    cs.slug,
    cs.client_name,
    cs.client_logo_url,
    cs.client_industry,
    cs.hero_image_url,
    cs.hero_subtitle,
    cs.results_summary,
    cs.metrics,
    cs.tags,
    cs.primary_service,
    cs.status,
    cs.is_featured,
    cs.view_count,
    cs.published_at,
    CASE
      WHEN search_query IS NULL THEN 0::numeric
      WHEN cs.title ILIKE '%' || search_query || '%' THEN 1.0
      WHEN cs.client_name ILIKE '%' || search_query || '%' THEN 0.9
      WHEN cs.hero_subtitle ILIKE '%' || search_query || '%' THEN 0.7
      WHEN cs.results_summary ILIKE '%' || search_query || '%' THEN 0.5
      ELSE 0::numeric
    END as relevance
  FROM public.case_studies cs
  WHERE (filter_status IS NULL OR cs.status = filter_status)
    AND (search_query IS NULL OR 
         cs.title ILIKE '%' || search_query || '%' OR
         cs.client_name ILIKE '%' || search_query || '%' OR
         cs.hero_subtitle ILIKE '%' || search_query || '%' OR
         cs.results_summary ILIKE '%' || search_query || '%')
    AND (filter_industry IS NULL OR cs.client_industry = filter_industry)
    AND (filter_service IS NULL OR cs.primary_service = filter_service)
    AND (filter_tags IS NULL OR array_length(filter_tags, 1) IS NULL OR cs.tags && filter_tags)
  ORDER BY cs.is_featured DESC, cs.published_at DESC NULLS LAST, relevance DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Function to get filter options
CREATE OR REPLACE FUNCTION public.get_case_studies_filter_options()
RETURNS TABLE (
  industries TEXT[],
  services TEXT[],
  all_tags TEXT[]
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    array_agg(DISTINCT cs.client_industry) FILTER (WHERE cs.client_industry IS NOT NULL) as industries,
    array_agg(DISTINCT cs.primary_service) FILTER (WHERE cs.primary_service IS NOT NULL) as services,
    array_agg(DISTINCT tag) FILTER (WHERE tag IS NOT NULL) as all_tags
  FROM public.case_studies cs
  CROSS JOIN LATERAL unnest(cs.tags) as tag
  WHERE cs.status = 'published';
END;
$$;

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_case_study_view_count(case_study_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.case_studies
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = case_study_id;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();