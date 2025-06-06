// Import the free email domains from separate file
import freeDomains from './free_email_domains.js';

export type DomainType = 'business' | 'free' | 'other';

// Legacy function for backward compatibility
export function isBusinessDomain(email: string): boolean | DomainType {
  return getDomainType(email) === 'business';
}

// New function that returns the domain type
export function getDomainType(email: string): DomainType {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return 'other';
  return freeDomains.includes(domain) ? 'free' : 'business';
}

export function extractDomainFromEmail(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isBusinessDomain,
    getDomainType,
    extractDomainFromEmail
  };
}
