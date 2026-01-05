-- Tabla para gestionar la cola de generación de artículos
CREATE TABLE public.blog_generation_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Fiscal',
  tone TEXT NOT NULL DEFAULT 'professional',
  language TEXT NOT NULL DEFAULT 'both',
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  generated_post_id UUID REFERENCES public.blog_posts(id),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  CONSTRAINT valid_tone CHECK (tone IN ('professional', 'technical', 'divulgative')),
  CONSTRAINT valid_language CHECK (language IN ('es', 'en', 'both')),
  CONSTRAINT valid_category CHECK (category IN ('Fiscal', 'Mercantil', 'Laboral', 'Corporativo'))
);

-- Tabla para trackear publicaciones en redes sociales
CREATE TABLE public.social_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'linkedin',
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  post_url TEXT,
  post_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  share_text TEXT,
  engagement JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_platform CHECK (platform IN ('linkedin', 'twitter', 'facebook')),
  CONSTRAINT valid_share_status CHECK (status IN ('pending', 'published', 'failed', 'scheduled'))
);

-- Tabla para configuración de automatización
CREATE TABLE public.blog_automation_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  articles_per_run INTEGER NOT NULL DEFAULT 2,
  run_interval_days INTEGER NOT NULL DEFAULT 2,
  default_tone TEXT NOT NULL DEFAULT 'professional',
  default_language TEXT NOT NULL DEFAULT 'both',
  auto_publish BOOLEAN NOT NULL DEFAULT false,
  notify_on_generation BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insertar configuración por defecto
INSERT INTO public.blog_automation_settings (is_enabled, articles_per_run, run_interval_days)
VALUES (true, 2, 2);

-- Enable RLS
ALTER TABLE public.blog_generation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_automation_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para blog_generation_queue (solo admins pueden ver/modificar)
CREATE POLICY "Admins can view blog generation queue" 
ON public.blog_generation_queue 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert into blog generation queue" 
ON public.blog_generation_queue 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update blog generation queue" 
ON public.blog_generation_queue 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete from blog generation queue" 
ON public.blog_generation_queue 
FOR DELETE 
USING (true);

-- Políticas para social_shares
CREATE POLICY "Admins can view social shares" 
ON public.social_shares 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert social shares" 
ON public.social_shares 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update social shares" 
ON public.social_shares 
FOR UPDATE 
USING (true);

-- Políticas para blog_automation_settings
CREATE POLICY "Anyone can view automation settings" 
ON public.blog_automation_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update automation settings" 
ON public.blog_automation_settings 
FOR UPDATE 
USING (true);

-- Índices para mejor rendimiento
CREATE INDEX idx_blog_queue_status ON public.blog_generation_queue(status);
CREATE INDEX idx_blog_queue_scheduled ON public.blog_generation_queue(scheduled_for);
CREATE INDEX idx_social_shares_post ON public.social_shares(blog_post_id);
CREATE INDEX idx_social_shares_platform ON public.social_shares(platform);

-- Trigger para updated_at
CREATE TRIGGER update_blog_generation_queue_updated_at
BEFORE UPDATE ON public.blog_generation_queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_shares_updated_at
BEFORE UPDATE ON public.social_shares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_automation_settings_updated_at
BEFORE UPDATE ON public.blog_automation_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();