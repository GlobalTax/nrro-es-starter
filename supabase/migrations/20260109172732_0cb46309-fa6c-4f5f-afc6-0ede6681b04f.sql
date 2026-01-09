-- Tabla de presentaciones corporativas
CREATE TABLE public.corporate_presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'fiscal', 'legal', 'ma', 'laboral', 'sector')),
  format TEXT NOT NULL DEFAULT 'horizontal' CHECK (format IN ('horizontal', 'vertical')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  version INTEGER DEFAULT 1,
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en', 'ca')),
  is_active BOOLEAN DEFAULT true,
  target_audience TEXT,
  page_count INTEGER,
  tags TEXT[],
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.corporate_presentations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can view corporate_presentations" 
  ON public.corporate_presentations FOR SELECT USING (true);

CREATE POLICY "Admins can insert corporate_presentations" 
  ON public.corporate_presentations FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update corporate_presentations" 
  ON public.corporate_presentations FOR UPDATE USING (true);

CREATE POLICY "Admins can delete corporate_presentations" 
  ON public.corporate_presentations FOR DELETE USING (true);

-- Storage bucket for presentations
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('corporate-presentations', 'corporate-presentations', false, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Admins can upload corporate presentations"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'corporate-presentations');

CREATE POLICY "Admins can view corporate presentations"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'corporate-presentations');

CREATE POLICY "Admins can update corporate presentations"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'corporate-presentations');

CREATE POLICY "Admins can delete corporate presentations"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'corporate-presentations');

-- Trigger for updated_at
CREATE TRIGGER update_corporate_presentations_updated_at
  BEFORE UPDATE ON public.corporate_presentations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();