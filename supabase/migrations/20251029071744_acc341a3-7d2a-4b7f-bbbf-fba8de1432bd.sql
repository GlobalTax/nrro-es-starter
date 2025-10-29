-- ============================================
-- FASE 1: INFRAESTRUCTURA CRÍTICA
-- ============================================

-- 1.1 Crear tabla contact_leads
CREATE TYPE service_type AS ENUM (
  'empresa_familiar',
  'tax_advisory', 
  'legal_advisory',
  'financial_planning',
  'other'
);

CREATE TABLE public.contact_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  subject text NOT NULL,
  message text NOT NULL,
  service_type service_type,
  ip_address text,
  user_agent text,
  email_sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all contact leads"
ON public.contact_leads FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact leads"
ON public.contact_leads FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert contact leads"
ON public.contact_leads FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE TRIGGER update_contact_leads_updated_at
  BEFORE UPDATE ON public.contact_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_contact_leads_email ON public.contact_leads(email);
CREATE INDEX idx_contact_leads_created_at ON public.contact_leads(created_at DESC);
CREATE INDEX idx_contact_leads_service_type ON public.contact_leads(service_type);

-- 1.2 Crear tabla security_events
CREATE TYPE security_event_type AS ENUM (
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'LOGOUT',
  'RATE_LIMIT_EXCEEDED',
  'UNAUTHORIZED_ACCESS',
  'ADMIN_ACTION',
  'DEMO_REQUEST_SUBMISSION',
  'CONTACT_FORM_SUBMISSION',
  'PASSWORD_RESET',
  'SESSION_EXPIRED'
);

CREATE TYPE event_severity AS ENUM (
  'info',
  'warn',
  'high',
  'critical'
);

CREATE TABLE public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type security_event_type NOT NULL,
  severity event_severity NOT NULL DEFAULT 'info',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name text,
  operation text,
  ip_address text,
  user_agent text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security events"
ON public.security_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert security events"
ON public.security_events FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE INDEX idx_security_events_type ON public.security_events(event_type);
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_user ON public.security_events(user_id);
CREATE INDEX idx_security_events_created ON public.security_events(created_at DESC);
CREATE INDEX idx_security_events_ip ON public.security_events(ip_address);

CREATE OR REPLACE FUNCTION cleanup_old_security_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.security_events
  WHERE created_at < now() - interval '90 days'
    AND severity IN ('info', 'warn');
END;
$$;

-- 1.3 Implementar Rate Limiting
CREATE TABLE public.rate_limit_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  category text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  last_request timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, category)
);

ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage rate limits"
ON public.rate_limit_tracking FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

CREATE INDEX idx_rate_limit_identifier ON public.rate_limit_tracking(identifier, category);
CREATE INDEX idx_rate_limit_window ON public.rate_limit_tracking(window_start);

