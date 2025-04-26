

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
  INSERT INTO public.profiles (id, name, account_completed)
  VALUES (new.id, new.raw_user_meta_data->>'name', 
         (new.raw_user_meta_data->>'account_completed')::boolean);
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment"("row_id" "uuid") RETURNS integer
    LANGUAGE "sql"
    AS $$
  UPDATE public.jobs
  SET retry_count = retry_count + 1
  WHERE id = row_id
  RETURNING retry_count;
$$;


ALTER FUNCTION "public"."increment"("row_id" "uuid") OWNER TO "postgres";


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
    "default_api_key_id" "uuid"
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
    "name" "text" NOT NULL,
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
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "account_completed" boolean DEFAULT false
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
    "active" boolean DEFAULT true
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



CREATE INDEX "idx_jobs_api_key" ON "public"."jobs" USING "btree" ("api_key");



CREATE INDEX "idx_jobs_api_key_id" ON "public"."jobs" USING "btree" ("api_key_id");



CREATE INDEX "idx_jobs_company_id" ON "public"."jobs" USING "btree" ("company_id");



CREATE INDEX "idx_jobs_from_website" ON "public"."jobs" USING "btree" ("from_website");



CREATE INDEX "idx_jobs_metadata_trial_id" ON "public"."jobs" USING "btree" ((("metadata" ->> 'trial_id'::"text")));



CREATE INDEX "idx_jobs_status" ON "public"."jobs" USING "btree" ("status");



CREATE INDEX "idx_prompt_templates_company_id" ON "public"."prompt_templates" USING "btree" ("company_id", "active");



CREATE INDEX "jobs_email_sent_idx" ON "public"."jobs" USING "btree" ("email_sent");



CREATE INDEX "jobs_user_id_idx" ON "public"."jobs" USING "btree" ("user_id");



CREATE INDEX "trials_email_idx" ON "public"."trials" USING "btree" ("email");



ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_default_api_key_id_fkey" FOREIGN KEY ("default_api_key_id") REFERENCES "public"."api_keys"("id");



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



CREATE POLICY "Service Role Full Access" ON "public"."jobs" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can access all trials" ON "public"."trials" TO "service_role" USING (true);



CREATE POLICY "Service role can do all operations on api_keys" ON "public"."api_keys" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do all operations on companies" ON "public"."companies" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do all operations on jobs" ON "public"."jobs" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do all operations on prompt_templates" ON "public"."prompt_templates" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can do anything" ON "public"."jobs" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can insert debug logs" ON "public"."debug_logs" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own jobs" ON "public"."jobs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own jobs" ON "public"."jobs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own logs" ON "public"."debug_logs" FOR SELECT TO "authenticated" USING (("ip_address" = ( SELECT "debug_logs_1"."ip_address"
   FROM "public"."debug_logs" "debug_logs_1"
  WHERE ("debug_logs_1"."id" = "debug_logs_1"."id"))));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



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



GRANT ALL ON FUNCTION "public"."increment"("row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment"("row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment"("row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_trial_on_registration"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_trial_on_registration"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_trial_on_registration"() TO "service_role";


















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
