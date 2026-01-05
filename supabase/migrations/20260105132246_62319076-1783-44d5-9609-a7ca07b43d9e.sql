-- Add slug and extended content fields to resources table
ALTER TABLE public.resources 
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS content text,
  ADD COLUMN IF NOT EXISTS toc text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS benefits text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS target_audience text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS preview_pages integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS read_time integer DEFAULT 5;

-- Generate slugs for existing resources based on title
UPDATE public.resources 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[áàäâã]', 'a', 'gi'),
      '[éèëê]', 'e', 'gi'
    ),
    '[^a-z0-9\s-]', '', 'gi'
  )
)
WHERE slug IS NULL;

-- Replace spaces with hyphens
UPDATE public.resources 
SET slug = REGEXP_REPLACE(slug, '\s+', '-', 'g')
WHERE slug IS NOT NULL;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_resources_slug ON public.resources(slug);