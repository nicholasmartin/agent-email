import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

interface EmailResponse {
  subject: string;
  body: string;
}

export async function generateEmail(jobId: string): Promise<string | null> {
  try {
    console.log(`Generating email for job: ${jobId}`);
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get job details with related company info and prompt template
    const { data: job } = await supabase
      .from('jobs')
      .select(`
        *,
        companies:company_id(
          *,
          prompt_templates(*)
        )
      `)
      .eq('id', jobId)
      .single();
    
    if (!job || !job.scrape_result) {
      throw new Error('Job not found or missing scrape results');
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Get the appropriate prompt template
    let promptTemplate;
    if (job.metadata?.source === 'demo') {
      // For demo, use the default template from the demo company
      promptTemplate = job.companies.prompt_templates.find((template: any) => template.is_default);
    } else {
      // For client API, use the specified template or default
      const templateId = job.metadata?.template_id;
      promptTemplate = templateId 
        ? job.companies.prompt_templates.find((template: any) => template.id === templateId)
        : job.companies.prompt_templates.find((template: any) => template.is_default);
    }
    
    if (!promptTemplate) {
      throw new Error('No prompt template found');
    }
    
    // Extract company info from scrape results
    const { companyName, description, products, values, industry } = job.scrape_result;
    
    // Create variable mapping for template replacement
    const variableMap: Record<string, string> = {
      '{{firstName}}': job.first_name,
      '{{lastName}}': job.last_name,
      '{{email}}': job.email,
      '{{domain}}': job.domain,
      '{{companyName}}': companyName || job.domain,
      '{{companyDescription}}': description || '',
      '{{companyProducts}}': Array.isArray(products) ? products.join(', ') : '',
      '{{companyValues}}': Array.isArray(values) ? values.join(', ') : '',
      '{{companyIndustry}}': industry || '',
      '{{ourCompanyName}}': job.companies.name || 'Agent Email',
      '{{ourCompanyDescription}}': job.companies.description || 'helps businesses send personalized emails',
      '{{maxLength}}': (promptTemplate.max_length || 400).toString(),
      '{{tone}}': promptTemplate.tone || 'professional',
      '{{style}}': promptTemplate.style || 'concise'
    };
    
    // Replace all variables in the template
    let prompt = promptTemplate.template;
    for (const [variable, value] of Object.entries(variableMap)) {
      prompt = prompt.replace(new RegExp(variable, 'g'), value);
    }
    
    // Generate email using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert email copywriter. Your task is to write a personalized email based on the provided information. 
          Use a ${promptTemplate.tone || 'professional'} tone and keep the email ${promptTemplate.style || 'concise'}.
          Maximum length: ${promptTemplate.max_length || 400} characters.
          
          IMPORTANT FORMATTING INSTRUCTIONS:
          1. DO NOT include any greeting (like "Hi [Name]") at the beginning
          2. DO NOT include any signature or closing (like "Best regards" or "Sincerely")
          3. ONLY write the main body content of the email
          4. Format your response as a JSON object with 'subject' and 'body' fields
          
          The greeting and signature will be added separately.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const responseContent = completion.choices[0]?.message.content || '';
    
    // Parse JSON response with error handling
    let emailResponse: EmailResponse;
    try {
      emailResponse = JSON.parse(responseContent) as EmailResponse;
      
      // Validate that required fields exist
      if (!emailResponse.subject || !emailResponse.body) {
        throw new Error('Missing required fields in JSON response');
      }
    } catch (parseError) {
      console.error(`Error parsing JSON response for job ${jobId}:`, parseError);
      
      // Fallback: Use the raw response as the email body with a generic subject
      emailResponse = {
        subject: `${job.companies.name}: Personalized Follow-up`,
        body: responseContent
      };
    }
    
    // Convert email body to HTML if it's not already
    const emailBody = emailResponse.body.includes('<') && emailResponse.body.includes('>')
      ? emailResponse.body
      : emailResponse.body.replace(/\n/g, '<br>');
    
    // Update the job with the generated email
    const { error } = await supabase
      .from('jobs')
      .update({
        email_draft: emailResponse.body, // Keep for backward compatibility
        email_subject: emailResponse.subject,
        email_body: emailBody,
        status: 'generated',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    if (error) {
      console.error(`Error updating job ${jobId} with generated email:`, error);
      return null;
    }
    
    return emailResponse.body;
  } catch (error: any) {
    console.error(`Error generating email for job ${jobId}:`, error);
    
    // Update job with error
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error_message: `Email generation failed: ${error.message}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    return null;
  }
}
