import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isBusinessDomain, extractDomainFromEmail } from '@/utils/domainChecker';
import { processJob } from '@/services/jobProcessor';

import { verifyApiKey } from '@/utils/apiKeyGenerator';

// Helper function to validate API key
async function validateApiKey(apiKey: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Extract the key prefix from the API key
  // Format is expected to be: prefix_base64string
  console.log('Validating API key:', apiKey);
  
  const prefixParts = apiKey.split('_');
  console.log('Prefix parts:', prefixParts);
  
  if (prefixParts.length < 2) {
    console.log('Invalid key format: insufficient parts');
    return { valid: false };
  }
  
  const keyPrefix = prefixParts[0] + '_' + prefixParts[1];
  console.log('Extracted key prefix:', keyPrefix);
  
  // Find the API key in the database
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from('api_keys')
    .select('*, companies:company_id(*)')
    .eq('key_prefix', keyPrefix)
    .eq('active', true)
    .single();
  
  if (apiKeyError) {
    console.log('Database error when fetching API key:', apiKeyError);
    return { valid: false };
  }
  
  if (!apiKeyData) {
    console.log('No API key found with prefix:', keyPrefix);
    return { valid: false };
  }
  
  console.log('Found API key in database:', {
    id: apiKeyData.id,
    prefix: apiKeyData.key_prefix,
    companyId: apiKeyData.company_id
  });
  
  // Verify the API key by comparing the hash
  console.log('Verifying API key hash...');
  
  try {
    const isValid = verifyApiKey(apiKey, apiKeyData.key_hash, apiKeyData.key_salt);
    console.log('Hash verification result:', isValid);
    
    if (!isValid) {
      console.log('Hash verification failed');
      return { valid: false };
    }
  } catch (error) {
    console.error('Error during hash verification:', error);
    return { valid: false };
  }
  
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
        emailDraft: result.emailDraft, // Keep for backward compatibility
        emailSubject: result.emailSubject,
        emailBody: result.emailBody,
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
