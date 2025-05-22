import React from 'react';
import { format } from 'date-fns';
import type { Database } from "@/types/supabase";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

interface JobsTableProps {
  jobs: Job[];
  onViewDetails: (job: Job) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  onViewDetails,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Function to get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'sent':
      case 'generated':
      case 'completed':
        return 'bg-success text-white';
      case 'pending':
      case 'scraping':
      case 'generating':
      case 'sending':
        return 'bg-primary text-white';
      case 'failed':
        return 'bg-danger text-white';
      case 'rejected':
      case 'rejected_free_email':
        return 'bg-warning text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Function to truncate job ID
  const truncateId = (id: string): string => {
    return id.substring(0, 5) + '...';
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                ID
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Domain
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Created
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{truncateId(job.id)}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{job.email}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{job.domain}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{formatDate(job.created_at)}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <button
                    onClick={() => onViewDetails(job)}
                    className="inline-flex items-center justify-center rounded-md border border-primary py-2 px-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-4 xl:px-6"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex h-9 w-9 items-center justify-center rounded-md border ${
                currentPage === 1
                  ? 'border-gray-300 text-gray-400'
                  : 'border-primary text-primary'
              }`}
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                  fill=""
                />
              </svg>
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border ${
                    currentPage === pageNum
                      ? 'border-primary bg-primary text-white'
                      : 'border-stroke text-black dark:border-strokedark dark:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex h-9 w-9 items-center justify-center rounded-md border ${
                currentPage === totalPages
                  ? 'border-gray-300 text-gray-400'
                  : 'border-primary text-primary'
              }`}
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsTable;
