-- Create prompt_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  tone TEXT NOT NULL,
  style TEXT NOT NULL,
  max_length INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for prompt_templates table
CREATE POLICY "Users can view prompt templates for their companies" 
  ON public.prompt_templates FOR SELECT 
  USING (
    company_id IN (
      SELECT c.id FROM public.companies c
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert prompt templates for their companies" 
  ON public.prompt_templates FOR INSERT 
  WITH CHECK (
    company_id IN (
      SELECT c.id FROM public.companies c
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update prompt templates for their companies" 
  ON public.prompt_templates FOR UPDATE 
  USING (
    company_id IN (
      SELECT c.id FROM public.companies c
      WHERE c.user_id = auth.uid()
    )
  );

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_prompt_templates_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a prompt template is updated
DROP TRIGGER IF EXISTS update_prompt_templates_updated_at ON public.prompt_templates;
CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON public.prompt_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_prompt_templates_updated_at_column();

-- Create a service role policy to allow the service role to manage all prompt templates
CREATE POLICY "Service role can do all operations on prompt templates" 
  ON public.prompt_templates 
  USING (true) 
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_prompt_templates_company_id ON public.prompt_templates(company_id);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_active ON public.prompt_templates(active);
