import React, { useState } from 'react';

interface SMTPConfigFormProps {
  initialData: {
    smtp_enabled: boolean;
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_password: string;
    smtp_from_email: string;
    smtp_from_name: string;
    smtp_reply_to_email: string;
    smtp_secure: boolean;
  } | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const SMTPConfigForm: React.FC<SMTPConfigFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    smtp_enabled: initialData?.smtp_enabled || false,
    smtp_host: initialData?.smtp_host || '',
    smtp_port: initialData?.smtp_port || 587,
    smtp_user: initialData?.smtp_user || '',
    smtp_password: initialData?.smtp_password || '',
    smtp_from_email: initialData?.smtp_from_email || '',
    smtp_from_name: initialData?.smtp_from_name || '',
    smtp_reply_to_email: initialData?.smtp_reply_to_email || '',
    smtp_secure: initialData?.smtp_secure === undefined ? true : initialData.smtp_secure,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="smtp_enabled"
            name="smtp_enabled"
            checked={formData.smtp_enabled}
            onChange={handleChange}
            className="mr-2 h-5 w-5 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <label
            htmlFor="smtp_enabled"
            className="cursor-pointer text-base font-medium text-black dark:text-white"
          >
            Enable Custom SMTP
          </label>
        </div>
      </div>

      {formData.smtp_enabled && (
        <>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="smtp_host"
                className="mb-2.5 block text-black dark:text-white"
              >
                SMTP Host <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                id="smtp_host"
                name="smtp_host"
                value={formData.smtp_host}
                onChange={handleChange}
                placeholder="smtp.example.com"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="smtp_port"
                className="mb-2.5 block text-black dark:text-white"
              >
                SMTP Port <span className="text-meta-1">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="smtp_port"
                  name="smtp_port"
                  value={formData.smtp_port}
                  onChange={handleChange}
                  placeholder="587"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <select
                  className="rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData({
                        ...formData,
                        smtp_port: parseInt(e.target.value),
                        smtp_secure: e.target.value === '465'
                      });
                    }
                  }}
                  value=""
                >
                  <option value="">Common ports</option>
                  <option value="25">25 (SMTP)</option>
                  <option value="465">465 (SMTPS / SSL)</option>
                  <option value="587">587 (SMTP with STARTTLS)</option>
                  <option value="2525">2525 (Alternative)</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-body-color dark:text-bodydark">
                Port 587 with STARTTLS is recommended for most providers. Use 465 for SSL/TLS.  
              </p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="smtp_user"
                className="mb-2.5 block text-black dark:text-white"
              >
                SMTP Username <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                id="smtp_user"
                name="smtp_user"
                value={formData.smtp_user}
                onChange={handleChange}
                placeholder="username@example.com"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="smtp_password"
                className="mb-2.5 block text-black dark:text-white"
              >
                SMTP Password <span className="text-meta-1">*</span>
              </label>
              <input
                type="password"
                id="smtp_password"
                name="smtp_password"
                value={formData.smtp_password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="smtp_from_email"
                className="mb-2.5 block text-black dark:text-white"
              >
                From Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                id="smtp_from_email"
                name="smtp_from_email"
                value={formData.smtp_from_email}
                onChange={handleChange}
                placeholder="noreply@yourdomain.com"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="smtp_from_name"
                className="mb-2.5 block text-black dark:text-white"
              >
                From Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                id="smtp_from_name"
                name="smtp_from_name"
                value={formData.smtp_from_name}
                onChange={handleChange}
                placeholder="Your Company Name"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="smtp_reply_to_email"
              className="mb-2.5 block text-black dark:text-white"
            >
              Reply-To Email
            </label>
            <input
              type="email"
              id="smtp_reply_to_email"
              name="smtp_reply_to_email"
              value={formData.smtp_reply_to_email}
              onChange={handleChange}
              placeholder="replies@yourdomain.com"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="mt-1 text-xs text-body-color dark:text-bodydark">
              Optional. If provided, replies to your emails will be sent to this address instead of the From Email.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smtp_secure"
                name="smtp_secure"
                checked={formData.smtp_secure}
                onChange={handleChange}
                className="mr-2 h-5 w-5 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <label
                htmlFor="smtp_secure"
                className="cursor-pointer text-base font-medium text-black dark:text-white"
              >
                Use Secure Connection (TLS/SSL)
              </label>
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-70"
      >
        {isLoading ? 'Saving...' : 'Save SMTP Configuration'}
      </button>
    </form>
  );
};

export default SMTPConfigForm;
