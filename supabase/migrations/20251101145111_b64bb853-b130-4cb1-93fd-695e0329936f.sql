-- Crear tabla para configuraciones del sitio
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_site_settings_key ON public.site_settings(key);
CREATE INDEX idx_site_settings_category ON public.site_settings(category);

-- RLS Policies
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer (público)
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Solo admins pueden insertar/actualizar/eliminar
CREATE POLICY "Admins can insert site settings"
  ON public.site_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para actualizar updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar valores iniciales
INSERT INTO public.site_settings (key, value, description, category) VALUES
  ('social_instagram', 'https://www.instagram.com/navarrotaxlegal', 'URL del perfil de Instagram', 'social'),
  ('social_twitter', 'https://www.twitter.com/navarrotaxlegal', 'URL del perfil de Twitter/X', 'social'),
  ('social_facebook', 'https://www.facebook.com/navarrotaxlegal', 'URL de la página de Facebook', 'social'),
  ('social_linkedin', 'https://www.linkedin.com/company/navarro-tax-legal/', 'URL de la página de LinkedIn', 'social'),
  ('contact_phone', '+34934593600', 'Teléfono de contacto principal', 'contact'),
  ('contact_email', 'info@nrro.es', 'Email de contacto principal', 'contact'),
  ('contact_phone_display', '934593600', 'Teléfono formateado para mostrar', 'contact');