-- Drop and recreate the search_blog_posts function to include slug_es and slug_en
DROP FUNCTION IF EXISTS public.search_blog_posts(text, text, text, text[], integer, integer, text, text);

CREATE OR REPLACE FUNCTION public.search_blog_posts(
  lang text DEFAULT 'es',
  search_query text DEFAULT NULL,
  filter_category text DEFAULT NULL,
  filter_tags text[] DEFAULT NULL,
  limit_count integer DEFAULT 10,
  offset_count integer DEFAULT 0,
  filter_status text DEFAULT 'published',
  filter_site text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  slug_es text,
  slug_en text,
  excerpt text,
  content text,
  featured_image text,
  category text,
  tags text[],
  status text,
  author_name text,
  author_specialization text,
  read_time integer,
  view_count integer,
  published_at timestamptz,
  created_at timestamptz,
  source_site text,
  shared_sites text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    CASE 
      WHEN lang = 'en' AND bp.title_en IS NOT NULL THEN bp.title_en
      ELSE bp.title_es
    END AS title,
    CASE 
      WHEN lang = 'en' AND bp.slug_en IS NOT NULL THEN bp.slug_en
      ELSE bp.slug_es
    END AS slug,
    bp.slug_es,
    bp.slug_en,
    CASE 
      WHEN lang = 'en' AND bp.excerpt_en IS NOT NULL THEN bp.excerpt_en
      ELSE bp.excerpt_es
    END AS excerpt,
    CASE 
      WHEN lang = 'en' AND bp.content_en IS NOT NULL THEN bp.content_en
      ELSE bp.content_es
    END AS content,
    bp.featured_image,
    bp.category,
    bp.tags,
    bp.status,
    bp.author_name,
    bp.author_specialization,
    bp.read_time,
    bp.view_count,
    bp.published_at,
    bp.created_at,
    bp.source_site::text,
    COALESCE(bp.shared_sites, '{}')
  FROM public.blog_posts bp
  WHERE 
    (filter_status IS NULL OR bp.status = filter_status)
    AND (filter_category IS NULL OR bp.category = filter_category)
    AND (filter_tags IS NULL OR bp.tags && filter_tags)
    AND (search_query IS NULL OR 
         bp.title_es ILIKE '%' || search_query || '%' OR
         bp.title_en ILIKE '%' || search_query || '%' OR
         bp.excerpt_es ILIKE '%' || search_query || '%' OR
         bp.excerpt_en ILIKE '%' || search_query || '%' OR
         bp.content_es ILIKE '%' || search_query || '%' OR
         bp.content_en ILIKE '%' || search_query || '%')
    AND (filter_site IS NULL OR 
         bp.source_site::text = filter_site OR 
         filter_site = ANY(COALESCE(bp.shared_sites, '{}')))
  ORDER BY bp.published_at DESC NULLS LAST, bp.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;