import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

interface ScrapeResult {
  companyName?: string;
  description?: string;
  products?: string[];
  values?: string[];
  industry?: string;
  error?: string;
}

/**
 * Format domain as company name when scraping fails
 */
function formatDomainAsCompanyName(domain: string): string {
  // Remove TLD and convert to title case
  const name = domain.split('.')[0]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  return name;
}

export async function scrapeDomain(domain: string, jobId: string): Promise<boolean> {
  try {
    console.log(`Scraping domain: ${domain} for job: ${jobId}`);
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Update job status to scraping
    await supabase
      .from('jobs')
      .update({
        status: 'scraping',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    // Define schema for extraction using Zod
    const schema = z.object({
      overview: z.string(),
      summary: z.string(),
      company_name: z.string().optional(),
      services: z.array(z.string()).optional(),
      products: z.array(z.string()).optional(),
      industry: z.string().optional(),
      values: z.array(z.string()).optional()
    });
    
    // Call Firecrawl Extract API
    const response = await fetch('https://api.firecrawl.dev/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        urls: [`https://${domain}/`],
        prompt: "Draft a 200-word max overview of the website. Provide a short paragraph that summarizes the homepage. Extract the company name, industry, list of services, list of products, and company values if available.",
        schema: schema.shape
      })
    });
    
    // Handle non-JSON responses safely
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage;
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || response.statusText;
        } else {
          // If response is not JSON, get text content instead
          const errorText = await response.text();
          errorMessage = `Non-JSON response: ${errorText.substring(0, 100)}...`;
        }
      } catch (e: any) {
        errorMessage = `Failed to parse error response: ${response.statusText}`;
      }
      throw new Error(`Firecrawl API error: ${errorMessage}`);
    }
    
    // Safely parse JSON response
    try {
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const textResponse = await response.text();
        throw new Error(`Unexpected content type: ${contentType}, response: ${textResponse.substring(0, 100)}...`);
      }
    } catch (e: any) {
      throw new Error(`Failed to parse JSON response: ${e.message || 'Unknown error'}`);
    }
    
    // Extract the data from the response
    const data = responseData.data || responseData;
    
    // Process and structure the scraped data
    const scrapeResult: ScrapeResult = {
      companyName: data.company_name || formatDomainAsCompanyName(domain),
      description: data.overview || data.summary || '',
      products: data.products || [],
      values: data.values || [],
      industry: data.industry || ''
    };
    
    // Add services to products if available
    if (data.services && Array.isArray(data.services)) {
      scrapeResult.products = [...(scrapeResult.products || []), ...data.services];
    }
    
    // Update job with scrape result
    await supabase
      .from('jobs')
      .update({
        status: 'scraped',
        scrape_result: scrapeResult,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    console.log(`Successfully scraped domain: ${domain} for job: ${jobId}`);
    return true;
  } catch (error: any) {
    console.error(`Error scraping domain ${domain}:`, error);
    
    // Update job with error
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    await supabase
      .from('jobs')
      .update({
        scrape_result: { error: error.message },
        status: 'failed',
        error_message: `Scraping failed: ${error.message}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    return false;
  }
}