CREATE OR REPLACE FUNCTION public.check_login_rate_limit(
  p_identifier text,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_window_start timestamp with time zone;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  INSERT INTO public.rate_limit_tracking (identifier, category, request_count, window_start)
  VALUES (p_identifier, 'login_attempt', 1, now())
  ON CONFLICT (identifier, category) 
  DO UPDATE SET
    request_count = CASE
      WHEN rate_limit_tracking.window_start < v_window_start THEN 1
      ELSE rate_limit_tracking.request_count + 1
    END,
    window_start = CASE
      WHEN rate_limit_tracking.window_start < v_window_start THEN now()
      ELSE rate_limit_tracking.window_start
    END,
    last_request = now()
  RETURNING request_count, window_start INTO v_count, v_window_start;
  
  IF v_count > p_max_attempts THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit_enhanced_safe(
  p_identifier text,
  p_category text,
  p_max_requests integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_window_start timestamp with time zone;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  INSERT INTO public.rate_limit_tracking (identifier, category, request_count, window_start)
  VALUES (p_identifier, p_category, 1, now())
  ON CONFLICT (identifier, category) 
  DO UPDATE SET
    request_count = CASE
      WHEN rate_limit_tracking.window_start < v_window_start THEN 1
      ELSE rate_limit_tracking.request_count + 1
    END,
    window_start = CASE
      WHEN rate_limit_tracking.window_start < v_window_start THEN now()
      ELSE rate_limit_tracking.window_start
    END,
    last_request = now()
  RETURNING request_count, window_start INTO v_count, v_window_start;
  
  IF v_count > p_max_requests THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limit_tracking
  WHERE last_request < now() - interval '24 hours';
END;
$$;

-- 1.4 Arreglar Storage Policy Rota
DROP POLICY IF EXISTS "Admins can manage company logos" ON storage.objects;

CREATE POLICY "Admins can manage company logos"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'company-logos' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'company-logos' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- ============================================
-- FASE 2: HARDENING DE FUNCIONES
-- ============================================

-- 2.1 Proteger funciones SECURITY DEFINER añadiendo search_path

-- Función: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Función: log_blog_post_state_change
CREATE OR REPLACE FUNCTION public.log_blog_post_state_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    INSERT INTO public.blog_post_state_changes (post_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

-- Función: log_employee_movement
CREATE OR REPLACE FUNCTION public.log_employee_movement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (entity, entity_id, action, actor, data)
    VALUES ('empleados', NEW.id, 'ALTA', auth.uid()::text, 
            jsonb_build_object('nombre', NEW.nombre, 'area', NEW.area, 'oficina', NEW.oficina));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.activo = true AND NEW.activo = false THEN
      INSERT INTO public.audit_logs (entity, entity_id, action, actor, data)
      VALUES ('empleados', NEW.id, 'BAJA', auth.uid()::text,
              jsonb_build_object('nombre', NEW.nombre, 'fecha_baja', NEW.fecha_baja));
    ELSIF OLD.area != NEW.area OR OLD.oficina != NEW.oficina THEN
      INSERT INTO public.audit_logs (entity, entity_id, action, actor, data)
      VALUES ('empleados', NEW.id, 'MOVIMIENTO', auth.uid()::text,
              jsonb_build_object('area_anterior', OLD.area, 'area_nueva', NEW.area,
                                'oficina_anterior', OLD.oficina, 'oficina_nueva', OLD.oficina));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Función: log_entity_change
CREATE OR REPLACE FUNCTION public.log_entity_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_data jsonb;
  new_data jsonb;
  changed_fields jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (entity, entity_id, action, actor, data)
    VALUES (
      TG_TABLE_NAME,
      NEW.id,
      'CREATE',
      COALESCE(auth.uid()::text, 'system'),
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    changed_fields := jsonb_build_object(
      'before', old_data,
      'after', new_data
    );
    INSERT INTO public.audit_logs (entity, entity_id, action, actor, data)
    VALUES (
      TG_TABLE_NAME,
      NEW.id,
      'UPDATE',
      COALESCE(auth.uid()::text, 'system'),
      changed_fields
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (entity, entity_id, action, actor, data)
    VALUES (
      TG_TABLE_NAME,
      OLD.id,
      'DELETE',
      COALESCE(auth.uid()::text, 'system'),
      to_jsonb(OLD)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Función: publish_scheduled_posts
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  published_count INTEGER;
BEGIN
  WITH updated AS (
    UPDATE public.blog_posts
    SET 
      status = 'published',
      published_at = now()
    WHERE 
      status = 'scheduled' 
      AND scheduled_at <= now()
      AND scheduled_at IS NOT NULL
    RETURNING id
  )
  SELECT COUNT(*) INTO published_count FROM updated;
  RETURN published_count;
END;
$$;

-- Función: update_media_usage_count
CREATE OR REPLACE FUNCTION public.update_media_usage_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.media_files 
    SET 
      usage_count = usage_count + 1,
      last_used_at = now()
    WHERE id = NEW.media_file_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.media_files 
    SET usage_count = GREATEST(usage_count - 1, 0)
    WHERE id = OLD.media_file_id;
  END IF;
  RETURN NULL;
END;
$$;

-- 2.2 Recrear nominas_summary view sin SECURITY DEFINER
DROP VIEW IF EXISTS public.nominas_summary;

CREATE VIEW public.nominas_summary AS
SELECT 
  id, 
  empleado_id, 
  mes, 
  anio, 
  bruto, 
  neto, 
  coste_empresa, 
  fecha_subida
FROM public.nominas;

GRANT SELECT ON public.nominas_summary TO authenticated;

-- ============================================
-- FASE 3: MEJORAS DE AUDITORÍA
-- ============================================

-- Añadir triggers de auditoría a tablas sensibles

DROP TRIGGER IF EXISTS audit_empleados_changes ON public.empleados;
CREATE TRIGGER audit_empleados_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.empleados
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_change();

DROP TRIGGER IF EXISTS audit_nominas_changes ON public.nominas;
CREATE TRIGGER audit_nominas_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.nominas
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_change();

DROP TRIGGER IF EXISTS audit_candidatos_changes ON public.candidatos;
CREATE TRIGGER audit_candidatos_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.candidatos
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_change();

DROP TRIGGER IF EXISTS audit_entrevistas_changes ON public.entrevistas;
CREATE TRIGGER audit_entrevistas_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.entrevistas
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_change();

DROP TRIGGER IF EXISTS audit_cierres_changes ON public.cierres_nomina;
CREATE TRIGGER audit_cierres_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.cierres_nomina
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_change();

DROP TRIGGER IF EXISTS audit_movimientos_changes ON public.movimientos_mes;
CREATE TRIGGER audit_movimientos_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.movimientos_mes
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_change();

DROP TRIGGER IF EXISTS audit_user_roles_changes ON public.user_roles;
CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_change();

-- ============================================
-- FASE 4: FUNCIONES DE MANTENIMIENTO
-- ============================================

CREATE OR REPLACE FUNCTION run_maintenance_tasks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM cleanup_old_security_events();
  PERFORM cleanup_old_rate_limits();
  
  INSERT INTO public.security_events (
    event_type,
    severity,
    details
  ) VALUES (
    'ADMIN_ACTION'::security_event_type,
    'info'::event_severity,
    jsonb_build_object(
      'task', 'maintenance_completed',
      'timestamp', now()
    )
  );
END;
$$;