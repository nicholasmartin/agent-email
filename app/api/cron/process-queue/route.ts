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
