-- =====================================================
-- Triggers para regeneración automática del sitemap
-- =====================================================

-- Función para llamar a la edge function regenerate-sitemap
CREATE OR REPLACE FUNCTION public.trigger_sitemap_regeneration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- =====================================================
-- Trigger para blog_posts
-- =====================================================

-- Se activa cuando un post se publica o se actualiza en estado publicado
CREATE OR REPLACE TRIGGER trigger_blog_posts_sitemap
AFTER INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
WHEN (NEW.status = 'published')
EXECUTE FUNCTION public.trigger_sitemap_regeneration();

-- =====================================================
-- Trigger para services
-- =====================================================

-- Se activa cuando un servicio se crea, actualiza o se activa
CREATE OR REPLACE TRIGGER trigger_services_sitemap
AFTER INSERT OR UPDATE ON public.services
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION public.trigger_sitemap_regeneration();

-- =====================================================
-- Trigger para case_studies
-- =====================================================

-- Se activa cuando un case study se publica o se actualiza en estado publicado
CREATE OR REPLACE TRIGGER trigger_case_studies_sitemap
AFTER INSERT OR UPDATE ON public.case_studies
FOR EACH ROW
WHEN (NEW.status = 'published')
EXECUTE FUNCTION public.trigger_sitemap_regeneration();

-- =====================================================
-- Comentarios para documentación
-- =====================================================

COMMENT ON FUNCTION public.trigger_sitemap_regeneration() IS 
'Función que llama a la edge function regenerate-sitemap cuando se publica o actualiza contenido';

COMMENT ON TRIGGER trigger_blog_posts_sitemap ON public.blog_posts IS 
'Regenera el sitemap cuando se publica un blog post';

COMMENT ON TRIGGER trigger_services_sitemap ON public.services IS 
'Regenera el sitemap cuando se activa o actualiza un servicio';

COMMENT ON TRIGGER trigger_case_studies_sitemap ON public.case_studies IS 
'Regenera el sitemap cuando se publica un case study';