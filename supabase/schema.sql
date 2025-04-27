

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."create_debug_logs_table"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'debug_logs'
  ) THEN
    -- Create the table
    CREATE TABLE public.debug_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type TEXT,
      message TEXT,
      url TEXT,
      server_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      timestamp TEXT,
      ip_address TEXT,
      user_agent TEXT,
      hash_params JSONB,
      extra_data JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Add RLS policies
    ALTER TABLE public.debug_logs ENABLE ROW LEVEL SECURITY;
    
    -- Create policy to allow service role to insert
    CREATE POLICY "Service role can insert debug logs"
      ON public.debug_logs
      FOR INSERT
      TO service_role
      WITH CHECK (true);
    
    -- Create policy to allow authenticated users to view their own logs
    CREATE POLICY "Users can view their own logs"
      ON public.debug_logs
      FOR SELECT
      TO authenticated
      USING (ip_address = (SELECT ip_address FROM public.debug_logs WHERE id = public.debug_logs.id));
  END IF;
END;
$$;


ALTER FUNCTION "public"."create_debug_logs_table"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Extract first_name and last_name from user metadata if available
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'firstname')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'lastname')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'avatar_url')::TEXT, '')
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user_company"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_new_user_company"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment"("row_id" "uuid") RETURNS integer
    LANGUAGE "sql"
    AS $$
  UPDATE public.jobs
  SET retry_count = retry_count + 1
  WHERE id = row_id
  RETURNING retry_count;
$$;


ALTER FUNCTION "public"."increment"("row_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_companies_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_companies_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_prompt_templates_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_prompt_templates_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_trial_on_registration"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Update the trial record when a user registers with the same email
  UPDATE public.trials
  SET has_registered = true
  WHERE email = NEW.email;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_trial_on_registration"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."api_keys" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "company_id" "uuid",
    "key_prefix" "text" NOT NULL,
    "key_hash" "text" NOT NULL,
    "key_salt" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    "last_used_at" timestamp with time zone,
    "scopes" "text"[] DEFAULT '{}'::"text"[],
    "usage_count" integer DEFAULT 0,
    "rate_limit" integer DEFAULT 1000,
    "active" boolean DEFAULT true
);


ALTER TABLE "public"."api_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "website" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "active" boolean DEFAULT true,
    "default_api_key_id" "uuid",
    "user_id" "uuid"
);


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."debug_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "type" "text",
    "message" "text",
    "url" "text",
    "server_timestamp" timestamp with time zone DEFAULT "now"(),
    "timestamp" "text",
    "ip_address" "text",
    "user_agent" "text",
    "hash_params" "jsonb",
    "extra_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."debug_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" "text" NOT NULL,
    "domain" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "scrape_job_id" "text",
    "scrape_result" "jsonb",
    "email_draft" "jsonb",
    "error_message" "text",
    "retry_count" integer DEFAULT 0,
    "api_key" "text",
    "api_key_id" "uuid",
    "from_website" boolean DEFAULT false,
    "company_id" "uuid",
    "user_id" "uuid",
    "email_sent" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "first_name" "text",
    "last_name" "text",
    "full_name" "text" GENERATED ALWAYS AS ((("first_name" || ' '::"text") || "last_name")) STORED,
    "email_subject" "text",
    "email_body" "text"
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


COMMENT ON COLUMN "public"."jobs"."email_subject" IS 'Subject line for the generated email';



COMMENT ON COLUMN "public"."jobs"."email_body" IS 'HTML content of the generated email body';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "full_name" "text" GENERATED ALWAYS AS ((("first_name" || ' '::"text") || "last_name")) STORED,
    "avatar_url" "text",
    "website" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."prompt_templates" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "company_id" "uuid",
    "name" "text" NOT NULL,
    "template" "text" NOT NULL,
    "tone" character varying(50) DEFAULT 'conversational'::character varying,
    "style" character varying(50) DEFAULT 'formal'::character varying,
    "max_length" integer DEFAULT 200,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "active" boolean DEFAULT true,
    "is_default" boolean DEFAULT false
);


ALTER TABLE "public"."prompt_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trials" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "has_registered" boolean DEFAULT false,
    "job_id" "uuid",
    "last_email_sent_at" timestamp with time zone
);


ALTER TABLE "public"."trials" OWNER TO "postgres";


ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."debug_logs"
    ADD CONSTRAINT "debug_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prompt_templates"
    ADD CONSTRAINT "prompt_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trials"
    ADD CONSTRAINT "trials_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_api_keys_company_id" ON "public"."api_keys" USING "btree" ("company_id");



CREATE INDEX "idx_api_keys_key_hash" ON "public"."api_keys" USING "btree" ("key_hash");



CREATE INDEX "idx_api_keys_key_prefix" ON "public"."api_keys" USING "btree" ("key_prefix");



CREATE INDEX "idx_companies_user_id" ON "public"."companies" USING "btree" ("user_id");



