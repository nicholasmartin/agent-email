import React, { useState } from 'react';

interface CreateApiKeyFormProps {
  onSubmit: (name: string, description: string) => Promise<void>;
  isLoading: boolean;
}

export default function CreateApiKeyForm({ onSubmit, isLoading }: CreateApiKeyFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    try {
      await onSubmit(name, description);
      // Reset form after successful submission
      setName('');
      setDescription('');
    } catch (err) {
      setError('Failed to create API key. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-5.5">
        <label
          htmlFor="keyName"
          className="mb-3 block text-sm font-medium text-black dark:text-white"
        >
          API Key Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="keyName"
          placeholder="My API Key"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
          disabled={isLoading}
        />
      </div>

      <div className="mb-5.5">
        <label
          htmlFor="keyDescription"
          className="mb-3 block text-sm font-medium text-black dark:text-white"
        >
          Description
        </label>
        <textarea
          id="keyDescription"
          rows={3}
          placeholder="What will this API key be used for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-sm border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
          disabled={isLoading}
        ></textarea>
      </div>

      {error && (
        <div className="mb-5 text-danger text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="flex justify-center items-center rounded-sm bg-primary py-2.5 px-4.5 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : (
          'Create API Key'
        )}
      </button>
    </form>
  );
}
