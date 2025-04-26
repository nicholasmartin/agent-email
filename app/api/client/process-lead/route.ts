import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isBusinessDomain, extractDomainFromEmail } from '@/utils/domainChecker';
import { processJob } from '@/services/jobProcessor';

// Helper function to validate API key
async function validateApiKey(apiKey: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get key prefix (first 8 characters)
  const keyPrefix = apiKey.substring(0, 8);
  
  // Find the API key in the database
  const { data: apiKeyData } = await supabase
    .from('api_keys')
    .select('*, companies:company_id(*)')
    .eq('key_prefix', keyPrefix)
    .eq('active', true)
    .single();
  
  if (!apiKeyData) {
    return { valid: false };
  }
  
  // TODO: In a production environment, we would hash the provided API key
  // and compare it with the stored hash for proper security
  
  return { 
    valid: true, 
    companyId: apiKeyData.company_id,
    company: apiKeyData.companies
  };
}

export async function POST(req: NextRequest) {
  try {
    // Get API key from header
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }
    
    // Validate API key
    const { valid, companyId, company } = await validateApiKey(apiKey);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { firstName, lastName, email, templateId } = body;
    
    // Validate input
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if email is from a business domain
    if (!isBusinessDomain(email)) {
      return NextResponse.json(
        { error: 'Not a business email domain', businessEmail: false },
        { status: 200 } // Return 200 but with businessEmail: false
      );
    }
    
    // Extract domain from email
    const domain = extractDomainFromEmail(email);
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Create a new job
    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        domain: domain,
        company_id: companyId,
        status: 'pending',
        metadata: {
          source: 'client_api',
          template_id: templateId
        }
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating job:', error);
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      );
    }
    
    // For client API, process the job immediately instead of waiting for cron
    const result = await processJob(job.id);
    
    if (result.status === 'success') {
      return NextResponse.json({
        success: true,
        jobId: job.id,
        emailDraft: result.emailDraft,
        message: 'Lead processed successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        jobId: job.id,
        status: result.status,
        message: result.message
      }, { status: result.status === 'rejected' ? 200 : 500 });
    }
  } catch (error: any) {
    console.error('Error in client lead processing:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
