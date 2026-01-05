-- Drop the broken function that references non-existent _ca columns
DROP FUNCTION IF EXISTS public.search_blog_posts(text, text, text[], text, integer, integer, text, text);

-- Recreate with correct columns (only ES and EN, no CA)
CREATE OR REPLACE FUNCTION public.search_blog_posts(
  search_query text DEFAULT NULL,
  filter_category text DEFAULT NULL,
  filter_tags text[] DEFAULT NULL,
  filter_status text DEFAULT 'published',
  limit_count integer DEFAULT 10,
  offset_count integer DEFAULT 0,
  lang text DEFAULT 'es',
  filter_site text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  slug text,
  slug_es text,
  slug_en text,
  title text,
  excerpt text,
  content text,
  category text,
  tags text[],
  featured_image text,
  author_name text,
  author_specialization text,
  published_at timestamptz,
  created_at timestamptz,
  read_time integer,
  status text,
  view_count integer,
  source_site text,
  shared_sites text[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bp.id,
    CASE WHEN lang = 'en' AND bp.slug_en IS NOT NULL THEN bp.slug_en ELSE bp.slug_es END AS slug,
    bp.slug_es,
    bp.slug_en,
    CASE WHEN lang = 'en' AND bp.title_en IS NOT NULL THEN bp.title_en 
         ELSE bp.title_es END AS title,
    CASE WHEN lang = 'en' AND bp.excerpt_en IS NOT NULL THEN bp.excerpt_en
         ELSE bp.excerpt_es END AS excerpt,
    CASE WHEN lang = 'en' AND bp.content_en IS NOT NULL THEN bp.content_en
         ELSE bp.content_es END AS content,
    bp.category,
    bp.tags,
    bp.featured_image,
    bp.author_name,
    bp.author_specialization,
    bp.published_at,
    bp.created_at,
    bp.read_time,
    bp.status,
    COALESCE(bp.view_count, 0)::integer AS view_count,
    bp.source_site::text,
    bp.shared_sites::text[]
  FROM blog_posts bp
  WHERE
    (filter_status IS NULL OR bp.status = filter_status)
    AND (filter_category IS NULL OR bp.category = filter_category)
    AND (filter_tags IS NULL OR bp.tags && filter_tags)
    AND (filter_site IS NULL OR bp.source_site::text = filter_site OR (bp.shared_sites IS NOT NULL AND filter_site = ANY(bp.shared_sites)))
    AND (
      search_query IS NULL 
      OR bp.title_es ILIKE '%' || search_query || '%'
      OR bp.title_en ILIKE '%' || search_query || '%'
      OR bp.excerpt_es ILIKE '%' || search_query || '%'
      OR bp.excerpt_en ILIKE '%' || search_query || '%'
    )
  ORDER BY bp.published_at DESC NULLS LAST, bp.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;