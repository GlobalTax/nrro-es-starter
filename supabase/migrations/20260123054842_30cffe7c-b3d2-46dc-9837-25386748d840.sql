-- Corregir el artículo reciente que se guardó incorrectamente como 'int' en lugar de 'es'
UPDATE blog_posts 
SET source_site = 'es' 
WHERE id = '44f2b5bf-fe5d-4569-9f7e-fc0ddb0b0a0b';