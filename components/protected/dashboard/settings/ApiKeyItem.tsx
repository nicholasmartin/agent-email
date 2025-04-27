import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ApiKey } from '@/services/apiKeyService';

interface ApiKeyItemProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
}

export default function ApiKeyItem({ apiKey, onRevoke }: ApiKeyItemProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-stroke rounded-sm mb-3 bg-gray-50 dark:bg-boxdark-2 dark:border-strokedark">
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className="text-black dark:text-white font-medium">{apiKey.name}</h4>
          {!apiKey.active && (
            <span className="ml-2 px-2 py-1 text-xs bg-danger text-white rounded-full">
              Revoked
            </span>
          )}
        </div>
        
        {apiKey.description && (
          <p className="text-sm text-body-color dark:text-bodydark mt-1">
            {apiKey.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-body-color dark:text-bodydark">
          <span>Prefix: <code className="bg-gray-100 dark:bg-boxdark px-1 py-0.5 rounded">{apiKey.key_prefix}</code></span>
          <span>Created: {formatDistanceToNow(new Date(apiKey.created_at))} ago</span>
          {apiKey.last_used_at && (
            <span>Last used: {formatDistanceToNow(new Date(apiKey.last_used_at))} ago</span>
          )}
          <span>Usage: {apiKey.usage_count} requests</span>
        </div>
      </div>
      
      {apiKey.active && (
        <button
          onClick={() => onRevoke(apiKey.id)}
          className="mt-3 md:mt-0 px-4 py-2 bg-danger text-white rounded-sm hover:bg-opacity-90 transition-all"
        >
          Revoke
        </button>
      )}
    </div>
  );
}
