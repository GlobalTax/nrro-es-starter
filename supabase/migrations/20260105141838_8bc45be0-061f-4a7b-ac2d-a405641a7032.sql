-- Add shared_sites column to blog_posts for selective synchronization
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS shared_sites text[] DEFAULT '{}';

-- Create GIN index for efficient array searches
CREATE INDEX IF NOT EXISTS idx_blog_posts_shared_sites ON public.blog_posts USING GIN(shared_sites);

-- Update search_blog_posts function to filter by site with shared logic
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
  title text,
  slug text,
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

-- Update count_blog_posts function with the same filter logic
CREATE OR REPLACE FUNCTION public.count_blog_posts(
  search_query text DEFAULT NULL,
  filter_category text DEFAULT NULL,
  filter_tags text[] DEFAULT NULL,
  filter_status text DEFAULT 'published',
  lang text DEFAULT 'es',
  filter_site text DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count bigint;
BEGIN
  SELECT COUNT(*)
  INTO total_count
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
         filter_site = ANY(COALESCE(bp.shared_sites, '{}')));
  
  RETURN total_count;
END;
$$;