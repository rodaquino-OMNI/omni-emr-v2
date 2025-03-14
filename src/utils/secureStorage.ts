
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';

// Use a secret that comes from a secure source in a production app
// For simplicity, we're using a hardcoded key here, but ideally this would 
// be derived from user-specific information in a secure way
const SECRET_KEY = 'OMNICare-Session-Security-Key';

// Track if we're currently in an error state to prevent recursion
let errorHandling = false;

export const secureStorage = {
  setItem: <T>(key: string, value: T): void => {
    try {
      const valueToStore = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(valueToStore, SECRET_KEY).toString();
      sessionStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error encrypting and storing data:', error);
      
      // Only show toast if we're not already handling an error
      if (!errorHandling) {
        errorHandling = true;
        
        try {
          // Try to get user role directly from sessionStorage to avoid recursion
          const encryptedRole = sessionStorage.getItem('user_role');
          let userRole = '';
          
          if (encryptedRole) {
            try {
              const bytes = CryptoJS.AES.decrypt(encryptedRole, SECRET_KEY);
              const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
              if (decryptedString) {
                userRole = JSON.parse(decryptedString);
              }
            } catch (innerError) {
              // Silently fail on decrypt error
              console.error('Error decrypting role during error handling', innerError);
            }
          }
          
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
      const encryptedValue = sessionStorage.getItem(key);
      if (!encryptedValue) return defaultValue;
      
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) return defaultValue;
      return JSON.parse(decryptedString) as T;
    } catch (error) {
      console.error('Error decrypting and retrieving data:', error);
      
      // Only show toast if we're not already handling an error
      if (!errorHandling) {
        errorHandling = true;
        
        try {
          // Try to get user role directly from sessionStorage to avoid recursion
          const encryptedRole = sessionStorage.getItem('user_role');
          let userRole = '';
          
          if (encryptedRole) {
            try {
              const bytes = CryptoJS.AES.decrypt(encryptedRole, SECRET_KEY);
              const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
              if (decryptedString) {
                userRole = JSON.parse(decryptedString);
              }
            } catch (innerError) {
              // Silently fail on decrypt error
              console.error('Error decrypting role during error handling', innerError);
            }
          }
          
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
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },
  
  clear: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};
