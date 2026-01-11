-- Add client_logo_url column to generated_presentations
ALTER TABLE public.generated_presentations 
ADD COLUMN client_logo_url TEXT NULL;

-- Create storage bucket for client logos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-logos', 'client-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: public read access
CREATE POLICY "Public read access for client logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-logos');

-- Policy: authenticated upload
CREATE POLICY "Authenticated upload for client logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-logos');

-- Policy: authenticated delete
CREATE POLICY "Authenticated delete for client logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'client-logos');