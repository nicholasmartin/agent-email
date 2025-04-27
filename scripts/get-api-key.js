// Script to retrieve an API key from the database for testing
require('dotenv').config({ path: '.env.scripts' });
const { createClient } = require('@supabase/supabase-js');

async function getApiKey() {
  try {
    // Check if environment variables are loaded
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Error: Required environment variables are missing.');
      console.log('Make sure you have a .env file with the following variables:');
      console.log('- NEXT_PUBLIC_SUPABASE_URL');
      console.log('- SUPABASE_SERVICE_ROLE_KEY');
      return;
    }
    
    console.log('Connecting to Supabase at:', supabaseUrl);
    
    // Initialize Supabase client with service role key
    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );
    
    console.log('Fetching active API keys...');
    
    // Get the first active API key
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('active', true)
      .limit(1);
    
    if (error) {
      console.error('Error fetching API keys:', error);
      return;
    }
    
    if (!apiKeys || apiKeys.length === 0) {
      console.log('No active API keys found. Please create an API key first.');
      return;
    }
    
    const apiKey = apiKeys[0];
    console.log('Found API key:');
    console.log('- Key ID:', apiKey.id);
    console.log('- Key Prefix:', apiKey.key_prefix);
    console.log('- Company ID:', apiKey.company_id);
    console.log('- Created At:', apiKey.created_at);
    
    console.log('\nNote: You cannot retrieve the full API key from the database as only the hash is stored.');
    console.log('You need to use the API key that was displayed when it was first created.');
    console.log('If you don\'t have the full key, you\'ll need to create a new one.');
    
    // Get prompt templates for this company
    const { data: templates, error: templatesError } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('company_id', apiKey.company_id)
      .eq('active', true);
    
    if (templatesError) {
      console.error('Error fetching prompt templates:', templatesError);
    } else if (templates && templates.length > 0) {
      console.log('\nAvailable prompt templates for this company:');
      templates.forEach(template => {
        console.log(`- Template ID: ${template.id}`);
        console.log(`  Name: ${template.name}`);
        console.log(`  Is Default: ${template.is_default}`);
        console.log('  ---');
      });
    } else {
      console.log('\nNo prompt templates found for this company.');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

getApiKey();
