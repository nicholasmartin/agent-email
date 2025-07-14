import React from 'react';
import CompanyForm from '@/components/protected/dashboard/settings/CompanyForm';
import { getCompanyData, updateCompanyAction } from '@/app/actions/company';

export const dynamic = 'force-dynamic';

export default async function AccountSettingsPage() {
  // Fetch the company data
  const { company, error } = await getCompanyData();
  
  return (
    <div className="space-y-8">
      {/* Company Information Section */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Company Information
          </h3>
        </div>
        <div className="p-7">
          {error ? (
            <div className="p-4 mb-5 bg-danger/10 text-danger rounded-sm">
              {error}
            </div>
          ) : (
            <div>
              <p className="mb-6 text-base text-body-color dark:text-bodydark">
                Update your company details below. This information will be used in emails and other communications.
              </p>
              <CompanyForm 
                company={company} 
                onSubmit={updateCompanyAction} 
              />
            </div>
          )}
        </div>
      </div>
      
      
    </div>
  );
}
