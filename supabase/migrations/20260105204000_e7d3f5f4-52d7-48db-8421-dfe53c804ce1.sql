-- Create bucket for resource thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-thumbnails', 'resource-thumbnails', true);

-- Policy for public read access
CREATE POLICY "Public read access for resource thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'resource-thumbnails');

-- Policy for authenticated upload access
CREATE POLICY "Authenticated upload for resource thumbnails" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resource-thumbnails');

-- Policy for authenticated update access
CREATE POLICY "Authenticated update for resource thumbnails" ON storage.objects
FOR UPDATE USING (bucket_id = 'resource-thumbnails');

-- Policy for authenticated delete access
CREATE POLICY "Authenticated delete for resource thumbnails" ON storage.objects
FOR DELETE USING (bucket_id = 'resource-thumbnails');