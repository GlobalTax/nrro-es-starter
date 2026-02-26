-- Normalize specialization values: trim whitespace to eliminate duplicates
UPDATE public.team_members SET specialization_es = TRIM(specialization_es) WHERE specialization_es IS NOT NULL AND specialization_es != TRIM(specialization_es);
UPDATE public.team_members SET specialization_ca = TRIM(specialization_ca) WHERE specialization_ca IS NOT NULL AND specialization_ca != TRIM(specialization_ca);
UPDATE public.team_members SET specialization_en = TRIM(specialization_en) WHERE specialization_en IS NOT NULL AND specialization_en != TRIM(specialization_en);
-- Also normalize position values just in case
UPDATE public.team_members SET position_es = TRIM(position_es) WHERE position_es IS NOT NULL AND position_es != TRIM(position_es);
UPDATE public.team_members SET position_ca = TRIM(position_ca) WHERE position_ca IS NOT NULL AND position_ca != TRIM(position_ca);
UPDATE public.team_members SET position_en = TRIM(position_en) WHERE position_en IS NOT NULL AND position_en != TRIM(position_en);