-- Fase 1: Migración para Sistema de Automatización de Blog Avanzado

-- 1. Añadir columnas de calidad a blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quality_checks JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS passed_validation BOOLEAN DEFAULT false;

-- 2. Crear tabla de eventos del calendario editorial
CREATE TABLE IF NOT EXISTS public.editorial_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  recurrence TEXT CHECK (recurrence IN ('yearly', 'quarterly', 'monthly', 'one-time')) DEFAULT 'yearly',
  suggested_topic_template TEXT,
  suggested_category TEXT,
  days_before_publish INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar RLS
ALTER TABLE public.editorial_calendar_events ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS - lectura pública para admin
CREATE POLICY "Admins can manage editorial calendar" 
ON public.editorial_calendar_events 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Public read access for editorial calendar"
ON public.editorial_calendar_events
FOR SELECT
USING (is_active = true);

-- 5. Trigger para updated_at
CREATE TRIGGER update_editorial_calendar_updated_at
BEFORE UPDATE ON public.editorial_calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Insertar eventos fiscales clave de España
INSERT INTO public.editorial_calendar_events (event_name, event_date, recurrence, suggested_topic_template, suggested_category, days_before_publish) VALUES
-- Enero
('Modelo 111/115 4T', '2026-01-20', 'quarterly', 'Guía para presentar el Modelo {model} del cuarto trimestre {year}', 'Fiscal', 10),
('Modelo 390 Resumen IVA', '2026-01-30', 'yearly', 'Cómo preparar el Modelo 390: Resumen anual de IVA {year}', 'Fiscal', 14),
-- Febrero
('Modelo 347 Operaciones', '2026-02-28', 'yearly', 'Todo sobre el Modelo 347: Declaración de operaciones con terceros {year}', 'Fiscal', 14),
-- Abril
('Modelos 1T (111/115/303)', '2026-04-20', 'quarterly', 'Obligaciones fiscales del primer trimestre {year}: Modelos 111, 115 y 303', 'Fiscal', 10),
('Inicio Campaña IRPF', '2026-04-01', 'yearly', 'Campaña de la Renta {year}: Novedades y consejos para optimizar tu declaración', 'Fiscal', 7),
-- Junio
('Fin Campaña IRPF', '2026-06-30', 'yearly', 'Últimos días para la declaración de IRPF: Errores comunes a evitar', 'Fiscal', 14),
-- Julio
('Modelo 200 Sociedades', '2026-07-25', 'yearly', 'Impuesto de Sociedades {year}: Guía completa del Modelo 200', 'Fiscal', 21),
('Modelos 2T (111/115/303)', '2026-07-20', 'quarterly', 'Obligaciones fiscales del segundo trimestre {year}', 'Fiscal', 10),
-- Octubre
('Modelos 3T (111/115/303)', '2026-10-20', 'quarterly', 'Cierre del tercer trimestre fiscal: Modelos 111, 115 y 303', 'Fiscal', 10),
('Compliance Penal Anual', '2026-10-15', 'yearly', 'Revisión anual del programa de Compliance Penal: Actualizaciones {year}', 'Corporativo', 14),
-- Noviembre
('Planificación Fiscal Fin Año', '2026-11-15', 'yearly', 'Estrategias de planificación fiscal antes de fin de año {year}', 'Fiscal', 7),
-- Diciembre
('Novedades Normativas', '2026-12-20', 'yearly', 'Principales novedades fiscales y mercantiles para {year+1}', 'Analisis', 14),
-- Laboral
('Planes de Igualdad', '2026-03-08', 'yearly', 'Obligaciones empresariales en materia de igualdad: Actualización {year}', 'Laboral', 14),
('Calendario Laboral', '2026-12-01', 'yearly', 'Calendario laboral {year+1}: Festivos y días clave para empresas', 'Laboral', 7);

-- 7. Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_date ON public.editorial_calendar_events (event_date);
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_active ON public.editorial_calendar_events (is_active) WHERE is_active = true;