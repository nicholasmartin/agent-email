import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper function to validate API key
async function validateApiKey(apiKey: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get key prefix (first 8 characters)
  const keyPrefix = apiKey.substring(0, 8);
  
  // Find the API key in the database
  const { data: apiKeyData } = await supabase
    .from('api_keys')
    .select('*, companies:company_id(*)')
    .eq('key_prefix', keyPrefix)
    .eq('active', true)
    .single();
  
  if (!apiKeyData) {
    return { valid: false };
  }
  
  // TODO: In a production environment, we would hash the provided API key
  // and compare it with the stored hash for proper security
  
  return { 
    valid: true, 
    companyId: apiKeyData.company_id,
    company: apiKeyData.companies
  };
}

export async function GET(req: NextRequest) {
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
    const { valid, companyId } = await validateApiKey(apiKey);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Build query
    let query = supabase
      .from('jobs')
      .select('id, first_name, last_name, email, domain, status, created_at, updated_at, completed_at, error_message')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // Execute query
    const { data: jobs, error, count } = await query;
    
    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
    
    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId);
    
    return NextResponse.json({
      jobs,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount! / limit)
      }
    });
  } catch (error: any) {
    console.error('Error in jobs listing:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
