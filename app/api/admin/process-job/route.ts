import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processJob } from '@/services/jobProcessor';

export async function GET(req: NextRequest) {
  try {
    // Get job ID from URL
    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId parameter' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // First, check if job exists and get its current status
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, status, processing_lock, metadata, email_draft, email_subject, email_body, email_sent')
      .eq('id', jobId)
      .single();
    
    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Check if force parameter is provided
    const forceProcess = url.searchParams.get('force') === 'true';
    
    // If job is locked and force is true, release the lock
    if (job.processing_lock && forceProcess) {
      const { error: unlockError } = await supabase
        .from('jobs')
        .update({ processing_lock: null })
        .eq('id', jobId);
      
      if (unlockError) {
        return NextResponse.json(
          { error: 'Failed to release lock', details: unlockError.message },
          { status: 500 }
        );
      }
      
      // Process the job
      const result = await processJob(jobId);
      
      return NextResponse.json({
        message: 'Job lock released and processing triggered',
        jobId,
        originalStatus: job.status,
        processingResult: result
      });
    }
    
    // If job is not locked or force is false, just return the status
    return NextResponse.json({
      jobId,
      status: job.status,
      isLocked: !!job.processing_lock,
      lockedSince: job.processing_lock,
      source: job.metadata?.source || 'unknown',
      emailGenerated: !!(job.email_draft || job.email_body),
      emailSent: !!job.email_sent,
      message: job.processing_lock 
        ? 'Job is currently locked. Use ?force=true to release lock and process' 
        : 'Job is not locked'
    });
    
  } catch (error: any) {
    console.error('Error in admin process-job endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
