-- Create enum for lead status
CREATE TYPE public.ley_beckham_lead_status AS ENUM (
  'nuevo',
  'contactado',
  'documentacion',
  'en_proceso',
  'completado',
  'descartado'
);

-- Create enum for priority
CREATE TYPE public.lead_priority AS ENUM (
  'baja',
  'media',
  'alta',
  'urgente'
);

-- Create table for Ley Beckham leads
CREATE TABLE public.ley_beckham_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_lead_id UUID REFERENCES public.contact_leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  country TEXT NOT NULL,
  job_situation TEXT NOT NULL,
  estimated_move_date DATE,
  current_salary NUMERIC,
  message TEXT,
  status public.ley_beckham_lead_status NOT NULL DEFAULT 'nuevo',
  priority public.lead_priority NOT NULL DEFAULT 'media',
  eligibility_score INTEGER CHECK (eligibility_score >= 0 AND eligibility_score <= 100),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create table for lead notes
CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.ley_beckham_leads(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_internal BOOLEAN DEFAULT true
);

-- Create table for lead status history
CREATE TABLE public.lead_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.ley_beckham_leads(id) ON DELETE CASCADE NOT NULL,
  from_status public.ley_beckham_lead_status,
  to_status public.ley_beckham_lead_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- Create table for document checklist
CREATE TABLE public.lead_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.ley_beckham_leads(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  is_received BOOLEAN DEFAULT false,
  file_url TEXT,
  received_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_ley_beckham_leads_status ON public.ley_beckham_leads(status);
CREATE INDEX idx_ley_beckham_leads_priority ON public.ley_beckham_leads(priority);
CREATE INDEX idx_ley_beckham_leads_created_at ON public.ley_beckham_leads(created_at DESC);
CREATE INDEX idx_ley_beckham_leads_email ON public.ley_beckham_leads(email);
CREATE INDEX idx_lead_notes_lead_id ON public.lead_notes(lead_id);
CREATE INDEX idx_lead_status_history_lead_id ON public.lead_status_history(lead_id);
CREATE INDEX idx_lead_documents_lead_id ON public.lead_documents(lead_id);

-- Enable RLS
ALTER TABLE public.ley_beckham_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ley_beckham_leads
CREATE POLICY "Admins can view all Ley Beckham leads"
  ON public.ley_beckham_leads FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert Ley Beckham leads"
  ON public.ley_beckham_leads FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update Ley Beckham leads"
  ON public.ley_beckham_leads FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete Ley Beckham leads"
  ON public.ley_beckham_leads FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert leads"
  ON public.ley_beckham_leads FOR INSERT
  WITH CHECK (true);

-- RLS Policies for lead_notes
CREATE POLICY "Admins can manage lead notes"
  ON public.lead_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for lead_status_history
CREATE POLICY "Admins can view lead status history"
  ON public.lead_status_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert status history"
  ON public.lead_status_history FOR INSERT
  WITH CHECK (true);

-- RLS Policies for lead_documents
CREATE POLICY "Admins can manage lead documents"
  ON public.lead_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_ley_beckham_leads_updated_at
  BEFORE UPDATE ON public.ley_beckham_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_documents_updated_at
  BEFORE UPDATE ON public.lead_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to log status changes
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    INSERT INTO public.lead_status_history (lead_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER log_ley_beckham_lead_status_change
  AFTER UPDATE ON public.ley_beckham_leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_status_change();

-- Function to calculate priority based on move date
CREATE OR REPLACE FUNCTION calculate_lead_priority(move_date DATE)
RETURNS public.lead_priority AS $$
DECLARE
  days_until_move INTEGER;
BEGIN
  IF move_date IS NULL THEN
    RETURN 'media'::public.lead_priority;
  END IF;
  
  days_until_move := move_date - CURRENT_DATE;
  
  IF days_until_move < 30 THEN
    RETURN 'urgente'::public.lead_priority;
  ELSIF days_until_move < 90 THEN
    RETURN 'alta'::public.lead_priority;
  ELSIF days_until_move < 180 THEN
    RETURN 'media'::public.lead_priority;
  ELSE
    RETURN 'baja'::public.lead_priority;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get lead statistics
CREATE OR REPLACE FUNCTION get_ley_beckham_stats()
RETURNS TABLE(
  total_leads BIGINT,
  leads_by_status JSONB,
  leads_by_priority JSONB,
  leads_by_country JSONB,
  leads_by_job_situation JSONB,
  avg_eligibility_score NUMERIC,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_leads,
    jsonb_object_agg(status, status_count) as leads_by_status,
    jsonb_object_agg(priority, priority_count) as leads_by_priority,
    jsonb_object_agg(country, country_count) as leads_by_country,
    jsonb_object_agg(job_situation, job_count) as leads_by_job_situation,
    AVG(eligibility_score) as avg_eligibility_score,
    ROUND((COUNT(*) FILTER (WHERE status = 'completado')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 2) as conversion_rate
  FROM (
    SELECT 
      status,
      priority,
      country,
      job_situation,
      eligibility_score,
      COUNT(*) OVER (PARTITION BY status) as status_count,
      COUNT(*) OVER (PARTITION BY priority) as priority_count,
      COUNT(*) OVER (PARTITION BY country) as country_count,
      COUNT(*) OVER (PARTITION BY job_situation) as job_count
    FROM public.ley_beckham_leads
  ) subquery
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;