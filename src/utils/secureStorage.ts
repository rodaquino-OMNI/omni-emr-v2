
import CryptoJS from 'crypto-js';

// A secure key derived from window properties (for demo purposes)
// In production, this should be more sophisticated or environment-based
const getSecureKey = (): string => {
  const baseKey = window.location.host + navigator.userAgent.substring(0, 10);
  return CryptoJS.SHA256(baseKey).toString();
};

export const secureStorage = {
  /**
   * Securely store an item in localStorage with encryption
   * @param key The key to store the value under
   * @param value The value to store
   */
  setItem(key: string, value: any): void {
    try {
      const secureKey = getSecureKey();
      const valueToStore = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(valueToStore, secureKey).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error securely storing data:', error);
    }
  },

  /**
   * Retrieve and decrypt an item from localStorage
   * @param key The key to retrieve
   * @param defaultValue The default value to return if key not found
   * @returns The decrypted value or defaultValue if not found
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const secureKey = getSecureKey();
      const encrypted = localStorage.getItem(key);
      
      if (!encrypted) {
        return defaultValue;
      }
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, secureKey).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return defaultValue;
    }
  },

  /**
   * Remove an item from localStorage
   * @param key The key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing secure data:', error);
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

export default secureStorage;
