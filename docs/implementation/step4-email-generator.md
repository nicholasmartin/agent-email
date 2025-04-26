# Step 4: Email Generator Service

Create a service to generate personalized emails using OpenAI:

```typescript
// services/emailGenerator.ts
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export async function generateEmail(jobId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    // Get job details with company information
    const { data: job } = await supabase
      .from('jobs')
      .select('*, companies:company_id(*)')
      .eq('id', jobId)
      .single();
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Update job status
    await supabase
      .from('jobs')
      .update({ 
        status: 'generating',
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId);
    
    // Get appropriate prompt template for this company
    const { data: promptTemplate } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('company_id', job.company_id)
      .eq('active', true)
      .single();
    
    if (!promptTemplate) {
      throw new Error('No active prompt template found for this company');
    }
    
    if (!job.scrape_result) {
      throw new Error('No scrape results available');
    }
    
    // Prepare the prompt with company information
    const formattedPrompt = preparePrompt(promptTemplate.template, {
      recipientName: job.name,
      recipientEmail: job.email,
      companyDomain: job.domain,
      scrapedInfo: job.scrape_result
    });
    
    // Use OpenAI to generate email content
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that writes personalized email drafts based on company information." },
        { role: "user", content: formattedPrompt }
      ],
      model: "gpt-4o",
      max_tokens: promptTemplate.max_length || 500,
    });
    
    const generatedContent = completion.choices[0]?.message?.content || '';
    
    // Extract subject and body
    let subject = '';
    let body = generatedContent;
    
    if (generatedContent.includes('Subject:')) {
      const parts = generatedContent.split(/Subject:|Body:/i);
      subject = parts[1]?.trim() || '';
      body = parts[2]?.trim() || body;
    }
    
    const emailDraft = {
      subject,
      body,
      generated_at: new Date().toISOString(),
      model: "gpt-4o"
    };
    
    // Update job with email draft
    await supabase
      .from('jobs')
      .update({ 
        email_draft: emailDraft,
        status: 'generated',
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId);
      
    return emailDraft;
  } catch (error) {
    console.error('Error generating email:', error);
    return null;
  }
}

// Helper function to prepare the prompt with company information
function preparePrompt(template: string, data: any) {
  let processedTemplate = template;
  
  // Replace placeholder variables with actual data
  processedTemplate = processedTemplate
    .replace('{recipient_name}', data.recipientName)
    .replace('{recipient_email}', data.recipientEmail)
    .replace('{company_domain}', data.companyDomain);
  
  // Format company info from scraped data
  const companyInfo = formatCompanyInfo(data.scrapedInfo);
  processedTemplate = processedTemplate.replace('{company_info}', companyInfo);
  
  return processedTemplate;
}

// Helper function to format the company information
function formatCompanyInfo(scrapedInfo: any) {
  // Extract and format relevant company information from scrape results
  const companyName = scrapedInfo.companyInfo?.name || 'the company';
  const description = scrapedInfo.companyInfo?.description || 'The company provides various products and services.';
  const values = scrapedInfo.companyInfo?.values?.join(', ') || 'innovation, quality';
  const productInfo = JSON.stringify(scrapedInfo.companyInfo?.productInfo || {});
  
  return `
Company Name: ${companyName}
Description: ${description}
Values: ${values}
Products/Services: ${productInfo}
`.trim();
}
```

This Email Generator Service leverages OpenAI's GPT-4o model to create personalized email content based on:
1. Company-specific prompt templates stored in the database
2. Scraped information about the recipient's company
3. Recipient's name and email address

Key features of this implementation:

1. **Company-Specific Templates**: Uses the appropriate prompt template for the company associated with the job
2. **Dynamic Content Generation**: Incorporates scraped company information into the prompt
3. **Subject and Body Extraction**: Parses the generated content to extract the subject and body
4. **Status Tracking**: Updates the job status throughout the generation process
5. **Error Handling**: Gracefully handles errors and returns null in case of failure

The service follows these steps:
1. Retrieve the job details and related company information
2. Get the appropriate prompt template for the company
3. Prepare the prompt by replacing placeholder variables with actual data
4. Generate email content using OpenAI's API
5. Parse the generated content to extract subject and body
6. Update the job with the email draft

This implementation provides a robust solution for generating personalized emails based on scraped company information. The use of templates allows for customization while maintaining consistent branding and messaging.
