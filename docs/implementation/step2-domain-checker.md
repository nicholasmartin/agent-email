# Step 2: Domain Checker Implementation

Create a utility to check if an email is from a business domain:

```typescript
// utils/domainChecker.ts
const freeDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com'
];

export function isBusinessDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !freeDomains.includes(domain);
}

export function extractDomainFromEmail(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}
```

This simple utility provides two key functions:

1. `isBusinessDomain`: Checks if the email domain is a business domain (not a free provider)
2. `extractDomainFromEmail`: Extracts the domain part from an email address

The current implementation uses a hardcoded array of known free email providers. This approach is simple and efficient for the MVP but could be enhanced later with:

- A more comprehensive list of free email providers
- API integration with domain verification services
- Domain reputation checking
- MX record verification to ensure valid email domains

For the initial implementation, this basic approach provides a good balance of simplicity and effectiveness.
