# Step 6: Email Sender Service

Create a service to send emails using Resend:

```typescript
// services/emailSender.ts
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function sendEmail(jobId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get job details with associated company
  const { data: job } = await supabase
    .from('jobs')
    .select('*, companies:company_id(*)')
    .eq('id', jobId)
    .single();
  
  if (!job || !job.email_draft) {
    console.error(`Cannot send email for job ${jobId}: job not found or missing email draft`);
    return false;
  }
  
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Prepare a nice HTML email with styling
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${job.email_draft.subject}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div>
        ${job.email_draft.body.replace(/\n/g, '<br>')}
      </div>
      <div class="footer">
        <p>This email was sent using Agent Email - AI-powered personalized email system</p>
        <p>From: ${job.companies?.name || 'Agent Email'}</p>
      </div>
    </body>
    </html>
    `;
    
    // Send email using Resend
    const result = await resend.emails.send({
      from: process.env.RESEND_SENDER_EMAIL!,
      to: job.email,
      subject: job.email_draft.subject,
      html: htmlContent,
      text: job.email_draft.body, // Plain text fallback
      // You could add more advanced options like reply-to, attachments, etc.
    });
    
    // Update job status to sent
    await supabase
      .from('jobs')
      .update({ 
        status: 'sent',
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    console.log(`Email sent successfully for job ${jobId}`);
    return true;
  } catch (error) {
    console.error(`Error sending email for job ${jobId}:`, error);
    // Update job status to failed
    await supabase
      .from('jobs')
      .update({ 
        status: 'failed',
        error_message: `Failed to send email: ${error}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    return false;
  }
}
```

The Email Sender Service is responsible for delivering the generated emails to recipients using the Resend API. This service is primarily used for the demo flow, where we want to demonstrate the complete email generation and delivery process.

Key features of this implementation:

1. **Styled HTML Emails**: Creates professional-looking HTML emails with proper styling
2. **Plain Text Fallback**: Includes a plain text version for email clients that don't support HTML
3. **Company Branding**: Includes the company name in the email footer
4. **Status Tracking**: Updates job status to reflect email sending status
5. **Error Handling**: Provides comprehensive error handling and reporting

The service follows these steps:
1. Retrieve the job details and associated company information
2. Prepare the HTML email content with proper styling and formatting
3. Send the email using the Resend API
4. Update the job status to reflect the sending result

The implementation includes:
- HTML template with responsive design
- Error handling with detailed logging
- Status updates in the database

This service completes the demo flow by delivering the personalized email to the recipient's inbox. For the client API flow, this service is not used, as the email content is returned to the API caller instead of being sent directly.
