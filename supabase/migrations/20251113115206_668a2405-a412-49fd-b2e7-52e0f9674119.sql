-- Crear bucket público para archivos estáticos como sitemap.xml
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-files',
  'public-files',
  true,
  5242880, -- 5MB máximo
  ARRAY['application/xml', 'text/xml', 'text/plain']
);

-- RLS Policy: Permitir lectura pública
CREATE POLICY "Public files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-files');

-- RLS Policy: Solo service_role puede escribir
CREATE POLICY "Service role can upload public files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-files' 
  AND (auth.role() = 'service_role')
);

-- RLS Policy: Service role puede actualizar
CREATE POLICY "Service role can update public files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'public-files'
  AND (auth.role() = 'service_role')
);

-- RLS Policy: Service role puede eliminar
CREATE POLICY "Service role can delete public files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public-files'
  AND (auth.role() = 'service_role')
);