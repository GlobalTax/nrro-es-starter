-- Tabla para almacenar historial de métricas del sitemap
CREATE TABLE IF NOT EXISTS public.sitemap_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Métricas principales
  total_urls INTEGER NOT NULL,
  file_size INTEGER NOT NULL,
  
  -- URLs por idioma
  urls_es INTEGER NOT NULL DEFAULT 0,
  urls_ca INTEGER NOT NULL DEFAULT 0,
  urls_en INTEGER NOT NULL DEFAULT 0,
  
  -- URLs por tipo de contenido
  urls_static INTEGER NOT NULL DEFAULT 0,
  urls_services INTEGER NOT NULL DEFAULT 0,
  urls_blog INTEGER NOT NULL DEFAULT 0,
  urls_case_studies INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  trigger_source TEXT,
  generation_time_ms INTEGER,
  storage_url TEXT,
  
  CONSTRAINT sitemap_history_total_urls_check CHECK (total_urls >= 0)
);

-- Índice para consultas por fecha (últimos 30 días)
CREATE INDEX idx_sitemap_history_created_at 
ON public.sitemap_history(created_at DESC);

-- Índice para búsquedas por trigger source
CREATE INDEX idx_sitemap_history_trigger_source 
ON public.sitemap_history(trigger_source);

-- RLS: Solo admins pueden leer
ALTER TABLE public.sitemap_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sitemap history"
ON public.sitemap_history FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Cleanup automático: mantener solo últimos 90 días
CREATE OR REPLACE FUNCTION cleanup_old_sitemap_history()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.sitemap_history
  WHERE created_at < now() - interval '90 days';
END;
$$;

-- Comentarios para documentación
COMMENT ON TABLE public.sitemap_history IS 'Historial de snapshots del sitemap para análisis y gráficos';
COMMENT ON COLUMN public.sitemap_history.trigger_source IS 'Origen del trigger: manual, blog_post, service, case_study';
COMMENT ON COLUMN public.sitemap_history.generation_time_ms IS 'Tiempo de generación del sitemap en milisegundos';