CREATE INDEX "idx_jobs_api_key" ON "public"."jobs" USING "btree" ("api_key");



CREATE INDEX "idx_jobs_api_key_id" ON "public"."jobs" USING "btree" ("api_key_id");



CREATE INDEX "idx_jobs_company_id" ON "public"."jobs" USING "btree" ("company_id");



CREATE INDEX "idx_jobs_from_website" ON "public"."jobs" USING "btree" ("from_website");



CREATE INDEX "idx_jobs_metadata_trial_id" ON "public"."jobs" USING "btree" ((("metadata" ->> 'trial_id'::"text")));



CREATE INDEX "idx_jobs_status" ON "public"."jobs" USING "btree" ("status");



CREATE INDEX "idx_prompt_templates_active" ON "public"."prompt_templates" USING "btree" ("active");



CREATE INDEX "idx_prompt_templates_company_id" ON "public"."prompt_templates" USING "btree" ("company_id", "active");



CREATE INDEX "idx_prompt_templates_is_default" ON "public"."prompt_templates" USING "btree" ("is_default");



CREATE INDEX "jobs_email_sent_idx" ON "public"."jobs" USING "btree" ("email_sent");



CREATE INDEX "jobs_user_id_idx" ON "public"."jobs" USING "btree" ("user_id");



CREATE INDEX "profiles_id_idx" ON "public"."profiles" USING "btree" ("id");



CREATE INDEX "trials_email_idx" ON "public"."trials" USING "btree" ("email");



CREATE OR REPLACE TRIGGER "update_companies_updated_at" BEFORE UPDATE ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."update_companies_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_prompt_templates_updated_at" BEFORE UPDATE ON "public"."prompt_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_prompt_templates_updated_at_column"();



ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_default_api_key_id_fkey" FOREIGN KEY ("default_api_key_id") REFERENCES "public"."api_keys"("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prompt_templates"
    ADD CONSTRAINT "prompt_templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trials"
    ADD CONSTRAINT "trials_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id");



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Service Role Full Access" ON "public"."jobs" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can access all trials" ON "public"."trials" TO "service_role" USING (true);



CREATE POLICY "Service role can do all operations on api_keys" ON "public"."api_keys" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do all operations on companies" ON "public"."companies" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do all operations on jobs" ON "public"."jobs" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do all operations on prompt templates" ON "public"."prompt_templates" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do all operations on prompt_templates" ON "public"."prompt_templates" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do anything" ON "public"."jobs" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can insert debug logs" ON "public"."debug_logs" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Users can insert prompt templates for their companies" ON "public"."prompt_templates" FOR INSERT WITH CHECK (("company_id" IN ( SELECT "c"."id"
   FROM "public"."companies" "c"
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can insert their own companies" ON "public"."companies" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update prompt templates for their companies" ON "public"."prompt_templates" FOR UPDATE USING (("company_id" IN ( SELECT "c"."id"
   FROM "public"."companies" "c"
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can update their own companies" ON "public"."companies" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own jobs" ON "public"."jobs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view prompt templates for their companies" ON "public"."prompt_templates" FOR SELECT USING (("company_id" IN ( SELECT "c"."id"
   FROM "public"."companies" "c"
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own companies" ON "public"."companies" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own jobs" ON "public"."jobs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own logs" ON "public"."debug_logs" FOR SELECT TO "authenticated" USING (("ip_address" = ( SELECT "debug_logs_1"."ip_address"
   FROM "public"."debug_logs" "debug_logs_1"
  WHERE ("debug_logs_1"."id" = "debug_logs_1"."id"))));



CREATE POLICY "Users can view their own trial" ON "public"."trials" FOR SELECT TO "authenticated" USING (("email" = ("auth"."jwt"() ->> 'email'::"text")));



ALTER TABLE "public"."api_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."debug_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."prompt_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trials" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."create_debug_logs_table"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_debug_logs_table"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_debug_logs_table"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user_company"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user_company"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user_company"() TO "service_role";



GRANT ALL ON FUNCTION "public"."increment"("row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment"("row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment"("row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_companies_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_companies_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_companies_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_prompt_templates_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_prompt_templates_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_prompt_templates_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_trial_on_registration"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_trial_on_registration"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_trial_on_registration"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."api_keys" TO "anon";
GRANT ALL ON TABLE "public"."api_keys" TO "authenticated";
GRANT ALL ON TABLE "public"."api_keys" TO "service_role";



GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";



GRANT ALL ON TABLE "public"."debug_logs" TO "anon";
GRANT ALL ON TABLE "public"."debug_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."debug_logs" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."prompt_templates" TO "anon";
GRANT ALL ON TABLE "public"."prompt_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."prompt_templates" TO "service_role";



GRANT ALL ON TABLE "public"."trials" TO "anon";
GRANT ALL ON TABLE "public"."trials" TO "authenticated";
GRANT ALL ON TABLE "public"."trials" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
