import React, { useState } from 'react';
import { ApiKeyWithFullKey } from '@/services/apiKeyService';

interface NewApiKeyDisplayProps {
  apiKey: ApiKeyWithFullKey;
  onClose: () => void;
}

export default function NewApiKeyDisplay({ apiKey, onClose }: NewApiKeyDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.fullKey);
      setCopied(true);
      
      // Reset copy status after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy API key:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark rounded-sm p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-black dark:text-white">Your New API Key</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-body-color dark:text-bodydark mb-2">
            <strong>Important:</strong> This API key will only be shown once. Please copy it now and store it securely.
          </p>
          
          <div className="flex items-center">
            <div className="flex-1 bg-gray-100 dark:bg-boxdark-2 p-3 rounded-l-sm font-mono text-sm overflow-x-auto whitespace-nowrap">
              {apiKey.fullKey}
            </div>
            <button
              onClick={copyToClipboard}
              className={`p-3 rounded-r-sm ${
                copied 
                  ? 'bg-success text-white' 
                  : 'bg-primary text-white hover:bg-opacity-90'
              }`}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-body-color dark:text-bodydark">
            <p><strong>Name:</strong> {apiKey.name}</p>
            {apiKey.description && <p><strong>Description:</strong> {apiKey.description}</p>}
            <p><strong>Created:</strong> {new Date(apiKey.created_at).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 dark:bg-boxdark-2 dark:text-white dark:hover:bg-opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
