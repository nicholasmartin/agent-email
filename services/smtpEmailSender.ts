import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  fromName: string;
  replyTo?: string;
}

export async function sendEmailViaSMTP(jobId: string, smtpConfig: SMTPConfig): Promise<boolean> {
  try {
    console.log(`Sending email via SMTP for job: ${jobId}`);
    
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
    
    // Create transporter with SMTP configuration
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      }
    });
    
    // Send email using Nodemailer
    const info = await transporter.sendMail({
      from: `"${smtpConfig.fromName}" <${smtpConfig.from}>`,
      to: job.email,
      ...(smtpConfig.replyTo && { replyTo: smtpConfig.replyTo }),
      subject: job.email_subject || `${job.companies.name}: Personalized Follow-up`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hi ${job.first_name},</p>
          <div>${job.email_body || job.email_draft.replace(/\n/g, '<br>')}</div>
          ${job.companies.smtp_signature ? `<div style="margin-top: 20px;">${job.companies.smtp_signature}</div>` : ''}
        </div>
      `
    });
    
    if (!info.messageId) {
      throw new Error('Failed to send email via SMTP');
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
    console.error(`Error sending email via SMTP for job ${jobId}:`, error);
    
    // Update job with error
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error_message: `SMTP email sending failed: ${error.message}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    return false;
  }
}
