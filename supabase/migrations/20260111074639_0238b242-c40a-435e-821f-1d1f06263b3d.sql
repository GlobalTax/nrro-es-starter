-- Add html_content column to store the generated presentation HTML
ALTER TABLE public.generated_presentations 
ADD COLUMN IF NOT EXISTS html_content TEXT;