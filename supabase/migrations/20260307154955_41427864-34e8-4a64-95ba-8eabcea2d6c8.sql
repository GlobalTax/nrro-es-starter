
-- Translation cache table
CREATE TABLE public.translation_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_hash text NOT NULL,
  source_lang text NOT NULL DEFAULT 'es',
  target_lang text NOT NULL,
  source_text text NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NOT NULL DEFAULT now(),
  hit_count integer NOT NULL DEFAULT 0,
  UNIQUE (source_hash, source_lang, target_lang)
);

-- Index for fast lookups
CREATE INDEX idx_translation_cache_lookup ON public.translation_cache (source_hash, source_lang, target_lang);

-- Enable RLS (only service_role can access)
ALTER TABLE public.translation_cache ENABLE ROW LEVEL SECURITY;

-- Cleanup function for entries unused in 90 days
CREATE OR REPLACE FUNCTION public.cleanup_old_translation_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.translation_cache
  WHERE last_used_at < now() - interval '90 days';
END;
$$;
