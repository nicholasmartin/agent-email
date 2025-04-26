import { createClient } from '@supabase/supabase-js';

interface ScrapeResult {
  companyName?: string;
  description?: string;
  products?: string[];
  values?: string[];
  industry?: string;
  error?: string;
}

export async function scrapeDomain(domain: string, jobId: string): Promise<boolean> {
  try {
    console.log(`Scraping domain: ${domain} for job: ${jobId}`);
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Call Firecrawl API to scrape the domain
    const response = await fetch('https://api.firecrawl.dev/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        url: `https://${domain}`,
        scrapeType: 'company-info'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Firecrawl API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process and structure the scraped data
    const scrapeResult: ScrapeResult = {
      companyName: data.companyName || domain,
      description: data.description || '',
      products: data.products || [],
      values: data.values || [],
      industry: data.industry || ''
    };
    
    // Update the job with the scrape results
    const { error } = await supabase
      .from('jobs')
      .update({
        scrape_result: scrapeResult,
        status: 'scraped',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    if (error) {
      console.error(`Error updating job ${jobId} with scrape results:`, error);
      return false;
    }
    
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
