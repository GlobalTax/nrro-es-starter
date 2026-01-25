-- Create enum for report categories
CREATE TYPE public.whistleblower_category AS ENUM (
  'fraude',
  'acoso',
  'corrupcion',
  'conflicto_intereses',
  'proteccion_datos',
  'medioambiente',
  'seguridad_laboral',
  'otro'
);

-- Create enum for report status
CREATE TYPE public.whistleblower_status AS ENUM (
  'nuevo',
  'en_revision',
  'investigando',
  'resuelto',
  'archivado'
);

-- Create enum for report priority
CREATE TYPE public.whistleblower_priority AS ENUM (
  'baja',
  'media',
  'alta',
  'critica'
);

-- Create enum for message sender type
CREATE TYPE public.whistleblower_sender AS ENUM (
  'denunciante',
  'admin'
);

-- Create whistleblower_reports table
CREATE TABLE public.whistleblower_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT UNIQUE NOT NULL,
  category public.whistleblower_category NOT NULL,
  description TEXT NOT NULL,
  date_of_incident DATE,
  location TEXT,
  persons_involved TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  contact_email TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  status public.whistleblower_status NOT NULL DEFAULT 'nuevo',
  priority public.whistleblower_priority NOT NULL DEFAULT 'media',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  internal_notes TEXT,
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create whistleblower_messages table for communication
CREATE TABLE public.whistleblower_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.whistleblower_reports(id) ON DELETE CASCADE,
  sender_type public.whistleblower_sender NOT NULL,
  message TEXT NOT NULL,
  attachment_urls TEXT[] DEFAULT '{}',
  is_visible_to_reporter BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_whistleblower_reports_status ON public.whistleblower_reports(status);
CREATE INDEX idx_whistleblower_reports_tracking_code ON public.whistleblower_reports(tracking_code);
CREATE INDEX idx_whistleblower_reports_created_at ON public.whistleblower_reports(created_at DESC);
CREATE INDEX idx_whistleblower_reports_priority ON public.whistleblower_reports(priority);
CREATE INDEX idx_whistleblower_messages_report_id ON public.whistleblower_messages(report_id);

-- Enable RLS
ALTER TABLE public.whistleblower_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whistleblower_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for whistleblower_reports
-- Only admins can view reports
CREATE POLICY "Admins can view all reports"
ON public.whistleblower_reports
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update reports
CREATE POLICY "Admins can update reports"
ON public.whistleblower_reports
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Edge function can insert reports (service role)
CREATE POLICY "Service role can insert reports"
ON public.whistleblower_reports
FOR INSERT
TO service_role
WITH CHECK (true);

-- RLS Policies for whistleblower_messages
-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.whistleblower_messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert messages
CREATE POLICY "Admins can insert messages"
ON public.whistleblower_messages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Service role can insert messages (for reporter responses)
CREATE POLICY "Service role can insert messages"
ON public.whistleblower_messages
FOR INSERT
TO service_role
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_whistleblower_reports_updated_at
BEFORE UPDATE ON public.whistleblower_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for evidence (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('whistleblower-evidence', 'whistleblower-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for whistleblower-evidence bucket
CREATE POLICY "Service role can upload evidence"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'whistleblower-evidence');

CREATE POLICY "Admins can view evidence"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'whistleblower-evidence' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Audit logging trigger for whistleblower reports
CREATE TRIGGER audit_whistleblower_reports
AFTER INSERT OR UPDATE OR DELETE ON public.whistleblower_reports
FOR EACH ROW EXECUTE FUNCTION public.log_entity_change();