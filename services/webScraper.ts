import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import FireCrawlApp from '@mendable/firecrawl-js';

// Define types for Firecrawl responses
interface FirecrawlExtractJob {
  id?: string;
  extractionId?: string;
  status?: string;
  [key: string]: any;
}

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

/**
 * Wait for FireCrawl extraction to complete
 * @param app - FireCrawl app instance
 * @param extractionId - ID of the extraction job
 * @param timeoutSeconds - Maximum time to wait in seconds
 * @returns - Extraction result or null if timed out
 */
async function waitForExtraction(app: FireCrawlApp, extractionId: string, timeoutSeconds = 120): Promise<any> {
  const startTime = Date.now();
  const timeoutMs = timeoutSeconds * 1000;
  
  // Check status every 5 seconds
  const checkInterval = 5000;
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      console.log(`Checking extraction status for ID: ${extractionId}`);
      
      const status = await app.getExtractStatus(extractionId);
      console.log('Status response:', status);
      
      // Handle different possible response formats
      if (status && status.status === 'completed') {
        console.log('Extraction completed successfully');
        
        // Check different result formats
        let result;
        if (status.result) {
          result = status.result;
        } else if (status.data) {
          result = status.data;
        } else if (status.results && status.results.length > 0) {
          result = status.results[0].data;
        }
        
        console.log('Extraction result:', result);
        return result;
      } else if (status && status.status === 'failed') {
        throw new Error(`Extraction failed: ${status.error || 'Unknown error'}`);
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    } catch (error: any) {
      console.error('Error checking extraction status:', error);
      throw error;
    }
  }
  
  throw new Error(`Extraction timed out after ${timeoutSeconds} seconds`);
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
    
    // Initialize FireCrawl SDK
    const app = new FireCrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY!
    });
    
    // Define schema for extraction using Zod - exactly matching the Node.js implementation
    const schema = z.object({
      overview: z.string(),
      summary: z.string(),
      company_name: z.string().optional(),
      services: z.array(z.string()).optional(),
      products: z.array(z.string()).optional(),
      contact_title: z.string().optional()
    });
    
    console.log(`Starting extraction for domain: ${domain}`);
    console.log('Calling asyncExtract...');
    
    // Start the asynchronous extraction process - exactly matching the Node.js implementation
    const extractJob = await app.asyncExtract(
      [`https://${domain}/`],
      {
        prompt: "Draft a 200-word max overview of the website. Provide a short paragraph that summarizes the homepage. Extract the company name, a list of services, and a list of products they provide.",
        schema // Pass the schema directly, not schema.shape
      }
    ) as FirecrawlExtractJob;
    
    console.log('asyncExtract call completed successfully');
    
    console.log('Extract job started:', extractJob);
    
    // Get the extraction ID from the response
    const extractionId = extractJob?.id || extractJob?.extractionId;
    if (!extractionId) {
      throw new Error('No extraction ID returned from Firecrawl');
    }
    
    console.log(`Waiting for extraction to complete for ID: ${extractionId}`);
    
    // Wait for the extraction to complete
    const extractionResult = await waitForExtraction(app, extractionId);
    
    // Process the extraction result
    const data = extractionResult?.data || extractionResult;
    
    if (!data) {
      throw new Error('No data returned from Firecrawl extraction');
    }
    
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
