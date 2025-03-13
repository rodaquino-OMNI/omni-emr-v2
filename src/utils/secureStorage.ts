
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

// Use a secret that comes from a secure source in a production app
// For simplicity, we're using a hardcoded key here, but ideally this would 
// be derived from user-specific information in a secure way
const SECRET_KEY = 'OMNICare-Session-Security-Key';

export const secureStorage = {
  setItem: <T>(key: string, value: T): void => {
    try {
      const valueToStore = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(valueToStore, SECRET_KEY).toString();
      sessionStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error encrypting and storing data:', error);
      
      // Show a toast only to admin users to prevent information leakage
      const userRole = secureStorage.getItem<string>('user_role', '');
      if (userRole === 'admin') {
        toast.error('Storage encryption error', {
          description: 'Failed to securely store data. This may affect application security.',
          icon: <AlertTriangle className="h-5 w-5" />
        });
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
      
      // Show a toast only to admin users to prevent information leakage
      const userRole = secureStorage.getItem<string>('user_role', '');
      if (userRole === 'admin') {
        toast.error('Storage decryption error', {
          description: 'Failed to retrieve securely stored data. This may affect application security.',
          icon: <AlertTriangle className="h-5 w-5" />
        });
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
