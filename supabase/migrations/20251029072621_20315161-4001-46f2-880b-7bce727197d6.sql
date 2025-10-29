-- Add hr_viewer role to app_role enum
-- This must be in a separate transaction from its usage
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'hr_viewer';