-- Update Jobs table to replace name with first_name and last_name
ALTER TABLE public.jobs 
  -- First, add the new columns
  ADD COLUMN first_name TEXT,
  ADD COLUMN last_name TEXT;

-- Copy data from name to first_name (assuming first word is first name)
UPDATE public.jobs 
SET 
  first_name = SPLIT_PART(name, ' ', 1),
  last_name = SUBSTRING(name FROM POSITION(' ' IN name) + 1);

-- We're keeping first_name and last_name as optional fields
-- No need to set NOT NULL constraints

-- Drop the old name column
ALTER TABLE public.jobs 
  DROP COLUMN name;

-- Add a generated column for full name (similar to profiles table)
ALTER TABLE public.jobs
  ADD COLUMN full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED;
