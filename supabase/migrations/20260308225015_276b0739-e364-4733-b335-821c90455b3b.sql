
CREATE TABLE public.blog_research_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  site_url text NOT NULL,
  site_name text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_research_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read research sources"
  ON public.blog_research_sources FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert research sources"
  ON public.blog_research_sources FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update research sources"
  ON public.blog_research_sources FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete research sources"
  ON public.blog_research_sources FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_blog_research_sources_updated_at
  BEFORE UPDATE ON public.blog_research_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default sources
INSERT INTO public.blog_research_sources (category, site_url, site_name, priority) VALUES
  ('Fiscal', 'boe.es', 'BOE', 5),
  ('Fiscal', 'agenciatributaria.es', 'Agencia Tributaria', 5),
  ('Fiscal', 'expansion.com', 'Expansión', 3),
  ('Fiscal', 'cincodias.elpais.com', 'Cinco Días', 3),
  ('Mercantil', 'elderecho.com', 'El Derecho', 4),
  ('Mercantil', 'lawyerpress.com', 'Lawyer Press', 3),
  ('Mercantil', 'legaltoday.com', 'Legal Today', 3),
  ('Laboral', 'mites.gob.es', 'MITES', 5),
  ('Laboral', 'noticias.juridicas.com', 'Noticias Jurídicas', 4),
  ('Laboral', 'iberley.es', 'Iberley', 3),
  ('Corporativo', 'cuatrecasas.com', 'Cuatrecasas Blog', 3),
  ('Corporativo', 'garrigues.com', 'Garrigues', 3);
