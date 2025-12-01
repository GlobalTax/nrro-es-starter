-- Añadir columna para redirecciones 301
ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS redirect_url TEXT;

-- Habilitar extensiones necesarias para CRON
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Crear función para trigger de sincronización automática
CREATE OR REPLACE FUNCTION public.trigger_sitemap_regeneration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  -- Llamar a la edge function de forma asíncrona
  PERFORM net.http_post(
    url := 'https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/regenerate-sitemap',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudG90Y3BhZ2t1bnZrd3B1YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc5MDUsImV4cCI6MjA2ODUwMzkwNX0.YaVxgYF91UyCkSc8nqsVSACP2Xs4r5--sE8EtLnzMCI'
    ),
    body := jsonb_build_object(
      'trigger', 'database_change',
      'table', TG_TABLE_NAME,
      'timestamp', now()
    )
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error pero no fallar el trigger principal
    RAISE WARNING 'Error calling sitemap regeneration: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Programar sincronización automática diaria a las 3:00 AM
SELECT cron.schedule(
  'daily-sitemap-sync',
  '0 3 * * *', -- Cada día a las 3:00 AM
  $$
  SELECT net.http_post(
    url := 'https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/sync-site-pages',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudG90Y3BhZ2t1bnZrd3B1YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc5MDUsImV4cCI6MjA2ODUwMzkwNX0.YaVxgYF91UyCkSc8nqsVSACP2Xs4r5--sE8EtLnzMCI'
    ),
    body := jsonb_build_object(
      'trigger', 'cron_daily_sync',
      'timestamp', now()
    )::jsonb
  ) as request_id;
  $$
);