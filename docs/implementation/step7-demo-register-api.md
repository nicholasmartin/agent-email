# Step 7: Demo Registration API Endpoint

Create an API endpoint for the demo lead registration form:

```typescript
// app/api/demo/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractDomainFromEmail } from '@/utils/domainChecker';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body;
    
    // Validate input
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Extract domain from email
    const domain = extractDomainFromEmail(email);
    
    // Get the demo company ID to associate with this job
    const { data: demoCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', 'agent-email-demo')
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
        name: `${firstName} ${lastName}`,
        email,
        domain,
        status: 'pending',
        company_id: demoCompany.id,
        metadata: { 
          source: 'demo',
          firstName,
          lastName
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
    
    // Also create a trial record (optional)
    await supabase
      .from('trials')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        job_id: job.id
      })
      .select();
    
    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Demo registration successful'
    });
  } catch (error) {
    console.error('Error in demo registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

This API endpoint handles registration requests from the demo form on the website. It creates a new job record in the database and optionally a trial record to track potential clients who are trying the service.

Key features of this implementation:

1. **Input Validation**: Ensures all required fields are provided
2. **Demo Company Association**: Associates the job with the demo company
3. **Metadata Storage**: Stores relevant metadata for processing
4. **Trial Tracking**: Creates a trial record for potential client tracking
5. **Error Handling**: Provides comprehensive error handling and response formatting

The endpoint follows these steps:
1. Validate the incoming request data
2. Extract the domain from the email address
3. Get the demo company ID from the database
4. Create a new job record with the appropriate metadata
5. Optionally create a trial record for tracking
6. Return the job ID and success message

This implementation provides a clean, reliable API endpoint for handling demo registrations. The use of appropriate HTTP status codes and error messages ensures clear communication with the frontend.
