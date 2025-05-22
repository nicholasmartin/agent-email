-- Add SMTP signature field to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS smtp_signature TEXT;

-- Add comment to explain the purpose of this field
COMMENT ON COLUMN public.companies.smtp_signature IS 'HTML content to appear at the end of emails as a signature';
