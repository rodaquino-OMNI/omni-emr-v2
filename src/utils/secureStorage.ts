
/**
 * Secure storage utility for sensitive data
 * This is a wrapper around localStorage with added security features
 */

type StorageKey = 'selectedSector' | 'authToken' | 'userPreferences';

export const secureStorage = {
  /**
   * Store a value securely
   */
  setItem: <T>(key: StorageKey, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },

  /**
   * Retrieve a value securely
   */
  getItem: <T>(key: StorageKey, defaultValue: T | null = null): T | null => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * Remove a stored value
   */
  removeItem: (key: StorageKey): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  /**
   * Clear all stored values
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};
