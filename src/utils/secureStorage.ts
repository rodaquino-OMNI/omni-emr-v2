
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
      // Convert data to string and encrypt
      const valueStr = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(valueStr, SECRET_KEY).toString();
      
      // Store in localStorage
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error storing data securely:', error);
    }
  },

  /**
   * Retrieve and decrypt data from localStorage
   */
  getItem<T>(key: StorageKey, defaultValue: T | null = null): T | null {
    try {
      // Get encrypted data from localStorage
      const encryptedValue = localStorage.getItem(key);
      
      if (!encryptedValue) {
        return defaultValue;
      }
      
      // Decrypt data
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      return JSON.parse(decryptedValue) as T;
    } catch (error) {
      console.error('Error retrieving secure data:', error);
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
