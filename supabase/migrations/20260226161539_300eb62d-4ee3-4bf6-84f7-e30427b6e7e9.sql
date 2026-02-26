CREATE TABLE public.marketing_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  global_score INTEGER DEFAULT 0,
  category_scores JSONB DEFAULT '{}'::jsonb,
  checklist_data JSONB DEFAULT '[]'::jsonb,
  notes JSONB DEFAULT '{}'::jsonb,
  quick_wins JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  raw_analysis JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.marketing_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audits" ON public.marketing_audits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert audits" ON public.marketing_audits
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update own audits" ON public.marketing_audits
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER update_marketing_audits_updated_at
  BEFORE UPDATE ON public.marketing_audits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();