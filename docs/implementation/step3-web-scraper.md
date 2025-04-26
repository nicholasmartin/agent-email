# Step 3: Web Scraper Service

Implement a service to scrape company information using Firecrawl:

```typescript
// services/webScraper.ts
import { FirecrawlClient } from '@mendable/firecrawl-js';
import { createClient } from '@supabase/supabase-js';

export async function scrapeDomain(domain: string, jobId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    // Log the start of scraping
    await supabase
      .from('jobs')
      .update({ 
        status: 'scraping',
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId);
    
    // Initialize Firecrawl client
    const firecrawl = new FirecrawlClient({
      apiKey: process.env.FIRECRAWL_API_KEY!,
    });
    
    // Start a new crawl job
    const job = await firecrawl.crawl({ 
      url: `https://${domain}`,
      crawlType: 'normal',
      maxPages: 10
    });
    
    // Wait for job completion
    let result = await job.getResult();
    
    // Process the results
    const pageData = result.pages.map(page => ({
      url: page.url,
      title: page.title,
      description: page.description,
      content: page.content
    }));
    
    // Extract company information
    const companyInfo = extractCompanyInfo(pageData);
    
    // Format final result
    const scrapeResult = {
      jobId: job.id,
      data: {
        domain,
        pages: pageData,
        companyInfo
      }
    };
    
    // Update job with scrape results
    await supabase
      .from('jobs')
      .update({ 
        scrape_result: scrapeResult,
        scrape_job_id: job.id,
        status: 'scraped',
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId);
      
    return scrapeResult;
  } catch (error) {
    console.error(`Error scraping domain ${domain} for job ${jobId}:`, error);
    
    // Update job with error
    await supabase
      .from('jobs')
      .update({ 
        status: 'failed',
        error_message: `Scraping failed: ${error.message || 'Unknown error'}`,
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId);
    
    return null;
  }
}

// Helper function to extract company information from scraped pages
function extractCompanyInfo(pages) {
  // Find key pages
  const homepage = pages.find(p => p.url.endsWith('/') || p.url.endsWith('.com'));
  const aboutPage = pages.find(p => 
    p.url.includes('/about') || 
    p.title?.toLowerCase().includes('about')
  );
  
  // Extract company name
  const companyName = extractCompanyName(homepage, aboutPage);
  
  // Extract description
  const description = extractDescription(homepage, aboutPage);
  
  // Extract values
  const values = extractValues(pages);
  
  // Extract product information
  const productInfo = extractProductInfo(pages);
  
  return {
    name: companyName,
    description,
    values,
    productInfo
  };
}

function extractCompanyName(homepage, aboutPage) {
  // Try to extract from about page first
  if (aboutPage?.title) {
    const titleParts = aboutPage.title.split('|');
    if (titleParts.length > 1) {
      return titleParts[titleParts.length - 1].trim();
    }
    
    // Try "About [Company]" pattern
    if (aboutPage.title.toLowerCase().startsWith('about ')) {
      return aboutPage.title.substring(6).trim();
    }
  }
  
  // Try homepage title
  if (homepage?.title) {
    const titleParts = homepage.title.split('|');
    if (titleParts.length > 0) {
      return titleParts[0].trim();
    }
  }
  
  // Default to domain if we can't extract a name
  return 'Company';
}

function extractDescription(homepage, aboutPage) {
  // Try about page description
  if (aboutPage?.description) {
    return aboutPage.description;
  }
  
  // Try homepage description
  if (homepage?.description) {
    return homepage.description;
  }
  
  // Try to extract from about page content
  if (aboutPage?.content) {
    // Get first paragraph that's longer than 100 characters
    const paragraphs = aboutPage.content.split('\n\n');
    const longParagraph = paragraphs.find(p => p.length > 100);
    if (longParagraph) {
      return longParagraph;
    }
  }
  
  return 'No company description available.';
}

function extractValues(pages) {
  // Look for values, mission, or culture sections
  const valueTerms = ['values', 'mission', 'culture', 'beliefs', 'principles'];
  const values = [];
  
  for (const page of pages) {
    if (!page.content) continue;
    
    // Look for headings containing value terms
    const content = page.content.toLowerCase();
    for (const term of valueTerms) {
      if (content.includes(term)) {
        // Extract relevant section or sentences containing the term
        const sentences = content.split('. ');
        const relevantSentences = sentences.filter(s => s.includes(term));
        if (relevantSentences.length > 0) {
          values.push(...relevantSentences.map(s => s.trim() + '.'));
        }
      }
    }
  }
  
  return values.length > 0 ? values : ['innovation', 'quality', 'customer satisfaction'];
}

function extractProductInfo(pages) {
  // Look for products or services pages
  const productPage = pages.find(p => 
    p.url.includes('/product') || 
    p.url.includes('/service') ||
    p.title?.toLowerCase().includes('product') ||
    p.title?.toLowerCase().includes('service')
  );
  
  if (productPage) {
    // Extract product names from headings
    const products = [];
    const content = productPage.content || '';
    
    // Split by headings and process
    const sections = content.split(/#{2,3} /);
    for (const section of sections) {
      const lines = section.split('\n');
      if (lines.length > 0 && lines[0].trim().length > 0) {
        products.push(lines[0].trim());
      }
    }
    
    if (products.length > 0) {
      return { products };
    }
  }
  
  // Default product info
  return { products: ['Main product/service'] };
}
```

This web scraper service leverages the Firecrawl API to extract valuable information from a company's website. The key features of this implementation include:

1. **Status Tracking**: Updates the job status throughout the scraping process
2. **Comprehensive Information Extraction**: Extracts company name, description, values, and product information
3. **Error Handling**: Gracefully handles errors and updates job status accordingly
4. **Smart Extraction Logic**: Uses multiple strategies to extract information from different pages

The service follows these steps:
1. Initialize the Firecrawl client
2. Start a new crawl job with the company domain
3. Wait for the crawl job to complete
4. Process the scraped pages to extract structured information
5. Update the job in the database with the scraped results

This implementation provides a good balance between thoroughness and efficiency for the MVP. In future iterations, we could enhance it with:
- More sophisticated text extraction algorithms
- Machine learning for entity recognition
- Additional data sources beyond the company website
