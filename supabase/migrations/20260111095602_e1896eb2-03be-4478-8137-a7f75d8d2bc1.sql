-- ==============================================
-- FASE 1: Sistema de Módulos Narrativos Inteligentes
-- ==============================================

-- 1. Añadir nuevos campos de contexto estratégico a generated_presentations
ALTER TABLE public.generated_presentations
ADD COLUMN IF NOT EXISTS presentation_type TEXT DEFAULT 'corporate',
ADD COLUMN IF NOT EXISTS audience_type TEXT DEFAULT 'family_business',
ADD COLUMN IF NOT EXISTS presentation_objective TEXT DEFAULT 'meet',
ADD COLUMN IF NOT EXISTS quality_mode TEXT DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS narrative_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS validation_passed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cover_tagline TEXT,
ADD COLUMN IF NOT EXISTS cta_type TEXT DEFAULT 'strategic_conversation',
ADD COLUMN IF NOT EXISTS differentiators JSONB DEFAULT '[]';

-- 2. Añadir comentarios descriptivos
COMMENT ON COLUMN public.generated_presentations.presentation_type IS 'Tipo de presentación: corporate, ma, inbound, pe, fiscal';
COMMENT ON COLUMN public.generated_presentations.audience_type IS 'Tipo de audiencia: family_business, investor, foreigner, startup';
COMMENT ON COLUMN public.generated_presentations.presentation_objective IS 'Objetivo: meet (conocer), decide (decidir), contact (contactar)';
COMMENT ON COLUMN public.generated_presentations.quality_mode IS 'Modo de calidad: basic, professional, premium';
COMMENT ON COLUMN public.generated_presentations.narrative_score IS 'Puntuación de calidad narrativa 0-100';
COMMENT ON COLUMN public.generated_presentations.validation_passed IS 'Si la presentación pasa el sistema de validación anti-cutrez';
COMMENT ON COLUMN public.generated_presentations.cover_tagline IS 'Tagline adaptativo para la portada';
COMMENT ON COLUMN public.generated_presentations.cta_type IS 'Tipo de CTA: strategic_conversation, initial_diagnosis, preliminary_valuation, structure_review';
COMMENT ON COLUMN public.generated_presentations.differentiators IS 'Array de diferenciadores con título, descripción y prueba';

-- 3. Crear tabla de módulos narrativos (configuración)
CREATE TABLE IF NOT EXISTS public.presentation_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_en TEXT,
  name_ca TEXT,
  objective TEXT,
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  variants JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.presentation_modules ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (son configuraciones)
CREATE POLICY "Presentation modules are viewable by authenticated users"
ON public.presentation_modules
FOR SELECT
TO authenticated
USING (true);

-- 4. Insertar los 8 módulos narrativos base
INSERT INTO public.presentation_modules (module_key, name, name_en, name_ca, objective, is_required, display_order) VALUES
('M1_COVER', 'Portada Estratégica', 'Strategic Cover', 'Portada Estratègica', 'Posicionar según tipo cliente y objetivo', true, 1),
('M2_WHO_WE_ARE', 'Quiénes Somos', 'Who We Are', 'Qui Som', 'Qué problemas resolvemos, para quién, cuándo entramos', true, 2),
('M3_DIFFERENTIATORS', 'Diferenciadores', 'Differentiators', 'Diferenciadors', 'Por qué elegirnos: diferenciador + prueba + impacto', true, 3),
('M4_SERVICES', 'Servicios por Momentos', 'Services by Moments', 'Serveis per Moments', 'Agrupados por momentos empresariales, no por áreas', true, 4),
('M5_METHODOLOGY', 'Metodología', 'Methodology', 'Metodologia', 'Proceso de trabajo: Diagnóstico → Estrategia → Implementación → Seguimiento', true, 5),
('M6_CASES', 'Casos de Éxito', 'Success Stories', 'Casos d''Èxit', 'Challenge → Intervención → Resultado (con fallback inteligente)', false, 6),
('M7_TEAM', 'Equipo', 'Team', 'Equip', 'Core team (2-4) + dato agregado del grupo', false, 7),
('M8_CTA', 'Llamada a la Acción', 'Call to Action', 'Crida a l''Acció', 'CTA adaptativo según objetivo', true, 8)
ON CONFLICT (module_key) DO NOTHING;

-- 5. Crear función para calcular narrative_score
CREATE OR REPLACE FUNCTION public.calculate_presentation_score(p_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score INTEGER := 100;
  v_presentation RECORD;
  v_services_count INTEGER;
  v_team_count INTEGER;
  v_cases_count INTEGER;
BEGIN
  SELECT * INTO v_presentation FROM generated_presentations WHERE id = p_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Validar campos críticos
  IF v_presentation.client_name IS NULL OR trim(v_presentation.client_name) = '' THEN
    v_score := v_score - 20;
  END IF;
  
  -- Contar servicios
  v_services_count := COALESCE(jsonb_array_length(v_presentation.services_included), 0);
  IF v_services_count = 0 THEN
    v_score := v_score - 30;
  ELSIF v_services_count < 3 THEN
    v_score := v_score - 10;
  END IF;
  
  -- Contar equipo
  v_team_count := COALESCE(jsonb_array_length(v_presentation.team_members_included), 0);
  
  -- Contar casos
  v_cases_count := COALESCE(jsonb_array_length(v_presentation.case_studies_included), 0);
  
  -- Coherencia: si hay casos, debería haber equipo
  IF v_cases_count > 0 AND v_team_count < 2 THEN
    v_score := v_score - 15;
  END IF;
  
  -- Metodología incluida
  IF v_presentation.include_methodology = false THEN
    v_score := v_score - 10;
  END IF;
  
  -- Propuesta de valor incluida
  IF v_presentation.include_value_proposition = false THEN
    v_score := v_score - 15;
  END IF;
  
  -- Introducción personalizada
  IF v_presentation.custom_intro IS NOT NULL AND length(v_presentation.custom_intro) >= 50 THEN
    v_score := v_score + 5; -- Bonus
  END IF;
  
  -- Cover tagline (módulo narrativo)
  IF v_presentation.cover_tagline IS NOT NULL AND length(v_presentation.cover_tagline) >= 20 THEN
    v_score := v_score + 5; -- Bonus
  END IF;
  
  RETURN GREATEST(0, LEAST(100, v_score));
END;
$$;

-- 6. Trigger para actualizar narrative_score automáticamente
CREATE OR REPLACE FUNCTION public.update_presentation_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.narrative_score := calculate_presentation_score(NEW.id);
  NEW.validation_passed := NEW.narrative_score >= 70;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_presentation_score ON public.generated_presentations;
CREATE TRIGGER trigger_update_presentation_score
BEFORE INSERT OR UPDATE ON public.generated_presentations
FOR EACH ROW
EXECUTE FUNCTION public.update_presentation_score();