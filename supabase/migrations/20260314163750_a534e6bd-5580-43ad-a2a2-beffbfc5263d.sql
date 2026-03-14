
-- Create prerender_cache table
CREATE TABLE public.prerender_cache (
  path TEXT PRIMARY KEY,
  html_snapshot TEXT,
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  h2s JSONB DEFAULT '[]'::jsonb,
  internal_links JSONB DEFAULT '[]'::jsonb,
  internal_link_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  rendered_at TIMESTAMPTZ,
  source TEXT DEFAULT 'registry',
  health TEXT DEFAULT 'red',
  extraction_notes JSONB DEFAULT '[]'::jsonb,
  full_record BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.prerender_cache ENABLE ROW LEVEL SECURITY;

-- Service role can read/write (implicit via service key bypass)
-- Admin role can read
CREATE POLICY "Admins can read prerender_cache"
  ON public.prerender_cache
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Block anonymous access (no policy for anon = blocked by default with RLS enabled)
