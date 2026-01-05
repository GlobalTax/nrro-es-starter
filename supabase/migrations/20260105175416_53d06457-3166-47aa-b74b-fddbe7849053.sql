-- Habilitar extensiones necesarias para CRON jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Programar generación automática cada 2 días a las 9:00 AM (hora España)
SELECT cron.schedule(
  'auto-blog-generation',
  '0 9 */2 * *',
  $$
  SELECT net.http_post(
    url:='https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/auto-generate-blog',
    headers:=jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudG90Y3BhZ2t1bnZrd3B1YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc5MDUsImV4cCI6MjA2ODUwMzkwNX0.YaVxgYF91UyCkSc8nqsVSACP2Xs4r5--sE8EtLnzMCI'
    ),
    body:='{"count": 2}'::jsonb
  ) as request_id;
  $$
);