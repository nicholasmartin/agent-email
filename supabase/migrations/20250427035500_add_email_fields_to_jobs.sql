-- Add email_subject and email_body fields to jobs table
ALTER TABLE public.jobs 
  ADD COLUMN email_subject TEXT,
  ADD COLUMN email_body TEXT;

-- Comment on the new columns
COMMENT ON COLUMN public.jobs.email_subject IS 'Subject line for the generated email';
COMMENT ON COLUMN public.jobs.email_body IS 'HTML content of the generated email body';
