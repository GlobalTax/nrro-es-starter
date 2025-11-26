-- Add new columns to landing_pages table for LMS functionality
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS url TEXT,
ADD COLUMN IF NOT EXISTS utm_url TEXT,
ADD COLUMN IF NOT EXISTS qr_code TEXT,
ADD COLUMN IF NOT EXISTS ads_campaigns TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Update status field to include 'needs_review' if using CHECK constraint
-- Since status is just text, we don't need to alter it, just document the valid values
COMMENT ON COLUMN landing_pages.status IS 'Valid values: draft, published, needs_review, archived';
COMMENT ON COLUMN landing_pages.category IS 'Valid values: Tax, Legal, Payroll, Corporate, M&A, International, Family Business, Contact, Other';