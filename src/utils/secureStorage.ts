
import CryptoJS from 'crypto-js';

export type StorageKey = 
  | 'userData'
  | 'authToken'
  | 'selectedSector'
  | 'language'
  | 'theme'
  | 'consentGiven'
  | 'lastLogin'
  | 'deviceId'
  | 'csrfToken'
  | 'lastActiveTime'
  | 'login_attempts'
  | 'login_lockout_until'
  | 'csrf_token';

// Simple encryption key - in a real app, this should be more secure
const SECRET_KEY = 'healthcare-secure-storage-key';

/**
 * A secure storage utility for sensitive data
 */
export const secureStorage = {
  /**
   * Store data securely in localStorage with encryption
   */
  setItem<T>(key: StorageKey, value: T): void {
    try {
      console.log(`[DEBUG] secureStorage.setItem called for key: ${key}`);
      console.log(`[DEBUG] secureStorage.setItem value type: ${typeof value}`);
      
      // Check if value is serializable
      if (value === undefined) {
        console.error('[DEBUG] secureStorage.setItem: Value is undefined');
        throw new Error('Cannot store undefined value');
      }
      
      // Log more details about the value
      if (typeof value === 'object' && value !== null) {
        console.log(`[DEBUG] secureStorage.setItem: Object keys: ${Object.keys(value).join(', ')}`);
        console.log(`[DEBUG] secureStorage.setItem: Object prototype: ${Object.getPrototypeOf(value)?.constructor?.name || 'unknown'}`);
        
        // Check for circular references or non-serializable properties
        try {
          // Use a replacer function to detect problematic values
          const seen = new WeakSet();
          const replacer = (key: string, val: any) => {
            if (typeof val === 'object' && val !== null) {
              if (seen.has(val)) {
                console.error(`[DEBUG] secureStorage.setItem: Circular reference detected for property ${key}`);
                return '[Circular Reference]';
              }
              seen.add(val);
            }
            if (typeof val === 'function') {
              console.error(`[DEBUG] secureStorage.setItem: Function detected for property ${key}`);
              return '[Function]';
            }
            return val;
          };
          
          // Test serialization
          JSON.stringify(value, replacer);
        } catch (circularError) {
          console.error(`[DEBUG] secureStorage.setItem: Circular reference check failed:`, circularError);
        }
      }
      
      // Convert data to string and encrypt
      try {
        // Create a clean copy for storage to avoid potential issues
        let cleanValue: any;
        
        if (typeof value === 'object' && value !== null) {
          // For objects, create a new object with just the data properties
          if (Array.isArray(value)) {
            cleanValue = [...value];
          } else {
            cleanValue = { ...value };
          }
        } else {
          // For primitives, use as is
          cleanValue = value;
        }
        
        console.log(`[DEBUG] secureStorage.setItem: Using cleaned value for key ${key}:`,
          typeof cleanValue === 'object' ? JSON.stringify(cleanValue, null, 2) : cleanValue);
        
        const valueStr = JSON.stringify(cleanValue);
        console.log(`[DEBUG] secureStorage.setItem: Successfully stringified value for key ${key}, length: ${valueStr.length}`);
        
        const encryptedValue = CryptoJS.AES.encrypt(valueStr, SECRET_KEY).toString();
        console.log(`[DEBUG] secureStorage.setItem: Successfully encrypted value for key ${key}`);
        
        // Store in localStorage
        localStorage.setItem(key, encryptedValue);
        console.log(`[DEBUG] secureStorage.setItem: Successfully stored encrypted value in localStorage for key ${key}`);
      } catch (jsonError) {
        console.error(`[DEBUG] secureStorage.setItem: JSON serialization error for key ${key}:`, jsonError);
        console.error(`[DEBUG] secureStorage.setItem: Value type: ${typeof value}, isArray: ${Array.isArray(value)}`);
        if (typeof value === 'object' && value !== null) {
          console.error(`[DEBUG] secureStorage.setItem: Object keys: ${Object.keys(value).join(', ')}`);
        }
        throw jsonError;
      }
    } catch (error) {
      console.error(`[DEBUG] secureStorage.setItem: Error storing data securely for key ${key}:`, error);
      console.error(`[DEBUG] secureStorage.setItem: Error details:`, error instanceof Error ? error.message : 'Unknown error');
      console.error(`[DEBUG] secureStorage.setItem: Error stack:`, error instanceof Error ? error.stack : 'No stack available');
      throw error;
    }
  },

  /**
   * Retrieve and decrypt data from localStorage
   */
  getItem<T>(key: StorageKey, defaultValue: T | null = null): T | null {
    try {
      console.log(`[DEBUG] secureStorage.getItem called for key: ${key}`);
      
      // Get encrypted data from localStorage
      const encryptedValue = localStorage.getItem(key);
      
      if (!encryptedValue) {
        console.log(`[DEBUG] secureStorage.getItem: No value found for key ${key}, returning default`);
        return defaultValue;
      }
      
      console.log(`[DEBUG] secureStorage.getItem: Found encrypted value for key ${key}, length: ${encryptedValue.length}`);
      
      try {
        // Decrypt data
        console.log(`[DEBUG] secureStorage.getItem: Attempting to decrypt data for key ${key}`);
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
        console.log(`[DEBUG] secureStorage.getItem: Successfully decrypted bytes for key ${key}`);
        
        const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedValue) {
          console.error(`[DEBUG] secureStorage.getItem: Decryption resulted in empty string for key ${key}`);
          return defaultValue;
        }
        console.log(`[DEBUG] secureStorage.getItem: Successfully converted bytes to string for key ${key}, length: ${decryptedValue.length}`);
        
        try {
          console.log(`[DEBUG] secureStorage.getItem: Attempting to parse JSON for key ${key}`);
          const parsedValue = JSON.parse(decryptedValue) as T;
          console.log(`[DEBUG] secureStorage.getItem: Successfully parsed JSON for key ${key}`);
          
          // Log the structure of the parsed value
          if (typeof parsedValue === 'object' && parsedValue !== null) {
            console.log(`[DEBUG] secureStorage.getItem: Retrieved object keys: ${Object.keys(parsedValue).join(', ')}`);
            
            // For selectedSector, validate the structure
            if (key === 'selectedSector') {
              console.log(`[DEBUG] secureStorage.getItem: Validating sector object structure`);
              const sector = parsedValue as any;
              
              if (!sector.id) {
                console.error(`[DEBUG] secureStorage.getItem: Retrieved sector is missing id property`);
              }
              if (!sector.name) {
                console.error(`[DEBUG] secureStorage.getItem: Retrieved sector is missing name property`);
              }
              if (!sector.code) {
                console.error(`[DEBUG] secureStorage.getItem: Retrieved sector is missing code property`);
              }
              
              console.log(`[DEBUG] secureStorage.getItem: Sector validation complete`);
            }
          }
          
          return parsedValue;
        } catch (jsonError) {
          console.error(`[DEBUG] secureStorage.getItem: JSON parsing error for key ${key}:`, jsonError);
          console.error(`[DEBUG] secureStorage.getItem: Error details:`, jsonError instanceof Error ? jsonError.message : 'Unknown error');
          console.error(`[DEBUG] secureStorage.getItem: Decrypted value (first 100 chars): ${decryptedValue.substring(0, 100)}`);
          throw jsonError;
        }
      } catch (cryptoError) {
        console.error(`[DEBUG] secureStorage.getItem: Decryption error for key ${key}:`, cryptoError);
        console.error(`[DEBUG] secureStorage.getItem: Error details:`, cryptoError instanceof Error ? cryptoError.message : 'Unknown error');
        console.error(`[DEBUG] secureStorage.getItem: Error stack:`, cryptoError instanceof Error ? cryptoError.stack : 'No stack available');
        throw cryptoError;
      }
    } catch (error) {
      console.error(`[DEBUG] secureStorage.getItem: Error retrieving secure data for key ${key}:`, error);
      console.error(`[DEBUG] secureStorage.getItem: Error details:`, error instanceof Error ? error.message : 'Unknown error');
      console.error(`[DEBUG] secureStorage.getItem: Error stack:`, error instanceof Error ? error.stack : 'No stack available');
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key: StorageKey): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },

  /**
   * Clear all stored data
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
};
