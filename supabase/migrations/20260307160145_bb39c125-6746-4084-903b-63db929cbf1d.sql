
-- Add website column to contact_leads
ALTER TABLE public.contact_leads ADD COLUMN IF NOT EXISTS website text;

-- Create audit_schedule table
CREATE TABLE public.audit_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  label text NOT NULL DEFAULT '',
  frequency text NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'monthly')),
  is_active boolean NOT NULL DEFAULT true,
  last_audit_at timestamptz,
  last_score integer,
  last_audit_id uuid REFERENCES public.marketing_audits(id),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_schedule ENABLE ROW LEVEL SECURITY;

-- Trigger to auto-audit when a new lead with website is inserted
CREATE OR REPLACE FUNCTION public.trigger_auto_marketing_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.website IS NOT NULL AND trim(NEW.website) != '' THEN
    PERFORM net.http_post(
      url := 'https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/auto-marketing-audit',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudG90Y3BhZ2t1bnZrd3B1YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc5MDUsImV4cCI6MjA2ODUwMzkwNX0.YaVxgYF91UyCkSc8nqsVSACP2Xs4r5--sE8EtLnzMCI'
      ),
      body := jsonb_build_object('mode', 'single', 'url', NEW.website, 'lead_id', NEW.id)
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error triggering auto marketing audit: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_contact_lead_auto_audit
  AFTER INSERT ON public.contact_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_auto_marketing_audit();
