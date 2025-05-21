'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import SMTPConfigForm from '@/components/protected/dashboard/settings/SMTPConfigForm';
import TestEmailForm from '@/components/protected/dashboard/settings/TestEmailForm';

export default function SMTPSettingsPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [smtpConfig, setSmtpConfig] = useState<{
    smtp_enabled: boolean;
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_password: string;
    smtp_from_email: string;
    smtp_from_name: string;
    smtp_reply_to_email: string;
    smtp_secure: boolean;
  } | null>(null);

  // Fetch company data on component mount
  useEffect(() => {
    fetchCompanyData();
  }, []);

  // Fetch the current user's company data
  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      // Get user information
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to view SMTP settings');
        return;
      }
      
      // Get the user's company
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching company:', error);
        setError('Failed to fetch company information');
        return;
      }
      
      if (!company) {
        setError('Company not found');
        return;
      }
      
      setCompanyId(company.id);
      setSmtpConfig({
        smtp_enabled: company.smtp_enabled || false,
        smtp_host: company.smtp_host || '',
        smtp_port: company.smtp_port || 587,
        smtp_user: company.smtp_user || '',
        smtp_password: company.smtp_password || '',
        smtp_from_email: company.smtp_from_email || '',
        smtp_from_name: company.smtp_from_name || '',
        smtp_reply_to_email: company.smtp_reply_to_email || '',
        smtp_secure: company.smtp_secure === undefined ? true : company.smtp_secure,
      });
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError('Failed to fetch company information');
    } finally {
      setIsLoading(false);
    }
  };

  // Update SMTP configuration
  const updateSMTPConfig = async (formData: any) => {
    if (!companyId) {
      setError('Company ID not found');
      return;
    }
    
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      // Update the company's SMTP configuration
      const { error } = await supabase
        .from('companies')
        .update({
          smtp_enabled: formData.smtp_enabled,
          smtp_host: formData.smtp_host,
          smtp_port: formData.smtp_port,
          smtp_user: formData.smtp_user,
          smtp_password: formData.smtp_password,
          smtp_from_email: formData.smtp_from_email,
          smtp_from_name: formData.smtp_from_name,
          smtp_reply_to_email: formData.smtp_reply_to_email,
          smtp_secure: formData.smtp_secure,
        })
        .eq('id', companyId);
        
      if (error) {
        console.error('Error updating SMTP configuration:', error);
        setError('Failed to update SMTP configuration');
        return;
      }
      
      setSuccessMessage('SMTP configuration updated successfully');
      setSmtpConfig(formData);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating SMTP configuration:', err);
      setError('Failed to update SMTP configuration');
    } finally {
      setIsLoading(false);
    }
  };

  // Send a test email
  const sendTestEmail = async (email: string) => {
    if (!companyId) {
      setError('Company ID not found');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call the API to send a test email
      const response = await fetch('/api/settings/test-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, companyId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }
      
      setSuccessMessage('Test email sent successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error sending test email:', err);
      setError(err.message || 'Failed to send test email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* SMTP Configuration Section */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            SMTP Configuration
          </h3>
        </div>
        <div className="p-7">
          {error && (
            <div className="mb-5 p-4 bg-danger bg-opacity-10 text-danger rounded-sm">
              {error}
              <button 
                className="ml-2 underline"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-5 p-4 bg-success bg-opacity-10 text-success rounded-sm">
              {successMessage}
            </div>
          )}
          
          <div className="mb-8">
            <p className="text-base text-body-color dark:text-bodydark mb-4">
              Configure your own SMTP server to send emails from your domain. When enabled, 
              Agent Email will use your SMTP server instead of our default email service.
            </p>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <SMTPConfigForm 
                initialData={smtpConfig} 
                onSubmit={updateSMTPConfig} 
                isLoading={isLoading} 
              />
            )}
          </div>
          
          {smtpConfig?.smtp_enabled && (
            <div>
              <h4 className="text-lg font-medium text-black dark:text-white mb-4">Test Your SMTP Configuration</h4>
              <TestEmailForm onSubmit={sendTestEmail} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
      
      {/* SMTP Usage Documentation Section */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            About Custom SMTP
          </h3>
        </div>
        <div className="p-7">
          <div className="mb-5">
            <h4 className="text-lg font-medium text-black dark:text-white mb-2">Benefits of Custom SMTP</h4>
            <ul className="list-disc pl-5 text-base text-body-color dark:text-bodydark space-y-1">
              <li>Emails are sent from your domain, improving deliverability and brand recognition</li>
              <li>Full control over email sending infrastructure</li>
              <li>Better tracking and analytics through your email provider</li>
              <li>Ability to use your existing email templates and signatures</li>
            </ul>
          </div>
          
          <div className="mb-5">
            <h4 className="text-lg font-medium text-black dark:text-white mb-2">Recommended SMTP Providers</h4>
            <ul className="list-disc pl-5 text-base text-body-color dark:text-bodydark space-y-1">
              <li>Google Workspace / Gmail SMTP</li>
              <li>Amazon SES</li>
              <li>SendGrid</li>
              <li>Mailgun</li>
              <li>Your own mail server</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-black dark:text-white mb-2">Security Note</h4>
            <p className="text-base text-body-color dark:text-bodydark">
              Your SMTP credentials are stored securely in our database. For maximum security, 
              we recommend creating a dedicated SMTP user with limited permissions specifically for Agent Email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
