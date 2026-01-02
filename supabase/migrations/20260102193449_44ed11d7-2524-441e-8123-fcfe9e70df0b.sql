-- Actualizar URLs en site_pages de nrro.es a int.nrro.es
UPDATE site_pages
SET url = REPLACE(url, 'https://nrro.es', 'https://int.nrro.es'),
    updated_at = now()
WHERE url LIKE 'https://nrro.es%';