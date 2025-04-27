-- Add cascade delete for profiles and companies when a user is deleted

-- First, drop the existing foreign key constraint on profiles
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Re-add the constraint with ON DELETE CASCADE
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Update the companies table foreign key constraint
ALTER TABLE public.companies
DROP CONSTRAINT IF EXISTS companies_user_id_fkey;

-- Re-add the constraint with ON DELETE CASCADE
ALTER TABLE public.companies
ADD CONSTRAINT companies_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Update any other tables that reference users or profiles
-- For example, if there's an api_keys table referencing companies:
ALTER TABLE public.api_keys
DROP CONSTRAINT IF EXISTS api_keys_company_id_fkey;

ALTER TABLE public.api_keys
ADD CONSTRAINT api_keys_company_id_fkey
FOREIGN KEY (company_id)
REFERENCES public.companies(id)
ON DELETE CASCADE;
