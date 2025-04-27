"use client";

import React, { useState } from 'react';
import { CompanyData } from '@/app/actions/company';
import { SubmitButton } from '@/components/submit-button';

interface CompanyFormProps {
  company: CompanyData | null;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: string }>;
}

export default function CompanyForm({ company, onSubmit }: CompanyFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    const result = await onSubmit(formData);
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success });
    }
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      {message && (
        <div className={`p-4 mb-5 rounded-sm ${
          message.type === 'success' 
            ? 'bg-success/10 text-success' 
            : 'bg-danger/10 text-danger'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Company Name */}
      <div>
        <label htmlFor="name" className="mb-3 block text-sm font-medium text-black dark:text-white">
          Company Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={company?.name || ''}
          placeholder="Your Company Name"
          className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
          required
        />
      </div>
      
      {/* Slug */}
      <div>
        <label htmlFor="slug" className="mb-3 block text-sm font-medium text-black dark:text-white">
          Slug <span className="text-danger">*</span>
        </label>
        <div className="flex items-center">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-sm dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            agent-email.com/
          </span>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={company?.slug || ''}
            placeholder="your-company"
            className="w-full rounded-r-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
            required
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Used in URLs and API references. Lowercase letters, numbers, and hyphens only.
        </p>
      </div>
      
      {/* Website */}
      <div>
        <label htmlFor="website" className="mb-3 block text-sm font-medium text-black dark:text-white">
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          defaultValue={company?.website || ''}
          placeholder="https://yourcompany.com"
          className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
        />
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-3 block text-sm font-medium text-black dark:text-white">
          Company Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={company?.description || ''}
          rows={4}
          placeholder="Brief description of your company"
          className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
        ></textarea>
      </div>

      {/* Testing Fields Notice */}
      <div className="mb-2 p-3 bg-gray-100 border border-gray-200 rounded-sm dark:bg-gray-800 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Note:</span> The following fields are for UI testing only and will not be saved to the database at this time.
        </p>
      </div>
      
      {/* Logo URL */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="logoUrl" className="mb-3 block text-sm font-medium text-black dark:text-white">
            Logo URL
          </label>
          <span className="mb-3 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-300">
            Testing only - not saved
          </span>
        </div>
        <input
          type="url"
          id="logoUrl"
          name="logoUrl"
          defaultValue={company?.logo_url || ''}
          placeholder="https://yourcompany.com/logo.png"
          className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
        />
      </div>
      
      
      
      {/* Two column layout for smaller fields */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Industry */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="industry" className="mb-3 block text-sm font-medium text-black dark:text-white">
              Industry
            </label>
            <span className="mb-3 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-300">
              Testing only
            </span>
          </div>
          <input
            type="text"
            id="industry"
            name="industry"
            defaultValue={company?.industry || ''}
            placeholder="e.g. Technology, Healthcare, etc."
            className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
          />
        </div>
        
        {/* Company Size */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="size" className="mb-3 block text-sm font-medium text-black dark:text-white">
              Company Size
            </label>
            <span className="mb-3 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-300">
              Testing only
            </span>
          </div>
          <select
            id="size"
            name="size"
            defaultValue={company?.size || ''}
            className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1001+">1001+ employees</option>
          </select>
        </div>
      </div>
      
      {/* Location */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="location" className="mb-3 block text-sm font-medium text-black dark:text-white">
            Location
          </label>
          <span className="mb-3 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-300">
            Testing only - not saved
          </span>
        </div>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={company?.location || ''}
          placeholder="City, Country"
          className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
        />
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <SubmitButton 
          pendingText="Saving..." 
          className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition rounded-lg bg-primary shadow-sm hover:bg-opacity-90"
        >
          Save Changes
        </SubmitButton>
      </div>
    </form>
  );
}
