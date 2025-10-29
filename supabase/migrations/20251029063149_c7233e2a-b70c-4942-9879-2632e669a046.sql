-- Security Fix Part 1: Add hr_manager role to app_role enum
-- This must be in a separate transaction before it can be used in policies

ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'hr_manager';