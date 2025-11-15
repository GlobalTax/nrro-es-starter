-- Create company_setup_leads table for A/B testing landing pages
CREATE TABLE IF NOT EXISTS company_setup_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  
  -- Business details
  country_origin TEXT NOT NULL,
  industry TEXT,
  estimated_revenue TEXT,
  timeline TEXT CHECK (timeline IN ('immediate', '1-month', '3-months', '6-months', 'exploring')),
  company_stage TEXT CHECK (company_stage IN ('idea', 'registered-abroad', 'ready-to-register', 'relocating')),
  
  -- Landing variant (CRITICAL for A/B testing)
  landing_variant TEXT NOT NULL CHECK (landing_variant IN ('calculator', 'nie-hell', 'tech-startup', 'express')),
  conversion_type TEXT CHECK (conversion_type IN ('calculator-download', 'nie-service', 'full-service', 'express-booking', 'consultation', 'lead-magnet')),
  
  -- Lead management
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'consultation-booked', 'proposal-sent', 'won', 'lost')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  lead_score INTEGER DEFAULT 50,
  
  -- Marketing attribution
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_term TEXT,
  utm_content TEXT,
  landing_page_url TEXT,
  referrer TEXT,
  
  -- Calculator-specific data (JSON for flexibility)
  calculator_data JSONB,
  
  -- Additional
  message TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  contacted_at TIMESTAMPTZ,
  consultation_date TIMESTAMPTZ,
  
  -- Technical
  ip_address TEXT,
  user_agent TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_setup_variant ON company_setup_leads(landing_variant);
CREATE INDEX IF NOT EXISTS idx_company_setup_status ON company_setup_leads(status);
CREATE INDEX IF NOT EXISTS idx_company_setup_created ON company_setup_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_setup_priority ON company_setup_leads(priority);
CREATE INDEX IF NOT EXISTS idx_company_setup_country ON company_setup_leads(country_origin);
CREATE INDEX IF NOT EXISTS idx_company_setup_email ON company_setup_leads(email);

-- Enable RLS
ALTER TABLE company_setup_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can insert company setup leads"
  ON company_setup_leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view all company setup leads"
  ON company_setup_leads FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update company setup leads"
  ON company_setup_leads FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete company setup leads"
  ON company_setup_leads FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_company_setup_leads_updated_at
  BEFORE UPDATE ON company_setup_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();