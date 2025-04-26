import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function sendEmail(jobId: string): Promise<boolean> {
  try {
    console.log(`Sending email for job: ${jobId}`);
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get job details
    const { data: job } = await supabase
      .from('jobs')
      .select('*, companies:company_id(*)')
      .eq('id', jobId)
      .single();
    
    if (!job || !job.email_draft) {
      throw new Error('Job not found or missing email draft');
    }
    
    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev',
      to: job.email,
      subject: `${job.companies.name}: Personalized Follow-up`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hi ${job.first_name},</p>
          <div>${job.email_draft.replace(/\n/g, '<br>')}</div>
          <p style="margin-top: 20px;">Best regards,<br>The ${job.companies.name} Team</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an AI-generated email based on publicly available information about your company.
            If you have any questions, please reply to this email.
          </p>
        </div>
      `
    });
    
    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }
    
    // Update the job status
    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        status: 'sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    if (updateError) {
      console.error(`Error updating job ${jobId} after sending email:`, updateError);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error(`Error sending email for job ${jobId}:`, error);
    
    // Update job with error
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error_message: `Email sending failed: ${error.message}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    return false;
  }
}
