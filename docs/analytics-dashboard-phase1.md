# Analytics Dashboard - Phase 1

## Overview
Create a new analytics page that provides company users with insights into their job processing statistics and a detailed view of all jobs. This page will help users track the performance of their email generation and sending processes.

## Requirements

### New Page Creation
- Create a new page at `/dashboard/analytics`
- Accessible to all users within a company
- Default view shows data from the last 30 days

### Statistics Cards
Display the following key metrics:
1. **Total Jobs Processed**: Count of all jobs processed by the company
2. **Success Rate**: Percentage of jobs that completed successfully (status = 'sent' or 'generated')
3. **Email Sent Rate**: Percentage of jobs where emails were actually sent (email_sent = true)

### Jobs Table
Create a filterable table with the following:
- Display 50 jobs per page with pagination
- Columns:
  - ID (first 5 characters)
  - Email (recipient email address)
  - Domain (company domain processed)
  - Status (with color coding using TailAdmin default colors)
  - Created (date/time the job was created)
  - Actions (view details button)

### Filtering Options
Implement the following filters:
- Status: Filter by job status
- Date Range: 
  - Preset options (last 7 days, last 30 days, etc.)
  - Custom date picker
- Domain: Filter by specific domains
- Search: Search by email or name

### Job Details Modal
When a user clicks on a job, show a modal with:
- Scrollable design to accommodate large data sets
- Full email content preview (subject and body)
- Error details (if applicable)
- Complete scrape results summary
- All metadata details

### Empty State
- Display friendly, encouraging messages when no jobs are found
- Examples:
  - "No jobs yet? Time to send your first personalized email!"
  - "Your analytics dashboard is ready and waiting for your first job."
  - "Start processing leads to see your statistics here!"

## Technical Considerations

### Data Access
- Ensure all queries filter by company_id to maintain data isolation
- Only show jobs with source = 'client_api'

### Performance
- Implement pagination for the jobs list to handle large volumes
- Load data on page load/refresh (no real-time updates needed)

### UI/UX
- Use card layout for statistics
- Follow existing application styling
- Ensure responsive design for all screen sizes

## Dependencies
- Access to jobs table with company filtering
- Existing authentication and authorization mechanisms

## Related Issues
- This is Phase 1 of the analytics implementation
- Phase 2 (Domain Type Tracking Enhancement) will be implemented separately

## Acceptance Criteria
- [ ] Analytics page is accessible at `/dashboard/analytics`
- [ ] Statistics cards show accurate data for the selected time period
- [ ] Jobs table displays all relevant columns with proper formatting
- [ ] Filtering and search functionality works correctly
- [ ] Job details modal displays complete information
- [ ] Empty state is handled gracefully
- [ ] Data is properly isolated by company_id
