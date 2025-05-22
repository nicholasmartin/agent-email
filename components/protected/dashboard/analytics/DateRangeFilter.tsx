import React, { useState } from 'react';
import { format } from 'date-fns';

interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (start: Date, end: Date) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onDateRangeChange
}) => {
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(format(startDate, 'yyyy-MM-dd'));
  const [customEndDate, setCustomEndDate] = useState(format(endDate, 'yyyy-MM-dd'));

  // Preset date ranges
  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This year', days: 365 },
    { label: 'Custom', custom: true }
  ];

  // Handle preset selection
  const handlePresetChange = (preset: { label: string; days?: number; custom?: boolean }) => {
    if (preset.custom) {
      setIsCustomRange(true);
      return;
    }

    setIsCustomRange(false);
    
    if (preset.days) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - preset.days);
      
      onDateRangeChange(start, end);
    }
  };

  // Handle custom date range submission
  const handleCustomRangeSubmit = () => {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    
    // Ensure end date is not before start date
    if (end < start) {
      alert('End date cannot be before start date');
      return;
    }
    
    onDateRangeChange(start, end);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Date Range
      </h3>
      
      <div className="flex flex-wrap gap-3 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetChange(preset)}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              (preset.custom && isCustomRange) || 
              (!preset.custom && !isCustomRange && preset.days === 
                Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
                ? 'bg-primary text-white'
                : 'bg-gray-2 text-black dark:bg-meta-4 dark:text-white'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      {isCustomRange && (
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Start Date
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                End Date
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCustomRangeSubmit}
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
            >
              Apply
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Currently viewing: <span className="font-medium">{format(startDate, 'MMM dd, yyyy')}</span> to <span className="font-medium">{format(endDate, 'MMM dd, yyyy')}</span>
        </p>
      </div>
    </div>
  );
};

export default DateRangeFilter;
