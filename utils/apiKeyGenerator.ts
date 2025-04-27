import crypto from 'crypto';

/**
 * Generates a secure API key with the format: prefix_base64string
 * The prefix helps with quick identification and the base64 string provides security
 */
export function generateApiKey(): { fullKey: string; prefix: string; hash: string; salt: string } {
  // Create a prefix (first 8 characters)
  const prefix = 'agemail_' + crypto.randomBytes(4).toString('hex');
  
  // Generate a secure random string for the key body (32 bytes = 256 bits)
  const keyBody = crypto.randomBytes(32).toString('base64').replace(/[+/=]/g, '');
  
  // Combine to form the full key
  const fullKey = `${prefix}_${keyBody}`;
  
  // Generate a salt for hashing
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash the key for storage (we'll store the hash, not the actual key)
  const hash = hashApiKey(fullKey, salt);
  
  return {
    fullKey,
    prefix,
    hash,
    salt
  };
}

/**
 * Hash an API key with a salt using SHA-256
 */
export function hashApiKey(apiKey: string, salt: string): string {
  return crypto
    .createHmac('sha256', salt)
    .update(apiKey)
    .digest('hex');
}

/**
 * Verify if a provided API key matches the stored hash
 */
export function verifyApiKey(providedKey: string, storedHash: string, storedSalt: string): boolean {
  const computedHash = hashApiKey(providedKey, storedSalt);
  return crypto.timingSafeEqual(
    Buffer.from(computedHash, 'hex'),
    Buffer.from(storedHash, 'hex')
  );
}
