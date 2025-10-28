-- Create demo_requests table for Orquest + KairosHR landing page
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  restaurant_name TEXT,
  message TEXT,
  source TEXT DEFAULT 'orquest-kairoshr-landing',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view all demo requests
CREATE POLICY "Authenticated users can view demo requests"
  ON public.demo_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow insertions (public can submit demos)
CREATE POLICY "Anyone can submit demo requests"
  ON public.demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON public.demo_requests(email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON public.demo_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON public.demo_requests(status);