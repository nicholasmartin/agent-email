# Domain Type Tracking Enhancement - Phase 2

## Overview
Enhance the job processing system to track and categorize email domains as business or free email providers. This will improve analytics capabilities and provide insights into the types of leads being processed.

## Background
Currently, if a request has a free email provider (like Gmail or Outlook), it's rejected early in the process and doesn't get registered in the jobs table. This means we lose valuable data about how many potential leads are being filtered out due to domain type.

## Requirements

### Domain Checker Enhancement
- Modify the `isBusinessDomain` function to return a category instead of a boolean:
  - 'business': Business email domains
  - 'free': Free email providers (Gmail, Outlook, etc.)
  - 'other': Other types of domains
- Ensure the process continues as normal if domain type is 'business'
- Update any dependent code to handle the new return type

### Job Processing Logic Updates
- Create job records for ALL incoming requests regardless of domain type
- For non-business domains:
  - Set status to 'rejected_free_email' instead of just 'rejected'
  - Include domain type information in job metadata
- Store domain categorization in the job record for analytics purposes

### Database Changes
- No schema changes required
- Utilize existing fields:
  - `status` field for the new 'rejected_free_email' status
  - `metadata` JSON field to store domain type information

### Analytics Dashboard Updates
- Add a new statistics card showing:
  - Percentage of business vs. free email domains
  - Total count of each domain type
- Update filtering options to include domain type
- Ensure proper display of the new 'rejected_free_email' status in the jobs table

## Technical Implementation

### Domain Checker Function
```typescript
// Current implementation (returns boolean)
function isBusinessDomain(email: string): boolean

// New implementation (returns category)
function isBusinessDomain(email: string): 'business' | 'free' | 'other'
```

### Job Processor Changes
- Update the job processor to create records before domain validation
- Modify the domain validation logic to use the new categorization
- Update status setting based on domain type

### Testing Requirements
- Test with various email domains (business, free, and other)
- Verify correct categorization and job status
- Ensure analytics dashboard correctly displays the new data

## Dependencies
- Completion of Phase 1 (Analytics Dashboard)
- Access to domain checking utilities
- Job processing workflow

## Related Issues
- This is Phase 2 of the analytics implementation
- Depends on Phase 1 (Analytics Dashboard) being completed first

## Acceptance Criteria
- [ ] Domain checker function returns categories instead of boolean
- [ ] All incoming requests create job records regardless of domain type
- [ ] Non-business domains are properly marked with 'rejected_free_email' status
- [ ] Domain type information is stored in job metadata
- [ ] Analytics dashboard shows business vs. free email domain statistics
- [ ] Filtering by domain type works correctly
- [ ] Existing functionality for business domains remains unchanged
