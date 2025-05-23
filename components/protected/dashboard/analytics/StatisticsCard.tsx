import React from 'react';

// SVG icons for the cards
const ChartIcon = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.89376 0.687512 7.68751C0.825012 7.41251 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.41251 21.3125 7.68751C21.4156 7.89376 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27501 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27501 19.7313 8.00001C18.975 6.72501 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72501 2.26876 8.00001Z" fill="#3C50E0" />
    <path d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z" fill="#3C50E0" />
  </svg>
);

const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.3333 10C18.3333 14.6 14.6 18.3333 10 18.3333C5.4 18.3333 1.66667 14.6 1.66667 10C1.66667 5.4 5.4 1.66667 10 1.66667C14.6 1.66667 18.3333 5.4 18.3333 10Z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66667 10L8.91667 12.25L13.3333 7.75" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BusinessIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.6 2.2H4.4C3.08 2.2 2 3.28 2 4.6V17.6C2 18.92 3.08 20 4.4 20H17.6C18.92 20 20 18.92 20 17.6V4.6C20 3.28 18.92 2.2 17.6 2.2ZM4.4 4.6H9.9V11H4.4V4.6ZM4.4 13.2H9.9V17.6H4.4V13.2ZM17.6 17.6H12.1V11H17.6V17.6ZM17.6 8.8H12.1V4.6H17.6V8.8Z" fill="#3C50E0"/>
  </svg>
);

const FreeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.8 7.7L12.1 2.2C11.44 1.76 10.56 1.76 9.9 2.2L2.2 7.7C1.76 8.03 1.54 8.58 1.54 9.13V19.8C1.54 20.46 2.09 21 2.75 21H19.25C19.91 21 20.46 20.46 20.46 19.8V9.13C20.46 8.58 20.24 8.03 19.8 7.7ZM11 4.05L16.5 7.7L11 11.35L5.5 7.7L11 4.05ZM18.15 18.7H3.85V10.01L11 15.4L18.15 10.01V18.7Z" fill="#10B981"/>
  </svg>
);

const OtherIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 0C4.95 0 0 4.95 0 11C0 17.05 4.95 22 11 22C17.05 22 22 17.05 22 11C22 4.95 17.05 0 11 0ZM11 19.8C6.16 19.8 2.2 15.84 2.2 11C2.2 6.16 6.16 2.2 11 2.2C15.84 2.2 19.8 6.16 19.8 11C19.8 15.84 15.84 19.8 11 19.8ZM12.1 5.5H9.9V12.1H16.5V9.9H12.1V5.5Z" fill="#FFA500"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.8 0H2.2C0.99 0 0 0.99 0 2.2V17.6C0 18.81 0.99 19.8 2.2 19.8H19.8C21.01 19.8 22 18.81 22 17.6V2.2C22 0.99 21.01 0 19.8 0ZM19.8 2.2V2.42C18.855 3.255 17.446 4.462 13.662 7.524C12.804 8.206 11.044 9.878 11 9.878C10.956 9.878 9.196 8.206 8.338 7.524C4.554 4.462 3.145 3.255 2.2 2.42V2.2H19.8ZM2.2 17.6V5.06C3.167 5.874 4.422 6.894 6.776 8.778C7.876 9.656 9.892 11.55 11 11.528C12.097 11.55 14.08 9.69 15.224 8.778C17.578 6.894 18.833 5.874 19.8 5.06V17.6H2.2Z" fill="#3C50E0" />
  </svg>
);

interface StatisticsCardProps {
  title: string;
  value: string;
  description: string;
  icon: 'chart' | 'success' | 'email' | 'business' | 'free' | 'other';
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  description,
  icon
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'chart':
        return <ChartIcon />;
      case 'success':
        return <SuccessIcon />;
      case 'email':
        return <EmailIcon />;
      case 'business':
        return <BusinessIcon />;
      case 'free':
        return <FreeIcon />;
      case 'other':
        return <OtherIcon />;
      default:
        return <ChartIcon />;
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {renderIcon()}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {value}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center">
          <span className="text-sm font-medium">{description}</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
