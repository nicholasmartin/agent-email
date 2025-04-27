-- Add user_id to companies table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'companies' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.companies ADD COLUMN user_id UUID REFERENCES auth.users(id);
        
        -- Create an index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
    END IF;
END
$$;

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT,
  slug TEXT UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  default_api_key_id UUID
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table
CREATE POLICY "Users can view their own companies" 
  ON public.companies FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies" 
  ON public.companies FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" 
  ON public.companies FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a function to handle new user signup and create a company
CREATE OR REPLACE FUNCTION public.handle_new_user_company() 
RETURNS TRIGGER AS $$
DECLARE
  profile_first_name TEXT;
  profile_last_name TEXT;
  company_name TEXT;
  company_slug TEXT;
BEGIN
  -- Get the user's profile information
  SELECT first_name, last_name INTO profile_first_name, profile_last_name
  FROM public.profiles
  WHERE id = NEW.id;
  
  -- Create a default company name and slug
  company_name := COALESCE(profile_first_name, '') || '''s Company';
  company_slug := LOWER(REGEXP_REPLACE(COALESCE(profile_first_name, 'user') || '-company-' || SUBSTRING(NEW.id::text, 1, 8), '[^a-z0-9\-]', '-', 'g'));
  
  -- Insert a new company record
  INSERT INTO public.companies (
    name,
    slug,
    active,
    user_id
  ) VALUES (
    company_name,
    company_slug,
    true,
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created_company ON auth.users;
CREATE TRIGGER on_auth_user_created_company
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_company();

-- Create a function to update the updated_at column for companies
CREATE OR REPLACE FUNCTION public.update_companies_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a company is updated
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_companies_updated_at_column();

-- Create a service role policy to allow the service role to manage all companies (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'companies' 
        AND policyname = 'Service role can do all operations on companies'
    ) THEN
        CREATE POLICY "Service role can do all operations on companies" 
          ON public.companies 
          USING (true) 
          WITH CHECK (true);
    END IF;
END
$$;
