
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';

// Use a secret that comes from a secure source in a production app
// For simplicity, we're using a hardcoded key here, but ideally this would 
// be derived from user-specific information in a secure way
const SECRET_KEY = 'OMNICare-Session-Security-Key';

// Track if we're currently in an error state to prevent recursion
let errorHandling = false;

// Cache for user role to avoid recursion
let cachedUserRole: string | null = null;

// Helper to safely get user role from storage without causing recursion
const getSafeUserRole = (): string => {
  // If we already have a cached role, use it
  if (cachedUserRole) return cachedUserRole;
  
  try {
    const encryptedRole = sessionStorage.getItem('user_role');
    if (!encryptedRole) return '';
    
    const bytes = CryptoJS.AES.decrypt(encryptedRole, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return '';
    
    const role = JSON.parse(decryptedString);
    cachedUserRole = role; // Cache the result
    return role;
  } catch {
    return '';
  }
};

export const secureStorage = {
  setItem: <T>(key: string, value: T): void => {
    try {
      // If we're setting user_role, update the cache
      if (key === 'user_role') {
        cachedUserRole = value as unknown as string;
      }
      
      const valueToStore = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(valueToStore, SECRET_KEY).toString();
      sessionStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error encrypting and storing data:', error);
      
      // Only show toast if we're not already handling an error
      if (!errorHandling) {
        errorHandling = true;
        
        try {
          // Get user role without using the getItem method to avoid recursion
          const userRole = getSafeUserRole();
          
          // Only show toast to admin users
          if (userRole === 'admin') {
            toast.error('Storage encryption error', {
              description: 'Failed to securely store data. This may affect application security.'
            });
          }
        } finally {
          errorHandling = false;
        }
      }
    }
  },
  
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      // Quick return for cached user role to prevent recursion
      if (key === 'user_role' && cachedUserRole) {
        return cachedUserRole as unknown as T;
      }
      
      const encryptedValue = sessionStorage.getItem(key);
      if (!encryptedValue) return defaultValue;
      
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) return defaultValue;
      
      const parsedValue = JSON.parse(decryptedString) as T;
      
      // Cache user role if that's what we're getting
      if (key === 'user_role') {
        cachedUserRole = parsedValue as unknown as string;
      }
      
      return parsedValue;
    } catch (error) {
      console.error('Error decrypting and retrieving data:', error);
      
      // Only show toast if we're not already handling an error
      if (!errorHandling) {
        errorHandling = true;
        
        try {
          // Get user role without using the getItem method to avoid recursion
          const userRole = getSafeUserRole();
          
          // Only show toast to admin users
          if (userRole === 'admin') {
            toast.error('Storage decryption error', {
              description: 'Failed to retrieve securely stored data. This may affect application security.'
            });
          }
        } finally {
          errorHandling = false;
        }
      }
      
      return defaultValue;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      // Clear cache if removing user_role
      if (key === 'user_role') {
        cachedUserRole = null;
      }
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },
  
  clear: (): void => {
    try {
      // Clear cache when clearing storage
      cachedUserRole = null;
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};
