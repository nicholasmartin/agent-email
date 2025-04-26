import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const jobId = id;
    
    // Verify form secret for security
    const formSecret = request.headers.get('x-form-secret');
    if (formSecret !== process.env.NEXT_PUBLIC_WEBSITE_FORM_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get job details
    const { data: job, error } = await supabase
      .from('jobs')
      .select('id, status, error_message, created_at, updated_at, completed_at')
      .eq('id', jobId)
      .single();
    
    if (error) {
      console.error('Error fetching job:', error);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Calculate progress percentage based on status
    let progress = 0;
    switch (job.status) {
      case 'pending':
        progress = 10;
        break;
      case 'scraping':
        progress = 30;
        break;
      case 'scraped':
        progress = 40;
        break;
      case 'generating':
        progress = 60;
        break;
      case 'generated':
        progress = 80;
        break;
      case 'sending':
        progress = 90;
        break;
      case 'completed':
      case 'sent':
        progress = 100;
        break;
      case 'failed':
      case 'rejected':
        progress = 0;
        break;
      default:
        progress = 10;
    }
    
    // Format status message
    let statusMessage = '';
    switch (job.status) {
      case 'pending':
        statusMessage = 'Your request is pending...';
        break;
      case 'scraping':
        statusMessage = 'Researching your company...';
        break;
      case 'scraped':
        statusMessage = 'Research complete, preparing email...';
        break;
      case 'generating':
        statusMessage = 'Crafting your personalized email...';
        break;
      case 'generated':
        statusMessage = 'Email created, preparing to send...';
        break;
      case 'sending':
        statusMessage = 'Sending your email...';
        break;
      case 'completed':
      case 'sent':
        statusMessage = 'Email sent successfully!';
        break;
      case 'failed':
        statusMessage = `Process failed: ${job.error_message || 'Unknown error'}`;
        break;
      case 'rejected':
        statusMessage = job.error_message || 'Your request was rejected';
        break;
      default:
        statusMessage = 'Processing your request...';
    }
    
    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      progress,
      statusMessage,
      error: job.error_message,
      timestamps: {
        created: job.created_at,
        updated: job.updated_at,
        completed: job.completed_at
      }
    });
  } catch (error: any) {
    console.error('Error in job status check:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
