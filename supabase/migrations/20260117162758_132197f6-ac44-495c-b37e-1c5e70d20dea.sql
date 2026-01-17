-- Create news_automation_settings table
CREATE TABLE public.news_automation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  run_time TIME NOT NULL DEFAULT '08:00:00',
  articles_per_run INTEGER NOT NULL DEFAULT 3,
  auto_publish BOOLEAN NOT NULL DEFAULT true,
  default_sources TEXT[] DEFAULT ARRAY['BOE', 'AEAT', 'CGPJ'],
  default_categories TEXT[] DEFAULT ARRAY['Fiscal', 'Mercantil', 'Laboral'],
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  notify_on_generation BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_automation_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read/write (admin functionality)
CREATE POLICY "Authenticated users can read news automation settings"
ON public.news_automation_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update news automation settings"
ON public.news_automation_settings FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert news automation settings"
ON public.news_automation_settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Insert default settings
INSERT INTO public.news_automation_settings (id) VALUES (gen_random_uuid());

-- Add columns to news_articles if they don't exist
ALTER TABLE public.news_articles 
  ADD COLUMN IF NOT EXISTS source_name TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS generated_with_ai BOOLEAN DEFAULT false;

-- Create trigger for updated_at on news_automation_settings
CREATE TRIGGER update_news_automation_settings_updated_at
BEFORE UPDATE ON public.news_automation_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();