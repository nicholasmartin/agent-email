# How the Agent Email Components Work Together

## 1. Core System Architecture

The Agent Email system follows a service-oriented architecture with the Job Processor at its center. Here's how all components interact:

```
Demo Form UI → API Endpoint → Job Database → Cron Job → Job Processor → Status Page
```

The Job Processor orchestrates multiple specialized services:
- Domain Checker
- Web Scraper
- Email Generator
- Email Sender

## 2. Service Dependencies and Data Flow

Here's how data flows through the system:

1. **Input Collection**: 
   - Demo Form collects: `firstName`, `lastName`, `email`
   - API endpoint validates input and creates a job record
   - Domain Checker validates if it's a business email

2. **Job Processing**:
   - Job Processor picks up `pending` jobs
   - Web Scraper processes domain → outputs `scrape_result`
   - Email Generator uses `scrape_result` → outputs `email_draft`
   - Email Sender uses `email_draft` → sends or returns email

3. **Status Tracking**:
   - Status API endpoint checks job status
   - Status Page displays progress to user

## 3. The Job Processor as Orchestrator

The Job Processor is the "brain" of the system:

```typescript
export async function processJob(jobId: string) {
  // [1] Load job details with company info
  // [2] Check if business domain
  // [3] Scrape website data
  // [4] Generate personalized email
  // [5] Send or return email
  // [6] Update job status
}
```

It manages the entire workflow by:
- Determining the job type (demo or client API)
- Coordinating service calls in the correct order
- Handling errors at each step
- Updating job status in the database
- Returning appropriate responses

## 4. State Management via Database

The database serves as the source of truth for job state:

1. Jobs start with `status: 'pending'`
2. Job Processor updates status to `'scraping'` → `'scraped'` → `'generating'` → `'generated'` → `'sending'` → `'sent'` → `'completed'`
3. At each state, key data is stored:
   - `scrape_result`: Web scraping output
   - `email_draft`: Generated email content
   - `error_message`: Any errors that occur
   - Various timestamps: `created_at`, `updated_at`, `completed_at`

## 5. Asynchronous Processing with Cron Jobs

The cron job is critical for handling long-running tasks:

```
┌─── Demo/Client API ───┐    ┌─── Cron Job System ───┐
│                       │    │                       │
│ 1. Create job record  │───▶│ 1. Query pending jobs │
│ 2. Return job ID      │    │ 2. Process each job   │
│                       │    │ 3. Update job status  │
└───────────────────────┘    └───────────────────────┘
```

The cron job:
- Runs every minute via Vercel's cron system
- Queries for jobs in specific states (`pending`, `scraping`, etc.)
- Processes jobs in batches (5 at a time)
- Respects job state to avoid processing the same job multiple times
- Handles errors gracefully without affecting other jobs

## 6. Processing Flow Example

Let's trace a complete demo flow:

1. **Form Submission**:
   - User submits form with name and email
   - `app/api/demo/register/route.ts` creates job with `status: 'pending'`
   - Returns job ID to frontend

2. **Background Processing**:
   - Cron job (`app/api/cron/process-queue/route.ts`) picks up pending job
   - Calls `processJob(jobId)` from Job Processor service
   - Job Processor calls Domain Checker to verify business email
   - If valid, updates status to `'scraping'` and calls Web Scraper
   - Web Scraper extracts company info and updates job with `scrape_result`
   - Job Processor updates status to `'generating'` and calls Email Generator
   - Email Generator creates personalized email and updates job with `email_draft`
   - For demo flow, Job Processor calls Email Sender
   - Email Sender delivers email and updates status to `'completed'`

3. **Status Monitoring**:
   - Frontend polls `app/api/demo/status/[id]/route.ts` every few seconds
   - Status page displays progress based on current job status
   - When status is `'completed'`, user sees success message

## 7. Error Handling and Recovery

The system handles errors at multiple levels:

1. **Service-level errors**: Each service has try/catch blocks
2. **Job Processor errors**: Centralizes error handling and updates job status
3. **Cron job errors**: Isolates errors to individual jobs
4. **Retry mechanism**: Jobs track `retry_count` for potential retries
5. **Error messaging**: Error details stored in database and displayed to users

## 8. Demo vs. Client API Differentiation

The Job Processor can determine the source of a job via `job.metadata?.source`:

```typescript
// For demo flow, send email via Resend
if (job.metadata?.source === 'demo') {
  await sendEmail(jobId);
} 
// For client API, return email content
else {
  return { 
    // Return email content to API
    emailDraft: job.email_draft 
  };
}
```

This allows the same core processing logic to handle both flows while accommodating their differences.
