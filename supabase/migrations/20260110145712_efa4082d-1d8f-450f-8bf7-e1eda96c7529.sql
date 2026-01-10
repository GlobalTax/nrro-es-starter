-- Make corporate-presentations bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'corporate-presentations';

-- Policy for uploading files (INSERT)
CREATE POLICY "Authenticated users can upload presentations"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'corporate-presentations');

-- Policy for reading files (SELECT) - public access
CREATE POLICY "Anyone can read presentations"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'corporate-presentations');

-- Policy for deleting files (DELETE)
CREATE POLICY "Authenticated users can delete presentations"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'corporate-presentations');