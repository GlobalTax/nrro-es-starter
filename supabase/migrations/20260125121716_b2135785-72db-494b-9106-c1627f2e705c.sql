-- Update current company: set nrro.es (Navarro Abogados) as current
UPDATE public.topbar_group_companies 
SET is_current = false 
WHERE is_current = true;

UPDATE public.topbar_group_companies 
SET is_current = true 
WHERE url LIKE '%nrro.es%' 
  AND url NOT LIKE '%global%' 
  AND url NOT LIKE '%int.%';