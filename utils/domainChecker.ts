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
