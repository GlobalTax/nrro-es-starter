-- =====================================================
-- MIGRACIÓN MULTIIDIOMA: Español, Catalán, Inglés
-- =====================================================

-- 1. SERVICIOS: Agregar campos multiidioma
-- =====================================================
ALTER TABLE services 
  ADD COLUMN IF NOT EXISTS name_es TEXT,
  ADD COLUMN IF NOT EXISTS name_ca TEXT,
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS slug_es TEXT,
  ADD COLUMN IF NOT EXISTS slug_ca TEXT,
  ADD COLUMN IF NOT EXISTS slug_en TEXT,
  ADD COLUMN IF NOT EXISTS description_es TEXT,
  ADD COLUMN IF NOT EXISTS description_ca TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_es TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_ca TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_es TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_ca TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT,
  ADD COLUMN IF NOT EXISTS benefits_es TEXT,
  ADD COLUMN IF NOT EXISTS benefits_ca TEXT,
  ADD COLUMN IF NOT EXISTS benefits_en TEXT,
  ADD COLUMN IF NOT EXISTS features_es TEXT[],
  ADD COLUMN IF NOT EXISTS features_ca TEXT[],
  ADD COLUMN IF NOT EXISTS features_en TEXT[],
  ADD COLUMN IF NOT EXISTS typical_clients_es TEXT[],
  ADD COLUMN IF NOT EXISTS typical_clients_ca TEXT[],
  ADD COLUMN IF NOT EXISTS typical_clients_en TEXT[];

-- Migrar datos existentes a español
UPDATE services SET 
  name_es = name,
  slug_es = slug,
  description_es = description,
  meta_title_es = meta_title,
  meta_description_es = meta_description,
  benefits_es = benefits,
  features_es = features,
  typical_clients_es = typical_clients
WHERE name_es IS NULL;

-- 2. CASE STUDIES: Agregar campos multiidioma
-- =====================================================
ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS title_es TEXT,
  ADD COLUMN IF NOT EXISTS title_ca TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS slug_es TEXT,
  ADD COLUMN IF NOT EXISTS slug_ca TEXT,
  ADD COLUMN IF NOT EXISTS slug_en TEXT,
  ADD COLUMN IF NOT EXISTS hero_title_es TEXT,
  ADD COLUMN IF NOT EXISTS hero_title_ca TEXT,
  ADD COLUMN IF NOT EXISTS hero_title_en TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle_es TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle_ca TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle_en TEXT,
  ADD COLUMN IF NOT EXISTS challenge_es TEXT,
  ADD COLUMN IF NOT EXISTS challenge_ca TEXT,
  ADD COLUMN IF NOT EXISTS challenge_en TEXT,
  ADD COLUMN IF NOT EXISTS solution_es TEXT,
  ADD COLUMN IF NOT EXISTS solution_ca TEXT,
  ADD COLUMN IF NOT EXISTS solution_en TEXT,
  ADD COLUMN IF NOT EXISTS results_summary_es TEXT,
  ADD COLUMN IF NOT EXISTS results_summary_ca TEXT,
  ADD COLUMN IF NOT EXISTS results_summary_en TEXT,
  ADD COLUMN IF NOT EXISTS detailed_content_es TEXT,
  ADD COLUMN IF NOT EXISTS detailed_content_ca TEXT,
  ADD COLUMN IF NOT EXISTS detailed_content_en TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_text_es TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_text_ca TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_text_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_es TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_ca TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_es TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_ca TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT;

-- Migrar datos existentes a español
UPDATE case_studies SET
  title_es = title,
  slug_es = slug,
  hero_title_es = hero_title,
  hero_subtitle_es = hero_subtitle,
  challenge_es = challenge,
  solution_es = solution,
  results_summary_es = results_summary,
  detailed_content_es = detailed_content,
  testimonial_text_es = testimonial_text,
  meta_title_es = meta_title,
  meta_description_es = meta_description
WHERE title_es IS NULL;

-- 3. TEAM MEMBERS: Agregar campos multiidioma
-- =====================================================
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS position_es TEXT,
  ADD COLUMN IF NOT EXISTS position_ca TEXT,
  ADD COLUMN IF NOT EXISTS position_en TEXT,
  ADD COLUMN IF NOT EXISTS bio_es TEXT,
  ADD COLUMN IF NOT EXISTS bio_ca TEXT,
  ADD COLUMN IF NOT EXISTS bio_en TEXT,
  ADD COLUMN IF NOT EXISTS specialization_es TEXT,
  ADD COLUMN IF NOT EXISTS specialization_ca TEXT,
  ADD COLUMN IF NOT EXISTS specialization_en TEXT;

-- Migrar datos existentes a español
UPDATE team_members SET
  position_es = position,
  bio_es = bio,
  specialization_es = specialization
WHERE position_es IS NULL;

-- 4. JOB POSITIONS: Agregar campos multiidioma
-- =====================================================
ALTER TABLE job_positions
  ADD COLUMN IF NOT EXISTS title_es TEXT,
  ADD COLUMN IF NOT EXISTS title_ca TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS slug_es TEXT,
  ADD COLUMN IF NOT EXISTS slug_ca TEXT,
  ADD COLUMN IF NOT EXISTS slug_en TEXT,
  ADD COLUMN IF NOT EXISTS description_es TEXT,
  ADD COLUMN IF NOT EXISTS description_ca TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS requirements_es TEXT[],
  ADD COLUMN IF NOT EXISTS requirements_ca TEXT[],
  ADD COLUMN IF NOT EXISTS requirements_en TEXT[],
  ADD COLUMN IF NOT EXISTS responsibilities_es TEXT[],
  ADD COLUMN IF NOT EXISTS responsibilities_ca TEXT[],
  ADD COLUMN IF NOT EXISTS responsibilities_en TEXT[];

-- Migrar datos existentes a español
UPDATE job_positions SET
  title_es = title,
  slug_es = slug,
  description_es = description,
  requirements_es = requirements,
  responsibilities_es = responsibilities
WHERE title_es IS NULL;

-- 5. Crear índices para mejorar performance en búsquedas multiidioma
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_services_slug_es ON services(slug_es);
CREATE INDEX IF NOT EXISTS idx_services_slug_ca ON services(slug_ca);
CREATE INDEX IF NOT EXISTS idx_services_slug_en ON services(slug_en);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug_es ON case_studies(slug_es);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug_ca ON case_studies(slug_ca);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug_en ON case_studies(slug_en);

CREATE INDEX IF NOT EXISTS idx_job_positions_slug_es ON job_positions(slug_es);
CREATE INDEX IF NOT EXISTS idx_job_positions_slug_ca ON job_positions(slug_ca);
CREATE INDEX IF NOT EXISTS idx_job_positions_slug_en ON job_positions(slug_en);