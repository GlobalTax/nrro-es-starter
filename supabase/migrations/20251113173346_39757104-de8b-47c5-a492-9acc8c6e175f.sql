-- Add multilingual JSONB columns for services table
ALTER TABLE services
ADD COLUMN metodologia_es jsonb,
ADD COLUMN metodologia_ca jsonb,
ADD COLUMN metodologia_en jsonb,
ADD COLUMN servicios_transversales_es jsonb,
ADD COLUMN servicios_transversales_ca jsonb,
ADD COLUMN servicios_transversales_en jsonb,
ADD COLUMN stats_es jsonb,
ADD COLUMN stats_ca jsonb,
ADD COLUMN stats_en jsonb;

-- Migrate existing data to _es columns
UPDATE services SET
  metodologia_es = metodologia,
  servicios_transversales_es = servicios_transversales,
  stats_es = stats
WHERE is_active = true;

-- Create index for better performance on JSONB queries
CREATE INDEX idx_services_metodologia_es ON services USING gin(metodologia_es);
CREATE INDEX idx_services_servicios_transversales_es ON services USING gin(servicios_transversales_es);
CREATE INDEX idx_services_stats_es ON services USING gin(stats_es);