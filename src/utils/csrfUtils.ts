
import { secureStorage } from './secureStorage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a new CSRF token and stores it securely
 * @returns The generated CSRF token
 */
export const generateCSRFToken = (): string => {
  const token = uuidv4();
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
 * Validates a CSRF token against the stored token
 * @param token The token to validate
 * @returns True if the token is valid, false otherwise
 */
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return !!storedToken && token === storedToken;
};

/**
 * Clears the stored CSRF token
 */
export const clearCSRFToken = (): void => {
  secureStorage.removeItem('csrf_token');
};
