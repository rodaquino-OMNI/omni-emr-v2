
import { secureStorage } from './secureStorage';

/**
 * Generates a secure CSRF token and stores it in secure storage
 * @returns The generated CSRF token
 */
export const generateCSRFToken = (): string => {
  // Generate a random string for CSRF protection
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Store the token in secure storage (which falls back to localStorage in environments without crypto)
  secureStorage.setItem('csrf_token', token);
  
  return token;
};

/**
 * Retrieves the stored CSRF token
 * @returns The stored CSRF token or null if not found
 */
export const getCSRFToken = (): string | null => {
  return secureStorage.getItem('csrf_token', null);
};

/**
 * Validates a CSRF token against the stored one
 * @param token The token to validate
 * @returns True if tokens match, false otherwise
 */
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  
  if (!storedToken) {
    console.error('No CSRF token found in storage. Security validation failed.');
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  if (token.length !== storedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
};

/**
 * Clears the stored CSRF token
 */
export const clearCSRFToken = (): void => {
  secureStorage.removeItem('csrf_token');
};
