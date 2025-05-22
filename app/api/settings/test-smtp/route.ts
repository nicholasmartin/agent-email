import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { email, companyId } = body;
    
    // Validate required fields
    if (!email || !companyId) {
      return NextResponse.json(
        { error: 'Email and companyId are required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get the company's SMTP configuration
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
    
    if (companyError || !company) {
      console.error('Error fetching company:', companyError);
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Check if SMTP is configured and enabled
    if (!company.smtp_enabled || 
        !company.smtp_host || 
        !company.smtp_port || 
        !company.smtp_user || 
        !company.smtp_password) {
      return NextResponse.json(
        { error: 'SMTP is not properly configured for this company' },
        { status: 400 }
      );
    }
    
    // Create transporter with SMTP configuration
    const transporter = nodemailer.createTransport({
      host: company.smtp_host,
      port: company.smtp_port,
      secure: company.smtp_secure ?? true,
      auth: {
        user: company.smtp_user,
        pass: company.smtp_password,
      },
      // Add TLS options to handle negotiation issues
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
        // Force specific TLS version if needed
        minVersion: 'TLSv1.2'
      }
    });
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"${company.smtp_from_name || company.name}" <${company.smtp_from_email || company.smtp_user}>`,
      to: email,
      ...(company.smtp_reply_to_email && { replyTo: company.smtp_reply_to_email }),
      subject: 'Agent Email SMTP Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>SMTP Configuration Test</h2>
          <p>This is a test email from Agent Email to verify your SMTP configuration.</p>
          <p>If you're receiving this email, your SMTP configuration is working correctly!</p>
          ${company.smtp_signature ? `<div style="margin-top: 20px;">${company.smtp_signature}</div>` : ''}
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test email sent from Agent Email. 
            If you did not request this test, please ignore this email.
          </p>
        </div>
      `
    });
    
    if (!info.messageId) {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: `Failed to send test email: ${error.message}` },
      { status: 500 }
    );
  }
}
