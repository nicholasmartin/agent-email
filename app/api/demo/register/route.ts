import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getDomainType, extractDomainFromEmail, DomainType } from '@/utils/domainChecker';

export async function POST(req: NextRequest) {
  try {
    // Verify form secret for security
    const formSecret = req.headers.get('x-form-secret');
    if (formSecret !== process.env.NEXT_PUBLIC_WEBSITE_FORM_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate input
    const body = await req.json();
    const { firstName, lastName, email } = body;
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Supabase client ONCE
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get agent-email company ONCE
    const { data: agentEmailCompany } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', 'agent-email')
      .single();

    if (!agentEmailCompany) {
      return NextResponse.json(
        { error: 'Agent Email company not found' },
        { status: 500 }
      );
    }

    // Extract domain and determine type
    const domain = extractDomainFromEmail(email);
    const domainType = getDomainType(email);
    
    // Create job metadata
    const jobMetadata = {
      source: 'demo',
      domain_type: domainType
    };

    // Create job with appropriate status
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        domain: domain,
        company_id: agentEmailCompany.id,
        status: domainType === 'business' ? 'pending' : 'skipped',
        error_message: domainType !== 'business' ? `${domainType} email domain` : undefined,
        metadata: jobMetadata,
        from_website: true
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      return NextResponse.json(
        { error: 'Failed to create job record' },
        { status: 500 }
      );
    }

    // Create trial record for ALL webform submissions
    const { error: trialError } = await supabase
      .from('trials')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        job_id: job.id
      });

    if (trialError) {
      console.error('Error creating trial record:', trialError);
      // Note: We don't return here as the job was created successfully
    }

    // Return appropriate response based on domain type
    if (domainType !== 'business') {
      return NextResponse.json(
        { error: 'Please use a business email address' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Demo registration successful',
      jobId: job.id
    });

  } catch (error: any) {
    console.error('Error in demo registration:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
