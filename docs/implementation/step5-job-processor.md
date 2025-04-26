# Step 5: Job Processor Service

Create a unified service to process jobs:

```typescript
// services/jobProcessor.ts
import { isBusinessDomain, extractDomainFromEmail } from '@/utils/domainChecker';
import { scrapeDomain } from '@/services/webScraper';
import { generateEmail } from '@/services/emailGenerator';
import { sendEmail } from '@/services/emailSender';
import { createClient } from '@supabase/supabase-js';

export async function processJob(jobId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get job details with related company info
  const { data: job } = await supabase
    .from('jobs')
    .select('*, companies:company_id(*)')
    .eq('id', jobId)
    .single();
  
  if (!job) return { status: 'error', message: 'Job not found' };
  
  try {
    // 1. Verify business domain
    if (!isBusinessDomain(job.email)) {
      await updateJobStatus(supabase, jobId, 'rejected', 'Not a business email domain');
      return { status: 'rejected', message: 'Not a business email domain' };
    }
    
    // 2. Scrape domain
    await updateJobStatus(supabase, jobId, 'scraping');
    const scrapeResult = await scrapeDomain(job.domain, jobId);
    if (!scrapeResult) {
      await updateJobStatus(supabase, jobId, 'failed', 'Failed to scrape domain');
      return { status: 'error', message: 'Failed to scrape domain' };
    }
    
    // 3. Generate email
    await updateJobStatus(supabase, jobId, 'generating');
    const emailDraft = await generateEmail(jobId);
    if (!emailDraft) {
      await updateJobStatus(supabase, jobId, 'failed', 'Failed to generate email');
      return { status: 'error', message: 'Failed to generate email' };
    }
    
    // 4. Determine if we need to send the email or just return it
    if (job.metadata?.source === 'demo') {
      // For demo flow, send email via Resend
      await updateJobStatus(supabase, jobId, 'sending');
      const sendResult = await sendEmail(jobId);
      
      if (!sendResult) {
        await updateJobStatus(supabase, jobId, 'failed', 'Failed to send email');
        return { status: 'error', message: 'Failed to send email' };
      }
    }
    
    // 5. Mark job as completed
    await updateJobStatus(supabase, jobId, 'completed');
    
    return { 
      status: 'success', 
      message: 'Job processed successfully',
      jobId,
      emailDraft: job.metadata?.source !== 'demo' ? emailDraft : undefined 
    };
  } catch (error: any) {
    // Handle errors
    console.error(`Error processing job ${jobId}:`, error);
    await updateJobStatus(supabase, jobId, 'failed', error.message);
    return { status: 'error', message: error.message };
  }
}

async function updateJobStatus(supabase: any, jobId: string, status: string, errorMessage?: string) {
  const updates: any = { 
    status,
    updated_at: new Date().toISOString()
  };
  
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }
  
  if (errorMessage) {
    updates.error_message = errorMessage;
  }
  
  await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId);
}
```

The Job Processor Service is the orchestration layer that coordinates the entire email processing workflow. It brings together all the individual components (domain checking, web scraping, email generation, and email sending) into a cohesive process.

Key features of this implementation:

1. **Unified Workflow**: Handles the complete job processing flow from start to finish
2. **Status Tracking**: Updates job status at each stage of processing
3. **Error Handling**: Provides comprehensive error handling and reporting
4. **Flow Differentiation**: Distinguishes between demo flow (send email) and client API flow (return email content)
5. **Clean Architecture**: Delegates specific tasks to specialized services

The service follows these steps:
1. Verify that the email is from a business domain
2. Scrape the company's website for information
3. Generate a personalized email based on the scraped information
4. For demo jobs, send the email via Resend
5. Update the job status to completed

The `updateJobStatus` helper function centralizes status updates and ensures consistent handling of timestamps and error messages.

This implementation maintains a clean separation of concerns while providing a unified entry point for job processing. The service is designed to be used by both the cron job that processes pending jobs and any API endpoints that need to trigger immediate job processing.
