'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ApiKey, ApiKeyWithFullKey } from '@/services/apiKeyService';
import ApiKeyItem from '@/components/protected/dashboard/settings/ApiKeyItem';
import CreateApiKeyForm from '@/components/protected/dashboard/settings/CreateApiKeyForm';
import NewApiKeyDisplay from '@/components/protected/dashboard/settings/NewApiKeyDisplay';
import { generateApiKey } from '@/utils/apiKeyGenerator';

export default function ApiSettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newApiKey, setNewApiKey] = useState<ApiKeyWithFullKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
    fetchCompanyId();
  }, []);

  // Fetch the current user's company ID
  const fetchCompanyId = async () => {
    try {
      const supabase = createClient();
      
      // Get user information
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to view API keys');
        return;
      }
      
      // Get the user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (!profile) {
        setError('User profile not found');
        return;
      }
      
      // Get the user's company
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (!company) {
        // For demo purposes, create a company for the user if they don't have one
        const { data: newCompany, error } = await supabase
          .from('companies')
          .insert({
            user_id: user.id,
            name: `${profile.first_name}'s Company`,
            slug: `${profile.first_name.toLowerCase()}-company`,
            active: true
          })
          .select()
          .single();
          
        if (error) {
          setError('Failed to create company');
          return;
        }
        
        setCompanyId(newCompany.id);
      } else {
        setCompanyId(company.id);
      }
    } catch (err) {
      console.error('Error fetching company ID:', err);
      setError('Failed to fetch company information');
    }
  };

  // Fetch API keys from the database
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      // Get user information
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to view API keys');
        return;
      }
      
      // Get the user's company
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (!company) {
        // User doesn't have a company yet, so they don't have any API keys
        setApiKeys([]);
        return;
      }
      
      // Get the company's API keys
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching API keys:', error);
        setError('Failed to fetch API keys');
        return;
      }
      
      setApiKeys(data || []);
    } catch (err) {
      console.error('Error in fetchApiKeys:', err);
      setError('Failed to fetch API keys');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new API key
  const createApiKey = async (name: string, description: string) => {
    if (!companyId) {
      setError('Company ID not found');
      return;
    }
    
    try {
      setIsCreating(true);
      const supabase = createClient();
      
      // Generate a new API key
      const { fullKey, prefix, hash, salt } = generateApiKey();
      
      // Insert the key into the database
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          company_id: companyId,
          key_prefix: prefix,
          key_hash: hash,
          key_salt: salt,
          name,
          description: description || null,
          created_at: new Date().toISOString(),
          active: true,
          usage_count: 0
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating API key:', error);
        setError('Failed to create API key');
        return;
      }
      
      // Set the new API key with the full key (this is the only time the full key will be available)
      setNewApiKey({
        ...data,
        fullKey
      });
      
      // Refresh the API keys list
      fetchApiKeys();
    } catch (err) {
      console.error('Error in createApiKey:', err);
      setError('Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  // Revoke an API key
  const revokeApiKey = async (keyId: string) => {
    try {
      const supabase = createClient();
      
      // Update the key to set active = false
      const { error } = await supabase
        .from('api_keys')
        .update({ active: false })
        .eq('id', keyId);
        
      if (error) {
        console.error('Error revoking API key:', error);
        setError('Failed to revoke API key');
        return;
      }
      
      // Refresh the API keys list
      fetchApiKeys();
    } catch (err) {
      console.error('Error in revokeApiKey:', err);
      setError('Failed to revoke API key');
    }
  };

  return (
    <div className="space-y-5">
      {/* API Keys Management Section */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            API Keys
          </h3>
        </div>
        <div className="p-7">
          {error && (
            <div className="mb-5 p-4 bg-danger bg-opacity-10 text-danger rounded-sm">
              {error}
              <button 
                className="ml-2 underline"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}
          
          <div className="mb-8">
            <p className="text-base text-body-color dark:text-bodydark mb-4">
              API keys allow external applications to authenticate with the Agent Email API. 
              Keys are only shown once when created, so make sure to copy and store them securely.
            </p>
            
            <h4 className="text-lg font-medium text-black dark:text-white mb-4">Create New API Key</h4>
            <CreateApiKeyForm onSubmit={createApiKey} isLoading={isCreating} />
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-black dark:text-white mb-4">Your API Keys</h4>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : apiKeys.length > 0 ? (
              <div className="space-y-3">
                {apiKeys.map((apiKey) => (
                  <ApiKeyItem 
                    key={apiKey.id} 
                    apiKey={apiKey} 
                    onRevoke={revokeApiKey} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-body-color dark:text-bodydark">
                No API keys found. Create your first API key above.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* API Usage Documentation Section */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            API Usage
          </h3>
        </div>
        <div className="p-7">
          <div className="mb-5">
            <h4 className="text-lg font-medium text-black dark:text-white mb-2">Authentication</h4>
            <p className="text-base text-body-color dark:text-bodydark">
              Include your API key in the request headers:
            </p>
            <pre className="bg-gray-100 dark:bg-boxdark-2 p-3 rounded-sm mt-2 overflow-x-auto">
              <code>{
`Authorization: Bearer YOUR_API_KEY`}
              </code>
            </pre>
          </div>
          
          <div className="mb-5">
            <h4 className="text-lg font-medium text-black dark:text-white mb-2">Endpoints</h4>
            <p className="text-base text-body-color dark:text-bodydark mb-2">
              Process a new lead:
            </p>
            <pre className="bg-gray-100 dark:bg-boxdark-2 p-3 rounded-sm overflow-x-auto">
              <code>{
`POST /api/client/process-lead

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@company.com"
}`}
              </code>
            </pre>
            
            <p className="text-base text-body-color dark:text-bodydark mt-4 mb-2">
              Check job status:
            </p>
            <pre className="bg-gray-100 dark:bg-boxdark-2 p-3 rounded-sm overflow-x-auto">
              <code>{
`GET /api/client/jobs/:jobId`}
              </code>
            </pre>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-black dark:text-white mb-2">Rate Limits</h4>
            <p className="text-base text-body-color dark:text-bodydark">
              API requests are limited to 1000 requests per day per API key. 
              Contact support if you need higher limits.
            </p>
          </div>
        </div>
      </div>
      
      {/* New API Key Modal */}
      {newApiKey && (
        <NewApiKeyDisplay 
          apiKey={newApiKey} 
          onClose={() => setNewApiKey(null)} 
        />
      )}
    </div>
  );
}
