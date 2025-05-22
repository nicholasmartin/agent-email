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

const EmailIcon = () => (
  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.8 0H2.2C0.99 0 0 0.99 0 2.2V17.6C0 18.81 0.99 19.8 2.2 19.8H19.8C21.01 19.8 22 18.81 22 17.6V2.2C22 0.99 21.01 0 19.8 0ZM19.8 2.2V2.42C18.855 3.255 17.446 4.462 13.662 7.524C12.804 8.206 11.044 9.878 11 9.878C10.956 9.878 9.196 8.206 8.338 7.524C4.554 4.462 3.145 3.255 2.2 2.42V2.2H19.8ZM2.2 17.6V5.06C3.167 5.874 4.422 6.894 6.776 8.778C7.876 9.656 9.892 11.55 11 11.528C12.097 11.55 14.08 9.69 15.224 8.778C17.578 6.894 18.833 5.874 19.8 5.06V17.6H2.2Z" fill="#3C50E0" />
  </svg>
);

interface StatisticsCardProps {
  title: string;
  value: string;
  description: string;
  icon: 'chart' | 'success' | 'email';
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
