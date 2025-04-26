# Step 8: Job Status API Endpoint

Create an API endpoint to check the status of a job:

```typescript
// app/api/demo/status/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  if (!id) {
    return NextResponse.json(
      { error: 'Missing job ID' },
      { status: 400 }
    );
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get job status
  const { data: job, error } = await supabase
    .from('jobs')
    .select('status, error_message, created_at, updated_at, completed_at')
    .eq('id', id)
    .single();
  
  if (error || !job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    status: job.status,
    error: job.error_message,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
    completedAt: job.completed_at
  });
}
```

This API endpoint provides a way to check the status of a specific job by its ID. It's primarily used by the demo status page to show the current status of a job to the user.

Key features of this implementation:

1. **Parameter Validation**: Ensures the job ID is provided
2. **Minimal Response**: Returns only the necessary information about the job
3. **Appropriate Error Handling**: Returns 404 if the job is not found
4. **Secure Access**: Uses the Supabase service role key for database access

The endpoint follows these steps:
1. Extract the job ID from the URL parameters
2. Validate that the job ID is provided
3. Query the database for the job's status and timestamps
4. Return the job status information in a formatted response

This implementation provides a clean, reliable API endpoint for checking job status. It's designed to be used by the demo status page to poll for updates and show the current status to the user.
