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

    // Parse request body
    const body = await req.json();
    const { firstName, lastName, email } = body;

    // Validate input
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract domain from email
    const domain = extractDomainFromEmail(email);
    
    // Determine domain type
    const domainType = getDomainType(email);
    
    // Create a job record regardless of domain type
    const jobMetadata = {
      source: 'demo',
      domain_type: domainType
    };
    
    // If not a business domain, create a job with skipped status
    if (domainType !== 'business') {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      // Get or create demo company
      const { data: demoCompany } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', 'demo')
        .single();
      
      if (!demoCompany) {
        return NextResponse.json(
          { error: 'Demo company not found' },
          { status: 500 }
        );
      }
      
      const { data: skippedJob, error: skippedError } = await supabase
        .from('jobs')
        .insert({
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          email: email,
          domain: domain,
          company_id: demoCompany.id,
          status: 'skipped',
          error_message: `${domainType} email domain`,
          metadata: jobMetadata,
          from_website: true
        })
        .select()
        .single();
      
      if (skippedError) {
        console.error('Error creating skipped job:', skippedError);
        return NextResponse.json(
          { error: 'Failed to create job record' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Please use a business email address' },
        { status: 400 }
      );
    }

    // Domain already extracted above

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get demo company (first active company)
    const { data: demoCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (!demoCompany) {
      return NextResponse.json(
        { error: 'Demo company not found' },
        { status: 500 }
      );
    }

    // Create a new job
    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        domain: domain,
        company_id: demoCompany.id,
        status: 'pending',
        metadata: {
          ...jobMetadata
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

    // Create a trial record
    await supabase
      .from('trials')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        job_id: job.id
      });

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
