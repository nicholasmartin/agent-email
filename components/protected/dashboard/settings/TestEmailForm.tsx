import React, { useState } from 'react';

interface TestEmailFormProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

const TestEmailForm: React.FC<TestEmailFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <label
          htmlFor="test_email"
          className="mb-2.5 block text-black dark:text-white"
        >
          Send a test email to:
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            id="test_email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            required
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="flex-shrink-0 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-70"
          >
            {isLoading ? 'Sending...' : 'Send Test'}
          </button>
        </div>
        <p className="mt-2 text-sm text-body-color dark:text-bodydark">
          This will send a test email using your SMTP configuration to verify it works correctly.
        </p>
      </div>
    </form>
  );
};

export default TestEmailForm;
