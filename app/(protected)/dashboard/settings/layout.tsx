import React from 'react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Settings</h2>
      </div>
      {children}
    </div>
  );
}
