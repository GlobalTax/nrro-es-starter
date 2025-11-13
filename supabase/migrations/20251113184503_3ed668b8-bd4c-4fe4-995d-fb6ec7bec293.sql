-- Update search_case_studies function to return language-specific fields
DROP FUNCTION IF EXISTS public.search_case_studies(text, text, text, text[], case_study_status, integer, integer);

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
  relevance NUMERIC,
  title_es TEXT,
  title_ca TEXT,
  title_en TEXT,
  slug_es TEXT,
  slug_ca TEXT,
  slug_en TEXT,
  hero_title_es TEXT,
  hero_title_ca TEXT,
  hero_title_en TEXT,
  hero_subtitle_es TEXT,
  hero_subtitle_ca TEXT,
  hero_subtitle_en TEXT,
  challenge_es TEXT,
  challenge_ca TEXT,
  challenge_en TEXT,
  solution_es TEXT,
  solution_ca TEXT,
  solution_en TEXT,
  results_summary_es TEXT,
  results_summary_ca TEXT,
  results_summary_en TEXT
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
    END as relevance,
    cs.title_es,
    cs.title_ca,
    cs.title_en,
    cs.slug_es,
    cs.slug_ca,
    cs.slug_en,
    cs.hero_title_es,
    cs.hero_title_ca,
    cs.hero_title_en,
    cs.hero_subtitle_es,
    cs.hero_subtitle_ca,
    cs.hero_subtitle_en,
    cs.challenge_es,
    cs.challenge_ca,
    cs.challenge_en,
    cs.solution_es,
    cs.solution_ca,
    cs.solution_en,
    cs.results_summary_es,
    cs.results_summary_ca,
    cs.results_summary_en
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