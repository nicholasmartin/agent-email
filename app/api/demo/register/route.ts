import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isBusinessDomain, extractDomainFromEmail } from '@/utils/domainChecker';

export async function POST(req: NextRequest) {
  try {
    // Verify form secret for security
    const formSecret = req.headers.get('x-form-secret');
    if (formSecret !== process.env.WEBSITE_FORM_SECRET) {
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

    // Check if email is from a business domain
    if (!isBusinessDomain(email)) {
      return NextResponse.json(
        { error: 'Please use a business email address' },
        { status: 400 }
      );
    }

    // Extract domain from email
    const domain = extractDomainFromEmail(email);

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
          source: 'demo'
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
