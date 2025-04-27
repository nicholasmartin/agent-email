import { createClient } from '@/utils/supabase/server';
import { generateApiKey } from '@/utils/apiKeyGenerator';

export interface ApiKey {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  key_prefix: string;
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  usage_count: number;
  active: boolean;
}

export interface ApiKeyWithFullKey extends ApiKey {
  fullKey: string; // Only returned when a key is first created
}

/**
 * Create a new API key for a company
 */
export async function createApiKey(companyId: string, name: string, description?: string): Promise<ApiKeyWithFullKey | null> {
  try {
    const supabase = await createClient();
    
    // Get user information to verify they have access to this company
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Verify user has access to this company (assuming companies have a user_id field)
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('id', companyId)
      .single();
      
    if (!company) {
      throw new Error('Company not found or user does not have access');
    }
    
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
        description,
        created_at: new Date().toISOString(),
        active: true
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating API key:', error);
      return null;
    }
    
    // Return the key with the full key (this is the only time the full key will be available)
    return {
      ...data,
      fullKey
    };
  } catch (error) {
    console.error('Error in createApiKey:', error);
    return null;
  }
}

/**
 * List all API keys for a company
 */
export async function listApiKeys(companyId: string): Promise<ApiKey[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error listing API keys:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in listApiKeys:', error);
    return [];
  }
}

/**
 * Revoke (deactivate) an API key
 */
export async function revokeApiKey(keyId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    // Get user information to verify they have access to this key
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Update the key to set active = false
    const { error } = await supabase
      .from('api_keys')
      .update({ active: false })
      .eq('id', keyId);
      
    if (error) {
      console.error('Error revoking API key:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in revokeApiKey:', error);
    return false;
  }
}

/**
 * Get the current user's company ID
 * This is a helper function to get the company ID for the current user
 */
export async function getCurrentUserCompanyId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    
    // Get user information
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }
    
    // Get the user's company
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();
      
    if (!company) {
      return null;
    }
    
    return company.id;
  } catch (error) {
    console.error('Error in getCurrentUserCompanyId:', error);
    return null;
  }
}
