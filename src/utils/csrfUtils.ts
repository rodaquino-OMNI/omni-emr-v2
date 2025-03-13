
import { secureStorage } from './secureStorage';

/**
 * Generates a CSRF token for protection against cross-site request forgery
 */
export const generateCSRFToken = (): string => {
  const token = Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15);
  secureStorage.setItem('csrf_token', token);
  return token;
};
