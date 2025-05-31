import { isBusinessDomain, getDomainType, extractDomainFromEmail, DomainType } from '@/utils/domainChecker';
import { scrapeDomain } from '@/services/webScraper';
import { generateEmail, EmailResult } from '@/services/emailGenerator';
import { sendEmail } from '@/services/emailSender';
import { createClient } from '@supabase/supabase-js';

export async function processJob(jobId: string) {
  console.log(`Starting job processing for job: ${jobId}`);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    // First, check the current job status
    const { data: existingJob, error: jobError } = await supabase
      .from('jobs')
      .select('id, status, email_draft, email_subject, email_body, email_sent, processing_lock')
      .eq('id', jobId)
      .single();
    
    // If job doesn't exist, return error
    if (jobError || !existingJob) {
      console.log(`Job ${jobId} not found`);
      return { status: 'error', message: 'Job not found' };
    }
    
    // If job is already in a terminal state, return early with existing data
    if (['sent', 'generated', 'completed'].includes(existingJob.status)) {
      console.log(`Job ${jobId} is already in terminal state: ${existingJob.status}`);
      return {
        status: 'success',
        message: `Job already processed (${existingJob.status})`,
        jobId,
        emailSent: existingJob.email_sent || false,
        emailDraft: existingJob.email_draft,
        emailSubject: existingJob.email_subject,
        emailBody: existingJob.email_body
      };
    }
    
    // If job is already being processed (has a lock), return locked status
    if (existingJob.processing_lock) {
      console.log(`Job ${jobId} is already being processed (has lock)`);
      return { status: 'locked', message: 'Job is currently being processed by another process' };
    }
    
    // Try to acquire a lock on the job
    const now = new Date().toISOString();
    const { data: lockResult, error: lockError } = await supabase
      .from('jobs')
      .update({
        processing_lock: now,
        updated_at: now
      })
      .eq('id', jobId)
      .is('processing_lock', null)
      .select()
      .single();
    
    // If we couldn't acquire the lock, another process got it first
    if (lockError || !lockResult) {
      console.log(`Job ${jobId} lock acquisition failed`);
      return { status: 'locked', message: 'Failed to acquire processing lock' };
    }
    
    console.log(`Successfully acquired lock for job ${jobId}`);
    
    // We've acquired the lock, now get full job details
    const { data: job, error: fullJobError } = await supabase
      .from('jobs')
      .select('*, companies:company_id(*)')
      .eq('id', jobId)
      .single();
    
    if (fullJobError || !job) {
      // Release lock if job not found
      await supabase
        .from('jobs')
        .update({ processing_lock: null })
        .eq('id', jobId);
      
      console.log(`Failed to get full job details for ${jobId}`);
      return { status: 'error', message: 'Failed to get full job details' };
    }
    // 1. Check domain type from metadata or determine it if not present
    let domainType: DomainType;
    
    // Use existing domain type from metadata if available
    if (job.metadata?.domain_type) {
      domainType = job.metadata.domain_type as DomainType;
      console.log(`Using existing domain type from metadata: ${domainType}`);
    } else {
      // Determine domain type if not already in metadata
      domainType = getDomainType(job.email);
      console.log(`Determined domain type: ${domainType}`);
      
      // Only update metadata if domain_type is missing
      await supabase
        .from('jobs')
        .update({
          metadata: {
            ...job.metadata,
            domain_type: domainType
          }
        })
        .eq('id', jobId);
    }
    
    // If not a business domain, skip further processing
    if (domainType !== 'business') {
      await updateJobStatus(supabase, jobId, 'skipped', `${domainType} email domain`);
      return { status: 'skipped', message: `${domainType} email domain` };
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
    const emailResult = await generateEmail(jobId);
    if (!emailResult) {
      await updateJobStatus(supabase, jobId, 'failed', 'Failed to generate email');
      return { status: 'error', message: 'Failed to generate email' };
    }
    
    // 4. Determine if we need to send the email or just return it
    let emailSent = false;
    
    // For demo flow or client API with SMTP enabled, send email
    if (job.metadata?.source === 'demo' || (job.metadata?.source === 'client_api' && job.companies?.smtp_enabled)) {
      const source = job.metadata?.source === 'demo' ? 'demo' : 'client API with SMTP';
      console.log(`Sending email for ${source} flow for company: ${job.companies.name}`);
      
      await updateJobStatus(supabase, jobId, 'sending');
      const sendResult = await sendEmail(jobId);
      
      if (!sendResult) {
        await updateJobStatus(supabase, jobId, 'failed', `Failed to send email for ${source}`);
        return { status: 'error', message: `Failed to send email for ${source}` };
      }
      
      emailSent = true;
    }
    
    // For client API with SMTP where email was sent, return early with success
    if (job.metadata?.source === 'client_api' && job.companies?.smtp_enabled && emailSent) {
      await updateJobStatus(supabase, jobId, 'sent');
      
      return { 
        status: 'success', 
        message: 'Email sent successfully via SMTP',
        jobId,
        emailSent: true,
        emailDraft: emailResult.body, // Keep for backward compatibility
        emailSubject: emailResult.subject,
        emailBody: emailResult.body
      };
    }
    
    // 5. Mark job as completed
    await updateJobStatus(supabase, jobId, 'completed');
    
    // Release the lock before returning with retry mechanism
    await releaseJobLock(supabase, jobId, 'successful processing');
    
    return { 
      status: 'success', 
      message: 'Job processed successfully',
      jobId,
      // For client API requests, return complete email data
      emailDraft: job.metadata?.source !== 'demo' ? emailResult.body : undefined, // Keep for backward compatibility
      emailSubject: job.metadata?.source !== 'demo' ? emailResult.subject : undefined,
      emailBody: job.metadata?.source !== 'demo' ? emailResult.body : undefined
    };
  } catch (error: any) {
    // Handle errors
    console.error(`Error processing job ${jobId}:`, error);
    await updateJobStatus(supabase, jobId, 'failed', error.message);
    
    // Release the lock even if there's an error with retry mechanism
    await releaseJobLock(supabase, jobId, 'error');
    
    return { status: 'error', message: error.message };
  }
}

/**
 * Helper function to release a job lock with retry mechanism
 * Will attempt to release the lock up to 3 times with increasing delays
 */
async function releaseJobLock(supabase: any, jobId: string, context: string) {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ processing_lock: null })
        .eq('id', jobId);
      
      if (!error) {
        console.log(`Released lock for job ${jobId} after ${context}`);
        return true;
      }
      
      console.warn(`Attempt ${retryCount + 1} failed to release lock for job ${jobId}: ${error.message}`);
    } catch (lockError: any) {
      console.error(`Attempt ${retryCount + 1} failed to release lock for job ${jobId}:`, lockError);
    }
    
    // Exponential backoff: 200ms, 400ms, 800ms
    const delay = 200 * Math.pow(2, retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));
    retryCount++;
  }
  
  console.error(`Failed to release lock for job ${jobId} after ${maxRetries} attempts`);
  return false;
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
