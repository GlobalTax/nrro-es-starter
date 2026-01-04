-- Create resource_downloads table for lead capture
CREATE TABLE IF NOT EXISTS public.resource_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  
  -- Lead info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  
  -- Consent
  accepts_marketing BOOLEAN DEFAULT false,
  
  -- Tracking
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_site TEXT DEFAULT 'navarro'
);

-- Enable RLS
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (for lead capture)
CREATE POLICY "Anyone can submit download requests"
  ON public.resource_downloads
  FOR INSERT
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resource_downloads_email ON public.resource_downloads(email);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource ON public.resource_downloads(resource_id);