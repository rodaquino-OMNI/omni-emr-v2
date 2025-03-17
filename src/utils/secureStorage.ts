
import CryptoJS from 'crypto-js';

// A simple encryption key - in a real app, this should be more secure
// Ideally fetched from environment variables
const SECRET_KEY = process.env.REACT_APP_STORAGE_KEY || 'healthcare-emr-storage-key';

/**
 * Secure storage utility to safely store data in localStorage with encryption
 */
export const secureStorage = {
  /**
   * Set an item in localStorage with encryption
   */
  setItem<T>(key: string, value: T): void {
    try {
      const valueStr = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(valueStr, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error setting secure storage item:', error);
    }
  },

  /**
   * Get an item from localStorage with decryption
   */
  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return defaultValue;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      return decrypted ? JSON.parse(decrypted) : defaultValue;
    } catch (error) {
      console.error('Error getting secure storage item:', error);
      return defaultValue;
    }
  },

  /**
   * Remove an item from localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing secure storage item:', error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
};
