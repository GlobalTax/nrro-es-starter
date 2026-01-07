-- Add source_site column to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS source_site TEXT DEFAULT 'es';

-- Mark international services based on their slugs
UPDATE public.services 
SET source_site = 'int' 
WHERE slug_es IN (
  'international-accounting-management',
  'international-tax-management', 
  'international-payroll-management',
  'treasury-management',
  'transfer-pricing',
  'local-presence-governance-support',
  'valoracion-de-empresas'
) OR name_es ILIKE '%international%' 
  OR name_en ILIKE '%international%'
  OR slug_es ILIKE 'international-%';