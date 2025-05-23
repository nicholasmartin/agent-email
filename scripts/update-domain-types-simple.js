#!/usr/bin/env node

// Simple script to update domain types in existing jobs
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// List of free email domains
const freeDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com'
];

// Function to determine domain type
function getDomainType(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return 'other';
  return freeDomains.includes(domain) ? 'free' : 'business';
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateDomainTypes() {
  console.log('Starting domain type update process...');
  
  try {
    // Fetch only jobs that have an email but no domain_type in metadata
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, email, metadata')
      .not('email', 'is', null);
    
    if (error) {
      throw error;
    }
    
    // Filter jobs that don't have domain_type in metadata
    const jobsToUpdate = jobs.filter(job => {
      return !job.metadata || !job.metadata.domain_type;
    });
    
    console.log(`Found ${jobs.length} total jobs with emails`);
    console.log(`Found ${jobsToUpdate.length} jobs that need domain_type updates`);
    
    if (jobsToUpdate.length === 0) {
      console.log('No jobs need updating. Exiting.');
      return;
    }
    
    // Process jobs in batches to avoid rate limits
    const batchSize = 50;
    const batches = Math.ceil(jobsToUpdate.length / batchSize);
    
    let updatedCount = 0;
    
    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, jobsToUpdate.length);
      const batchJobs = jobsToUpdate.slice(start, end);
      
      console.log(`Processing batch ${i + 1}/${batches} (${batchJobs.length} jobs)`);
      
      // Process each job one by one to avoid batch errors
      for (const job of batchJobs) {
        // Calculate domain type
        const domainType = getDomainType(job.email);
        
        // Create updated metadata
        const updatedMetadata = {
          ...(job.metadata || {}),
          domain_type: domainType
        };
        
        // Update just this job's metadata
        const { error: updateError } = await supabase
          .from('jobs')
          .update({ metadata: updatedMetadata })
          .eq('id', job.id);
        
        if (updateError) {
          console.error(`Error updating job ${job.id}:`, updateError);
          continue; // Skip this job but continue with others
        }
        
        updatedCount++;
        
        // Log progress every 10 jobs
        if (updatedCount % 10 === 0) {
          console.log(`Progress: ${updatedCount}/${jobsToUpdate.length} jobs updated`);
        }
      }
      
      console.log(`Completed batch ${i + 1}/${batches}`);
    }
    
    console.log('Domain type update completed successfully');
    console.log(`Updated: ${updatedCount}/${jobsToUpdate.length} jobs`);
    
  } catch (error) {
    console.error('Error updating domain types:', error);
    process.exit(1);
  }
}

// Run the update function
updateDomainTypes();
