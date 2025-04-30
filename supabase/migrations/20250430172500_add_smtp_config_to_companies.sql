-- Add SMTP configuration fields to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS smtp_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS smtp_host TEXT,
ADD COLUMN IF NOT EXISTS smtp_port INTEGER,
ADD COLUMN IF NOT EXISTS smtp_user TEXT,
ADD COLUMN IF NOT EXISTS smtp_password TEXT,
ADD COLUMN IF NOT EXISTS smtp_from_email TEXT,
ADD COLUMN IF NOT EXISTS smtp_from_name TEXT,
ADD COLUMN IF NOT EXISTS smtp_secure BOOLEAN DEFAULT true;

-- Add comment to explain the purpose of these fields
COMMENT ON COLUMN public.companies.smtp_enabled IS 'Whether custom SMTP is enabled for this company';
COMMENT ON COLUMN public.companies.smtp_host IS 'SMTP server hostname';
COMMENT ON COLUMN public.companies.smtp_port IS 'SMTP server port';
COMMENT ON COLUMN public.companies.smtp_user IS 'SMTP username/login';
COMMENT ON COLUMN public.companies.smtp_password IS 'SMTP password (should be encrypted in production)';
COMMENT ON COLUMN public.companies.smtp_from_email IS 'Email address to send from';
COMMENT ON COLUMN public.companies.smtp_from_name IS 'Name to display as sender';
COMMENT ON COLUMN public.companies.smtp_secure IS 'Whether to use TLS/SSL for SMTP connection';
