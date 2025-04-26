import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

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
    
    // Prepare the prompt with the scraped data
    const prompt = promptTemplate.template
      .replace('{{firstName}}', job.first_name)
      .replace('{{lastName}}', job.last_name)
      .replace('{{companyName}}', companyName || job.domain)
      .replace('{{companyDescription}}', description || '')
      .replace('{{companyProducts}}', Array.isArray(products) ? products.join(', ') : '')
      .replace('{{companyValues}}', Array.isArray(values) ? values.join(', ') : '')
      .replace('{{industry}}', industry || '');
    
    // Generate email using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert email copywriter. Your task is to write a personalized email based on the provided information. 
          Use a ${promptTemplate.tone || 'professional'} tone and keep the email ${promptTemplate.style || 'concise'}.
          Maximum length: ${promptTemplate.max_length || 400} characters.`
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });
    
    const emailDraft = completion.choices[0]?.message.content || '';
    
    // Update the job with the generated email
    const { error } = await supabase
      .from('jobs')
      .update({
        email_draft: emailDraft,
        status: 'generated',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    if (error) {
      console.error(`Error updating job ${jobId} with generated email:`, error);
      return null;
    }
    
    return emailDraft;
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
