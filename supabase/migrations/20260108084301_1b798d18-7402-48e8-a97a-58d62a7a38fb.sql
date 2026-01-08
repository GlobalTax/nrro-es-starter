-- Create page_audits table for storing SEO audit results
CREATE TABLE public.page_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_page_id UUID REFERENCES public.site_pages(id) ON DELETE SET NULL,
  page_url TEXT NOT NULL,
  audit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  content_score INTEGER CHECK (content_score >= 0 AND content_score <= 100),
  structure_score INTEGER CHECK (structure_score >= 0 AND structure_score <= 100),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  issues JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  raw_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_page_audits_page_url ON public.page_audits(page_url);
CREATE INDEX idx_page_audits_site_page_id ON public.page_audits(site_page_id);
CREATE INDEX idx_page_audits_audit_date ON public.page_audits(audit_date DESC);

-- Enable RLS
ALTER TABLE public.page_audits ENABLE ROW LEVEL SECURITY;

-- Allow public read access (admin panel uses service role anyway)
CREATE POLICY "Allow public read access to page_audits"
ON public.page_audits
FOR SELECT
USING (true);

-- Allow insert for authenticated users
CREATE POLICY "Allow insert for authenticated users"
ON public.page_audits
FOR INSERT
WITH CHECK (true);

-- Allow delete for cleanup
CREATE POLICY "Allow delete for authenticated users"
ON public.page_audits
FOR DELETE
USING (true);