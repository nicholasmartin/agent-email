# Step 11: Job Status Page

Create a page to display job status with improved UI and better polling mechanism:

```typescript
// app/demo/status/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type JobStatus = {
  status: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export default function StatusPage() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Define status mapping for user-friendly display
  const statusMessages: Record<string, string> = {
    pending: 'Preparing to process your request',
    scraping: 'Analyzing your company website',
    generating: 'Creating your personalized email',
    sending: 'Sending your personalized email',
    completed: 'Email sent successfully!',
    rejected: 'Email domain not eligible',
    failed: 'Process failed'
  };
  
  // Define status progress percentages
  const statusProgress: Record<string, number> = {
    pending: 10,
    scraping: 30,
    scraped: 40,
    generating: 60,
    generated: 80,
    sending: 90,
    completed: 100,
    rejected: 100,
    failed: 100
  };
  
  useEffect(() => {
    let pollTimer: NodeJS.Timeout;
    let isPolling = true;
    
    const checkStatus = async () => {
      if (!isPolling) return;
      
      try {
        const response = await fetch(`/api/demo/status/${jobId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch job status');
        }
        
        setJobStatus(data);
        setIsLoading(false);
        
        // Stop polling if job is in a final state
        if (['completed', 'rejected', 'failed'].includes(data.status)) {
          isPolling = false;
        } else {
          // Continue polling every 3 seconds
          pollTimer = setTimeout(checkStatus, 3000);
        }
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
        isPolling = false;
      }
    };
    
    // Start polling
    checkStatus();
    
    // Clean up on unmount
    return () => {
      isPolling = false;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [jobId]);
  
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading job status...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4 text-red-600">
          <ExclamationCircleIcon className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Error</h1>
        <p className="text-center text-red-600 mb-6">{error}</p>
        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to home page
          </Link>
        </div>
      </div>
    );
  }
  
  if (!jobStatus) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="mb-6">We couldn't find the requested job.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to home page
        </Link>
      </div>
    );
  }
  
  const { status } = jobStatus;
  const progress = statusProgress[status] || 0;
  const isFinalState = ['completed', 'rejected', 'failed'].includes(status);
  
  return (
    <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Email Status</h1>
      
      {/* Status symbol */}
      <div className="flex justify-center mb-6">
        {status === 'completed' ? (
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        ) : status === 'rejected' || status === 'failed' ? (
          <ExclamationCircleIcon className="h-16 w-16 text-yellow-500" />
        ) : (
          <ClockIcon className="h-16 w-16 text-blue-500" />
        )}
      </div>
      
      {/* Status message */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2 capitalize">{statusMessages[status] || status}</h2>
        {jobStatus.error && <p className="text-red-600 mt-2">{jobStatus.error}</p>}
      </div>
      
      {/* Progress bar for non-final states */}
      {!isFinalState && (
        <div className="mb-6">
          <div className="w-full h-3 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">{progress}% complete</p>
        </div>
      )}
      
      {/* Status specific messages */}
      {status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">
            Success! We've analyzed your business and sent a personalized email to your inbox.
            Please check your email (including spam folder).
          </p>
        </div>
      )}
      
      {status === 'rejected' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            Your email appears to be from a personal email provider (like Gmail or Yahoo).
            Agent Email works best with business email addresses.
          </p>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">
            We encountered an error while processing your request.
            {jobStatus.error ? ` Error: ${jobStatus.error}` : ''}
          </p>
        </div>
      )}
      
      {/* Action button */}
      <div className="text-center mt-8">
        <Link 
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
```

## Implementation Details

This Job Status Page provides users with real-time updates on the status of their email generation process. Key features include:

1. **Real-time Polling**: Automatically polls for status updates every 3 seconds
2. **Visual Status Indicators**: Uses icons and colors to indicate different statuses
3. **Progress Bar**: Shows approximate progress through the email generation process
4. **Status-specific Messages**: Provides contextual information based on the current status
5. **Clean Error Handling**: Shows user-friendly error messages
6. **Responsive Design**: Works well on both desktop and mobile devices

The component follows these steps:
1. Fetches the initial job status when the page loads
2. Sets up a polling mechanism to regularly check for updates
3. Displays appropriate loading and error states
4. Shows status-specific information and visuals based on the current job status
5. Provides a clear call-to-action once the process is complete

This implementation provides a polished, user-friendly way for users to track the progress of their email generation request. The use of visual indicators and progress bars creates a more engaging experience than simple text updates.

## Additional Features

The status page could be enhanced with additional features in future iterations:

1. **Email Preview**: Show a preview of the generated email once complete
2. **Retry Option**: Allow users to retry failed jobs
3. **Notification Settings**: Allow users to be notified when the process completes
4. **Share Option**: Make it easy to share successful results

For the MVP, however, this implementation provides all the essential functionality needed for a good user experience.
