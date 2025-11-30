-- Crear tabla para historial de sincronizaciones del sitemap
CREATE TABLE IF NOT EXISTS public.sitemap_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  pages_added integer DEFAULT 0,
  pages_updated integer DEFAULT 0,
  pages_archived integer DEFAULT 0,
  pages_total integer DEFAULT 0,
  errors jsonb DEFAULT '[]'::jsonb,
  triggered_by text DEFAULT 'manual',
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sitemap_sync_log ENABLE ROW LEVEL SECURITY;

-- Policy: Solo admins pueden ver historial de sincronizaciones
CREATE POLICY "Admins can view sync history"
  ON public.sitemap_sync_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Sistema puede insertar registros de sincronización
CREATE POLICY "System can insert sync logs"
  ON public.sitemap_sync_log
  FOR INSERT
  WITH CHECK (true);

-- Policy: Sistema puede actualizar registros de sincronización
CREATE POLICY "System can update sync logs"
  ON public.sitemap_sync_log
  FOR UPDATE
  USING (true);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_sitemap_sync_log_created_at 
  ON public.sitemap_sync_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sitemap_sync_log_status 
  ON public.sitemap_sync_log(status);

-- Comentarios de documentación
COMMENT ON TABLE public.sitemap_sync_log IS 'Historial de sincronizaciones entre sitemap.xml y la tabla site_pages';
COMMENT ON COLUMN public.sitemap_sync_log.status IS 'Estado: running, completed, failed';
COMMENT ON COLUMN public.sitemap_sync_log.triggered_by IS 'Origen: manual, automatic, webhook';