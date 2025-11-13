-- Eliminar funciones existentes primero
DROP FUNCTION IF EXISTS public.search_blog_posts(text, text, text[], text, integer, integer, text);
DROP FUNCTION IF EXISTS public.count_blog_posts(text, text, text[], text, text);

-- Crear función search_blog_posts para soporte multilingüe
CREATE FUNCTION public.search_blog_posts(
  search_query text DEFAULT NULL,
  filter_category text DEFAULT NULL,
  filter_tags text[] DEFAULT NULL,
  filter_status text DEFAULT 'published',
  limit_count integer DEFAULT 10,
  offset_count integer DEFAULT 0,
  lang text DEFAULT 'es'
)
RETURNS TABLE (
  id uuid,
  title_es text,
  title_en text,
  slug_es text,
  slug_en text,
  excerpt_es text,
  excerpt_en text,
  content_es text,
  content_en text,
  category text,
  tags text[],
  read_time integer,
  view_count integer,
  featured_image text,
  published_at timestamptz,
  status text,
  relevance numeric,
  author_name text,
  author_specialization text
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title_es,
    bp.title_en,
    bp.slug_es,
    bp.slug_en,
    bp.excerpt_es,
    bp.excerpt_en,
    bp.content_es,
    bp.content_en,
    bp.category,
    bp.tags,
    bp.read_time,
    bp.view_count,
    bp.featured_image,
    bp.published_at,
    bp.status,
    CASE
      WHEN search_query IS NULL THEN 0::numeric
      WHEN (CASE lang
        WHEN 'en' THEN bp.title_en
        ELSE bp.title_es
      END) ILIKE '%' || search_query || '%' THEN 1.0
      WHEN (CASE lang
        WHEN 'en' THEN bp.excerpt_en
        ELSE bp.excerpt_es
      END) ILIKE '%' || search_query || '%' THEN 0.7
      WHEN (CASE lang
        WHEN 'en' THEN bp.content_en
        ELSE bp.content_es
      END) ILIKE '%' || search_query || '%' THEN 0.5
      ELSE 0::numeric
    END as relevance,
    bp.author_name,
    bp.author_specialization
  FROM public.blog_posts bp
  WHERE (filter_status IS NULL OR bp.status = filter_status)
    AND (search_query IS NULL OR 
         (CASE lang WHEN 'en' THEN bp.title_en ELSE bp.title_es END) ILIKE '%' || search_query || '%' OR
         (CASE lang WHEN 'en' THEN bp.excerpt_en ELSE bp.excerpt_es END) ILIKE '%' || search_query || '%' OR
         (CASE lang WHEN 'en' THEN bp.content_en ELSE bp.content_es END) ILIKE '%' || search_query || '%')
    AND (filter_category IS NULL OR bp.category = filter_category)
    AND (filter_tags IS NULL OR array_length(filter_tags, 1) IS NULL OR bp.tags && filter_tags)
  ORDER BY bp.published_at DESC NULLS LAST, relevance DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Crear función count_blog_posts para soporte multilingüe
CREATE FUNCTION public.count_blog_posts(
  search_query text DEFAULT NULL,
  filter_category text DEFAULT NULL,
  filter_tags text[] DEFAULT NULL,
  filter_status text DEFAULT 'published',
  lang text DEFAULT 'es'
)
RETURNS bigint
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result_count bigint;
BEGIN
  SELECT COUNT(*)
  INTO result_count
  FROM public.blog_posts bp
  WHERE (filter_status IS NULL OR bp.status = filter_status)
    AND (search_query IS NULL OR 
         (CASE lang WHEN 'en' THEN bp.title_en ELSE bp.title_es END) ILIKE '%' || search_query || '%' OR
         (CASE lang WHEN 'en' THEN bp.excerpt_en ELSE bp.excerpt_es END) ILIKE '%' || search_query || '%' OR
         (CASE lang WHEN 'en' THEN bp.content_en ELSE bp.content_es END) ILIKE '%' || search_query || '%')
    AND (filter_category IS NULL OR bp.category = filter_category)
    AND (filter_tags IS NULL OR array_length(filter_tags, 1) IS NULL OR bp.tags && filter_tags);
  
  RETURN result_count;
END;
$$;