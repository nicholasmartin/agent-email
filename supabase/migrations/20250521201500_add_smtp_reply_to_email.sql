-- Add SMTP reply-to email field to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS smtp_reply_to_email TEXT;

-- Add comment to explain the purpose of this field
COMMENT ON COLUMN public.companies.smtp_reply_to_email IS 'Optional email address for replies to be sent to instead of the from email';
