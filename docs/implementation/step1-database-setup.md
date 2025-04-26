# Step 1: Database Setup

The database schema is already set up in Supabase with the following key tables:

1. **Jobs Table**: Tracks email processing jobs with status, scrape results, and email drafts
   - Key fields: id, email, name, domain, status, scrape_result, email_draft, metadata

2. **Companies Table**: Multi-tenant support with API keys
   - Key fields: id, name, slug, api_key, active

3. **Prompt Templates**: Company-specific email templates and configurations
   - Key fields: id, company_id, name, template, tone, style, max_length

4. **API Keys**: Secure API key management 
   - Key fields: id, company_id, key_prefix, key_hash, key_salt, active

5. **Profiles**: Extends Supabase Auth for user management
   - Already created via migration

6. **Trials**: For tracking potential clients
   - Key fields: id, first_name, last_name, email, has_registered, job_id

The database already has demo companies and corresponding prompt templates set up. These existing records will be used for testing the demo flow. No additional setup is required for the database tables.

Instead of creating new demo records, we'll utilize the existing demo companies and their associated prompt templates for the initial implementation and testing.
