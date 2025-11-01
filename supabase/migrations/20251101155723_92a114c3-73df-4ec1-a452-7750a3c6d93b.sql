-- Add author information to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author_name text,
ADD COLUMN IF NOT EXISTS author_specialization text;

-- Update existing posts with default author data
UPDATE blog_posts 
SET 
  author_name = 'Carlos Navarro',
  author_specialization = 'Derecho Fiscal'
WHERE author_name IS NULL;

-- Drop existing function to modify return type
DROP FUNCTION IF EXISTS public.search_blog_posts(text, text, text[], text, integer, integer, text);

-- Recreate search_blog_posts function with author fields
CREATE OR REPLACE FUNCTION public.search_blog_posts(
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
  slug_es text,
  excerpt_es text,
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
    bp.slug_es,
    bp.excerpt_es,
    bp.category,
    bp.tags,
    bp.read_time,
    bp.view_count,
    bp.featured_image,
    bp.published_at,
    bp.status,
    CASE
      WHEN search_query IS NULL THEN 0::numeric
      WHEN bp.title_es ILIKE '%' || search_query || '%' THEN 1.0
      WHEN bp.excerpt_es ILIKE '%' || search_query || '%' THEN 0.7
      WHEN bp.content_es ILIKE '%' || search_query || '%' THEN 0.5
      ELSE 0::numeric
    END as relevance,
    bp.author_name,
    bp.author_specialization
  FROM public.blog_posts bp
  WHERE (filter_status IS NULL OR bp.status = filter_status)
    AND (search_query IS NULL OR 
         bp.title_es ILIKE '%' || search_query || '%' OR
         bp.excerpt_es ILIKE '%' || search_query || '%' OR
         bp.content_es ILIKE '%' || search_query || '%')
    AND (filter_category IS NULL OR bp.category = filter_category)
    AND (filter_tags IS NULL OR array_length(filter_tags, 1) IS NULL OR bp.tags && filter_tags)
  ORDER BY bp.published_at DESC NULLS LAST, relevance DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;