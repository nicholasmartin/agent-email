import { isBusinessDomain, extractDomainFromEmail } from '@/utils/domainChecker';
import { scrapeDomain } from '@/services/webScraper';
import { generateEmail, EmailResult } from '@/services/emailGenerator';
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
    const emailResult = await generateEmail(jobId);
    if (!emailResult) {
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
      // For client API requests, return complete email data
      emailDraft: job.metadata?.source !== 'demo' ? emailResult.body : undefined, // Keep for backward compatibility
      emailSubject: job.metadata?.source !== 'demo' ? emailResult.subject : undefined,
      emailBody: job.metadata?.source !== 'demo' ? emailResult.body : undefined
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
