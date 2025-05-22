import React from 'react';
import { format } from 'date-fns';
import type { Database } from "@/types/supabase";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

interface JobDetailsModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  // Function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

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

  // Function to parse and display JSON data
  const renderJsonData = (data: any) => {
    if (!data) return <p>No data available</p>;
    
    try {
      const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
      
      return (
        <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-md overflow-auto max-h-60">
          <pre className="text-sm">{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      );
    } catch (error) {
      return <p>Invalid JSON data</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-80">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white dark:bg-boxdark rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">
            Job Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 text-black dark:text-white">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                <p className="font-medium text-black dark:text-white">{job.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(job.status)}`}>
                  {job.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-black dark:text-white">{job.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Domain</p>
                <p className="font-medium text-black dark:text-white">{job.domain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-black dark:text-white">{job.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium text-black dark:text-white">{formatDate(job.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Updated</p>
                <p className="font-medium text-black dark:text-white">{formatDate(job.updated_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="font-medium text-black dark:text-white">{formatDate(job.completed_at)}</p>
              </div>
            </div>
          </div>

          {/* Email Content */}
          {(job.email_subject || job.email_body) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-black dark:text-white">Email Content</h4>
              
              {job.email_subject && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
                  <p className="font-medium text-black dark:text-white">{job.email_subject}</p>
                </div>
              )}
              
              {job.email_body && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Body</p>
                  <div 
                    className="border border-stroke p-4 rounded-md bg-white dark:bg-boxdark dark:border-strokedark"
                    dangerouslySetInnerHTML={{ __html: job.email_body }}
                  />
                </div>
              )}
              
              {!job.email_subject && !job.email_body && job.email_draft && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Draft</p>
                  <div 
                    className="border border-stroke p-4 rounded-md bg-white dark:bg-boxdark dark:border-strokedark"
                    dangerouslySetInnerHTML={{ 
                      __html: typeof job.email_draft === 'string' 
                        ? job.email_draft 
                        : typeof job.email_draft === 'object' && job.email_draft !== null
                          ? job.email_draft.toString()
                          : 'No content available'
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {job.error_message && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-black dark:text-white">Error Details</h4>
              <div className="bg-danger bg-opacity-10 p-4 rounded-md border border-danger">
                <p className="text-danger">{job.error_message}</p>
              </div>
            </div>
          )}

          {/* Scrape Results */}
          {job.scrape_result && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-black dark:text-white">Scrape Results</h4>
              {renderJsonData(job.scrape_result)}
            </div>
          )}

          {/* Metadata */}
          {job.metadata && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-black dark:text-white">Metadata</h4>
              {renderJsonData(job.metadata)}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-stroke px-6 py-4 dark:border-strokedark flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-primary py-2 px-6 text-center font-medium text-primary hover:bg-opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
