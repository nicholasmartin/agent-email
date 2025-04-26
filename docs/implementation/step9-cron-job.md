# Step 9: Cron Job to Process Queue

Create a cron job to process pending jobs:

```typescript
// app/api/cron/process-queue/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processJob } from '@/services/jobProcessor';

export const config = {
  runtime: 'edge',
};

export async function GET(req: NextRequest) {
  // Verify cron secret for security
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get jobs that need processing - use a broader set of statuses to catch jobs at different stages
  const { data: jobsToProcess, error } = await supabase
    .from('jobs')
    .select('id, status')
    .in('status', ['pending', 'scraped', 'generated', 'scraping', 'generating']) // Include all processing states
    .order('created_at', { ascending: true }) // Process oldest jobs first
    .limit(5); // Process in small batches to avoid timeout
  
  if (error) {
    console.error('Error fetching jobs to process:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs to process' },
      { status: 500 }
    );
  }
  
  if (!jobsToProcess || jobsToProcess.length === 0) {
    return NextResponse.json({
      message: 'No jobs to process at this time'
    });
  }
  
  // Log the jobs being processed
  console.log(`Processing ${jobsToProcess.length} jobs...`);
  
  // Process each job
  const results = [];
  for (const job of jobsToProcess) {
    try {
      console.log(`Processing job ${job.id} (status: ${job.status})`);
      const result = await processJob(job.id);
      results.push({
        jobId: job.id,
        status: result.status,
        message: result.message
      });
    } catch (error: any) {
      console.error(`Error processing job ${job.id}:`, error);
      results.push({
        jobId: job.id,
        status: 'error',
        message: error.message || 'Unknown error occurred'
      });
    }
  }
  
  return NextResponse.json({ 
    message: `Processed ${results.length} jobs`,
    results 
  });
}
```

This endpoint serves as a cron job handler for processing jobs asynchronously. It's triggered by Vercel's cron system at regular intervals to pick up and process pending jobs.

Key features of this implementation:

1. **Security Verification**: Ensures the request is coming from the authorized cron system
2. **Batch Processing**: Processes jobs in small batches to avoid timeouts
3. **Job Prioritization**: Processes the oldest jobs first
4. **Comprehensive Status Handling**: Handles jobs in various processing states
5. **Detailed Logging**: Logs processing details for troubleshooting
6. **Error Isolation**: Errors in one job don't affect the processing of other jobs

The endpoint follows these steps:
1. Verify that the request is authorized using the cron secret
2. Query the database for jobs that need processing
3. Process each job using the Job Processor service
4. Track and return the results of each job processing attempt

To set up the cron job in Vercel, you'll need to add a `vercel.json` file to the project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-queue",
      "schedule": "* * * * *"
    }
  ]
}
```

This configuration will tell Vercel to call the process-queue endpoint every minute.

This implementation provides a robust solution for asynchronous job processing, which is essential for handling tasks that may take time to complete, such as web scraping and AI-powered email generation.
