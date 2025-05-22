import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

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
    
    // Prepare email content
    const subject = job.email_subject || `${job.companies.name}: Personalized Follow-up`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${job.first_name},</p>
        <div>${job.email_body || job.email_draft.replace(/\n/g, '<br>')}</div>
        <p style="margin-top: 20px;">Best regards,<br>The ${job.companies.name} Team</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an AI-generated email based on publicly available information about your company.
          If you have any questions, please reply to this email.
        </p>
      </div>
    `;
    
    let success = false;
    
    // Check if company has SMTP configured and enabled
    if (job.companies.smtp_enabled && 
        job.companies.smtp_host && 
        job.companies.smtp_port && 
        job.companies.smtp_user && 
        job.companies.smtp_password) {
      
      // Use company's SMTP configuration
      console.log(`Using custom SMTP for company: ${job.companies.name}`);
      
      // Create transporter with SMTP configuration
      const transporter = nodemailer.createTransport({
        host: job.companies.smtp_host,
        port: job.companies.smtp_port,
        secure: job.companies.smtp_secure ?? true,
        auth: {
          user: job.companies.smtp_user,
          pass: job.companies.smtp_password,
        },
        // Add TLS options to handle negotiation issues
        tls: {
          // Do not fail on invalid certs
          rejectUnauthorized: false,
          // Force specific TLS version if needed
          minVersion: 'TLSv1.2'
        }
      });
      
      // Send email using Nodemailer
      const info = await transporter.sendMail({
        from: `"${job.companies.smtp_from_name || job.companies.name}" <${job.companies.smtp_from_email || job.companies.smtp_user}>`,
        to: job.email,
        ...(job.companies.smtp_reply_to_email && { replyTo: job.companies.smtp_reply_to_email }),
        subject: subject,
        html: htmlContent
      });
      
      success = !!info.messageId;
      
      if (!success) {
        throw new Error('Failed to send email via SMTP');
      }
      
    } else {
      // Fallback to Resend API
      console.log(`Using Resend API for company: ${job.companies.name}`);
      
      // Initialize Resend client
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: `"${process.env.RESEND_SENDER_NAME || job.companies.name}" <${process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev'}>`,
        to: job.email,
        ...(job.companies.smtp_reply_to_email && { replyTo: job.companies.smtp_reply_to_email }),
        subject: subject,
        html: htmlContent
      });
      
      if (error) {
        throw new Error(`Resend API error: ${error.message}`);
      }
      
      success = true;
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
    
    return success;
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
