# Step 10: Demo Registration Form Component

Create a simple form component for the website using React Hook Form for better validation and error handling:

```typescript
// components/DemoForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function DemoForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError('');
    
    try {
      const response = await fetch('/api/demo/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process your request');
      }
      
      // Redirect to status page
      router.push(`/demo/status/${result.jobId}`);
    } catch (err: any) {
      setApiError(err.message);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Try Agent Email</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            {...register('firstName', { required: 'First name is required' })}
            type="text"
            id="firstName"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register('lastName', { required: 'Last name is required' })}
            type="text"
            id="lastName"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Business Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {apiError && (
          <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
            {apiError}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition duration-200 flex items-center justify-center disabled:bg-blue-400"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Get Personalized Email'
          )}
        </button>
      </form>
    </div>
  );
}
```

## Implementation Details

This Demo Registration Form component provides a user-friendly interface for collecting user information and initiating the demo flow. Key features include:

1. **Form Validation**: Uses React Hook Form for efficient form validation
2. **Real-time Error Feedback**: Shows validation errors as users type
3. **Loading State Management**: Disables the form and shows a spinner during submission
4. **API Error Handling**: Displays server-side errors in a user-friendly format
5. **Responsive Design**: Works well on both desktop and mobile devices

The component follows these steps:
1. Collects the user's first name, last name, and business email
2. Validates the input both client-side and during submission
3. Submits the form data to the demo registration API endpoint
4. Shows appropriate loading and error states
5. Redirects to the status page upon successful submission

This implementation provides a clean, user-friendly interface for the demo registration process, with proper form validation and error handling.

## Implementation in Next.js

To implement this component in a Next.js application, you would create a page that uses this form:

```typescript
// app/page.tsx
import DemoForm from '@/components/DemoForm';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Agent Email - AI-Powered Personalized Email System
      </h1>
      <p className="text-center text-lg mb-12 max-w-2xl mx-auto">
        Try our demo to see how Agent Email can analyze your business and generate 
        personalized emails tailored to your company's unique characteristics.
      </p>
      
      <DemoForm />
    </div>
  );
}
```

This provides a simple, focused page that highlights the demo functionality without unnecessary complexity.
