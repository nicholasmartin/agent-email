-- Add is_default column to prompt_templates table
ALTER TABLE public.prompt_templates 
  ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Create index for faster lookups by is_default flag
CREATE INDEX IF NOT EXISTS idx_prompt_templates_is_default 
  ON public.prompt_templates (is_default);
