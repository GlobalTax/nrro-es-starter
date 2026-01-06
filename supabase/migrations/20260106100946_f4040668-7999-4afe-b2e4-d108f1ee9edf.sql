-- Simplificar descripción del servicio Herencias
UPDATE public.services
SET 
  description_es = 'Tramitación completa de herencias y sucesiones en Cataluña.',
  description_ca = 'Tramitació completa d''herències i successions a Catalunya.',
  description_en = 'Complete inheritance and succession management in Catalonia.',
  updated_at = now()
WHERE slug_es = 'herencias-sucesiones';