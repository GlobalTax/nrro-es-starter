-- Tabla de plantillas de propuestas
CREATE TABLE public.proposal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('fiscal', 'contabilidad', 'laboral', 'mercantil', 'ma', 'integral')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Catálogo de servicios para propuestas
CREATE TABLE public.proposal_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  default_price DECIMAL(10,2),
  price_type TEXT DEFAULT 'monthly' CHECK (price_type IN ('fixed', 'monthly', 'annual')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Propuestas generadas
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_email TEXT,
  contact_lead_id UUID REFERENCES public.contact_leads(id),
  services JSONB NOT NULL DEFAULT '[]',
  fees JSONB NOT NULL DEFAULT '{}',
  total_amount DECIMAL(10,2),
  valid_until DATE,
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  pdf_url TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bucket de storage para plantillas
INSERT INTO storage.buckets (id, name, public) VALUES ('proposal-templates', 'proposal-templates', false);

-- RLS policies
ALTER TABLE public.proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policies para admins (usando has_role function existente)
CREATE POLICY "Admins can manage proposal_templates" ON public.proposal_templates
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can manage proposal_services" ON public.proposal_services
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can manage proposals" ON public.proposals
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Storage policies para proposal-templates bucket
CREATE POLICY "Admins can upload proposal templates" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'proposal-templates' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "Admins can view proposal templates" ON storage.objects
  FOR SELECT USING (bucket_id = 'proposal-templates' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "Admins can update proposal templates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'proposal-templates' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "Admins can delete proposal templates" ON storage.objects
  FOR DELETE USING (bucket_id = 'proposal-templates' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

-- Trigger para updated_at
CREATE TRIGGER update_proposal_templates_updated_at
  BEFORE UPDATE ON public.proposal_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar servicios predefinidos
INSERT INTO public.proposal_services (name, description, category, default_price, price_type, display_order) VALUES
  ('Asesoramiento fiscal integral', 'Planificación y cumplimiento de obligaciones fiscales', 'fiscal', 500.00, 'monthly', 1),
  ('Declaraciones trimestrales IVA e IRPF', 'Presentación de modelos 303, 130/131', 'fiscal', 150.00, 'monthly', 2),
  ('Impuesto de Sociedades', 'Preparación y presentación del modelo 200', 'fiscal', 800.00, 'annual', 3),
  ('Contabilidad mensual', 'Registro contable y reporting mensual', 'contabilidad', 400.00, 'monthly', 4),
  ('Cuentas anuales', 'Elaboración y depósito de cuentas anuales', 'contabilidad', 600.00, 'annual', 5),
  ('Gestión de nóminas', 'Elaboración de nóminas y seguros sociales', 'laboral', 25.00, 'monthly', 6),
  ('Contratos laborales', 'Redacción y registro de contratos', 'laboral', 100.00, 'fixed', 7),
  ('Asesoramiento mercantil', 'Gobierno corporativo y cumplimiento societario', 'mercantil', 600.00, 'monthly', 8),
  ('Secretaría societaria', 'Actas, certificados y libros legales', 'mercantil', 300.00, 'monthly', 9),
  ('Due diligence fiscal', 'Revisión fiscal en operaciones de M&A', 'ma', 5000.00, 'fixed', 10);