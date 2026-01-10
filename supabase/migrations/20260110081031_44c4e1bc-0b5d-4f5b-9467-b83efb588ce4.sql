-- Create table for generated presentations history
CREATE TABLE public.generated_presentations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_company TEXT,
  sector TEXT,
  language TEXT NOT NULL DEFAULT 'es',
  format TEXT NOT NULL DEFAULT 'horizontal',
  services_included JSONB DEFAULT '[]'::jsonb,
  team_members_included JSONB DEFAULT '[]'::jsonb,
  case_studies_included JSONB DEFAULT '[]'::jsonb,
  include_stats BOOLEAN DEFAULT true,
  custom_intro TEXT,
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  generated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generated_presentations ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all generated presentations"
  ON public.generated_presentations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create generated presentations"
  ON public.generated_presentations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update generated presentations"
  ON public.generated_presentations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete generated presentations"
  ON public.generated_presentations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_generated_presentations_updated_at
  BEFORE UPDATE ON public.generated_presentations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();