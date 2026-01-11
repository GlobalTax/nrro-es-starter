-- Añadir columnas para controlar secciones de la presentación enriquecida
ALTER TABLE public.generated_presentations
ADD COLUMN IF NOT EXISTS include_toc boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS include_methodology boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS include_value_proposition boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_service_features boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_team_bio boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_case_metrics boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_testimonials boolean DEFAULT true;