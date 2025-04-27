import React from 'react';

export default function AccountSettingsPage() {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Account Settings
        </h3>
      </div>
      <div className="p-7">
        <div className="mb-8">
          <p className="text-base text-body-color dark:text-bodydark">
            This is a placeholder for the Account Settings page. Here you will be able to manage your account details, 
            profile information, and preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
