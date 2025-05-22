"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import Breadcrumb from "@/components/common/Breadcrumb";
import StatisticsCard from "@/components/protected/dashboard/analytics/StatisticsCard";
import JobsTable from "@/components/protected/dashboard/analytics/JobsTable";
import JobDetailsModal from "@/components/protected/dashboard/analytics/JobDetailsModal";
import DateRangeFilter from "@/components/protected/dashboard/analytics/DateRangeFilter";

// Types
import type { Database } from "@/types/supabase";
type Job = Database["public"]["Tables"]["jobs"]["Row"];

const AnalyticsPage = () => {
  // State for date range filter
  const [startDate, setStartDate] = useState<Date>(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return thirtyDaysAgo;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  // State for jobs data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for statistics
  const [totalJobs, setTotalJobs] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [emailSentRate, setEmailSentRate] = useState(0);
  
  // State for job details modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [domainFilter, setDomainFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 50;

  // Initialize Supabase client
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Format dates for query
        const formattedStartDate = startDate.toISOString();
        const formattedEndDate = endDate.toISOString();
        
        // Fetch jobs for the company
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("metadata->source", "client_api")
          .gte("created_at", formattedStartDate)
          .lte("created_at", formattedEndDate)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        setJobs(data || []);
        setTotalJobs(data?.length || 0);
        
        // Calculate success rate (status = 'sent' or 'generated')
        const successfulJobs = data?.filter(job => 
          job.status === 'sent' || job.status === 'generated'
        ) || [];
        setSuccessRate(data?.length ? (successfulJobs.length / data.length) * 100 : 0);
        
        // Calculate email sent rate (email_sent = true)
        const sentEmails = data?.filter(job => job.email_sent === true) || [];
        setEmailSentRate(data?.length ? (sentEmails.length / data.length) * 100 : 0);
        
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        setError(err.message || "Failed to fetch jobs data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [startDate, endDate]);

  // Apply filters to jobs
  useEffect(() => {
    let result = [...jobs];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(job => job.status === statusFilter);
    }
    
    // Apply domain filter
    if (domainFilter) {
      result = result.filter(job => job.domain === domainFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job => 
        job.email?.toLowerCase().includes(query) || 
        job.domain?.toLowerCase().includes(query) ||
        job.full_name?.toLowerCase().includes(query)
      );
    }
    
    setFilteredJobs(result);
    
    // Calculate total pages for pagination
    setTotalPages(Math.ceil(result.length / jobsPerPage));
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [jobs, statusFilter, domainFilter, searchQuery]);

  // Get unique domains for domain filter
  const uniqueDomains = Array.from(new Set(jobs.map(job => job.domain)));

  // Get unique statuses for status filter
  const uniqueStatuses = Array.from(new Set(jobs.map(job => job.status)));

  // Handle job selection for modal
  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Get current page of jobs
  const getCurrentJobs = () => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  };

  // Empty state messages
  const emptyStateMessages = [
    "No jobs yet? Time to send your first personalized email!",
    "Your analytics dashboard is ready and waiting for your first job.",
    "Start processing leads to see your statistics here!"
  ];
  
  // Randomly select an empty state message
  const randomEmptyMessage = emptyStateMessages[Math.floor(Math.random() * emptyStateMessages.length)];

  return (
    <>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Analytics" />
        
        {/* Date Range Filter */}
        <div className="mb-6">
          <DateRangeFilter 
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-6">
          <StatisticsCard
            title="Total Jobs"
            value={totalJobs.toString()}
            description={`From ${format(startDate, 'MMM dd, yyyy')} to ${format(endDate, 'MMM dd, yyyy')}`}
            icon="chart"
          />
          <StatisticsCard
            title="Success Rate"
            value={`${successRate.toFixed(1)}%`}
            description="Jobs with status 'sent' or 'generated'"
            icon="success"
          />
          <StatisticsCard
            title="Email Sent Rate"
            value={`${emailSentRate.toFixed(1)}%`}
            description="Jobs where emails were actually sent"
            icon="email"
          />
        </div>
        
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Status Filter */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          
          {/* Domain Filter */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Domain
            </label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">All Domains</option>
              {uniqueDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by email or name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>
        
        {/* Jobs Table */}
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex h-60 items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-danger">{error}</p>
              <p className="mt-2">Please try again later or contact support.</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex h-60 items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-black dark:text-white">{randomEmptyMessage}</p>
            </div>
          </div>
        ) : (
          <>
            <JobsTable 
              jobs={getCurrentJobs()}
              onViewDetails={handleViewJobDetails}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
      
      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AnalyticsPage;
