# Agent Email - AI-Powered Personalized Email System

## Project Overview
Agent Email is a Next.js API service that processes business signups, researches domains via web scraping, generates personalized email content using AI, and delivers these directly to users via email authentication flows. The system is designed to help SaaS businesses that typically use lead forms to collect trial users and leads by providing personalized, AI-generated emails based on the lead's business information.

## Target Users
- SaaS businesses that use lead forms to collect trial users and leads
- Businesses looking to enhance their lead nurturing with personalized communication

## Tech Stack
- **Frontend & Backend**: Next.js (App Router)
- **Deployment**: Vercel
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Web Scraping**: Firecrawl API
- **AI Generation**: OpenAI API (GPT-4o)
- **Email Delivery**: Resend API
- **Authentication**: Supabase SSR Auth
- **API Security**: API key validation for service integrations
- **Background Processing**: Vercel cron jobs

## Core Components

### 1. API Service
The primary service of Agent Email is an API endpoint allowing customers to generate personalized emails for their leads. This is complemented by a webform on the Agent Email website for potential clients to see how the system works.

### 2. Domain Checker
Validates if an email is from a business domain by filtering out free email providers (Gmail, Yahoo, etc.) to focus on business users.

### 3. Web Scraper
Uses Firecrawl API to extract company information from business websites, including company name, description, values, and product information.

### 4. Email Generator
Uses OpenAI to create personalized email content based on scraped business data and customizable prompt templates.

### 5. Job Processor
Orchestrates the entire workflow from lead registration to email delivery, with asynchronous processing via Vercel cron jobs.

### 6. Multi-tenant System
Supports multiple companies with custom email templates and prompts, with future plans to potentially allow companies to add their own SMTP information for branded email sending.

## Database Schema

The Supabase database includes the following key tables:

1. **Jobs**: Tracks email processing jobs with status, scrape results, and email drafts
2. **Companies**: Multi-tenant support with API keys
3. **Prompt Templates**: Company-specific email templates and configurations
4. **API Keys**: Secure API key management
5. **Profiles**: Extends Supabase Auth
6. **Trials**: For tracking potential clients

## API Structure

```
/app/api/
├── demo/
│   ├── register/        # Endpoint for website demo lead registrations
│   └── status/[id]/     # Check status of a specific demo lead
├── client/
│   ├── process-lead/     # Endpoint for clients to process their leads (authenticated via API key)
│   └── jobs/            # List all jobs for the authenticated client (via API key)
└── cron/
    └── process-queue/   # Cron job for processing the job queue
```

## Development Approach

- Rapid MVP and prototyping approach
- Starting with a clean database (no migration needed)
- Focus on simplicity to avoid flow complications from the previous version
- Authentication has already been implemented and is working well

## Application Flows

### Demo Flow (Website)

1. User submits webform with firstname, lastname, email to the demo/register endpoint
2. System checks if the email domain is a business domain (not a free provider)
3. If it's a business domain, system creates a new job in the database with 'pending' status
4. The cron job (process-queue) picks up the pending job and updates its status to 'processing'
5. System scrapes the domain from the email using Firecrawl API
6. Once scraping is complete, system generates an email draft using OpenAI with Agent Email's default prompt
7. System sends the personalized email via Resend API to the email address that submitted the form
8. Job status is updated to 'completed'

### Client API Flow

1. Client sends API request with firstname, lastname, email to the client/process-lead endpoint (with API key)
2. System checks if the email domain is a business domain (not a free provider)
3. If it's a business domain, system creates a new job in the database with 'pending' status
4. The cron job (process-queue) picks up the pending job and updates its status to 'processing'
5. System scrapes the domain from the email using Firecrawl API
6. Once scraping is complete, system generates an email draft using OpenAI with the client's custom prompt
7. System returns the personalized email content to the API caller
8. Job status is updated to 'completed'

### Optimal Implementation Approach

Since both flows are nearly identical with only two key differences (prompt source and delivery method), we can implement a shared core service with configuration options:

1. **Shared Job Processing Service**: Create a unified job processor that handles domain checking, web scraping, and email generation for both flows.

2. **Configuration-based Approach**: Use a configuration object that specifies:
   - Prompt source (default Agent Email prompt or client-specific prompt)
   - Delivery method (send via Resend or return to API caller)

3. **Single Cron Job**: Use one cron job implementation that processes all pending jobs regardless of source.

4. **Job Metadata**: Store the job source (demo or client API) and delivery preferences in the job metadata field.

5. **Modular Components**: Implement each step (domain checking, scraping, generation, delivery) as separate modules that can be composed together.

This approach maximizes code reuse while maintaining flexibility for the different requirements of each flow.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
FIRECRAWL_API_KEY=your-firecrawl-api-key
RESEND_API_KEY=your-resend-api-key
RESEND_SENDER_EMAIL=sender@yourdomain.com
CRON_SECRET=your-secret-for-cron-jobs
WEBSITE_FORM_SECRET=your-website-form-secret
```

## Key Features

1. **Business Domain Filtering**: Automatically filters out free email providers to focus on business users
2. **Web Scraping**: Extracts company information from business websites using Firecrawl API
3. **AI-Generated Content**: Creates personalized email content based on scraped business data
4. **Seamless Authentication**: Uses Supabase Auth with magic links
5. **Multi-tenant Support**: Supports multiple companies with custom email templates and prompts
6. **Background Processing**: Handles jobs asynchronously with Vercel cron jobs
7. **API-First Design**: Primary focus on API service with a demonstration webform
8. **Dashboard**: Customized dashboard showing businesses relevant information about API usage and email stats

## Implementation Priorities

1. Lead registration
2. Email domain validation (filtering free email providers)
3. Website scraping via Firecrawl API
4. OpenAI email template generation with custom prompts
5. Email sending via Resend API
