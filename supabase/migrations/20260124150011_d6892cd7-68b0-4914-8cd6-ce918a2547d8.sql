-- Tabla para registrar historial de ejecuciones de automatización de noticias
CREATE TABLE public.news_automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'error', 'skipped')),
  articles_requested INTEGER NOT NULL DEFAULT 0,
  articles_generated INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  error_details JSONB,
  execution_time_ms INTEGER,
  trigger_type TEXT DEFAULT 'cron' CHECK (trigger_type IN ('cron', 'manual', 'api')),
  settings_snapshot JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para consultas por fecha (las más recientes primero)
CREATE INDEX idx_news_automation_runs_started_at 
ON public.news_automation_runs(started_at DESC);

-- Índice para filtrar por estado
CREATE INDEX idx_news_automation_runs_status 
ON public.news_automation_runs(status);

-- Habilitar RLS
ALTER TABLE public.news_automation_runs ENABLE ROW LEVEL SECURITY;

-- Política de lectura para usuarios autenticados
CREATE POLICY "Allow authenticated read on news_automation_runs" 
ON public.news_automation_runs
FOR SELECT 
TO authenticated 
USING (true);

-- Comentario descriptivo
COMMENT ON TABLE public.news_automation_runs IS 'Historial de ejecuciones de la automatización de noticias';