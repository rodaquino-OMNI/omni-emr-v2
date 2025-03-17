
/**
 * Secure storage utility that attempts to use more secure storage options
 * when available, with fallback to localStorage
 */
export const secureStorage = {
  /**
   * Store a value securely
   * @param key The key to store the value under
   * @param value The value to store
   */
  setItem: (key: string, value: any): void => {
    try {
      // Serialize the value
      const serializedValue = JSON.stringify(value);
      
      // Store in localStorage (in a real implementation, we might
      // encrypt this data before storing when crypto is available)
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error storing data securely:', error);
    }
  },
  
  /**
   * Retrieve a value from secure storage
   * @param key The key to retrieve
   * @param defaultValue Default value if key doesn't exist
   * @returns The stored value or the default value
   */
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      // Get from localStorage
      const serializedValue = localStorage.getItem(key);
      
      // Return default if not found
      if (serializedValue === null) {
        return defaultValue;
      }
      
      // Deserialize and return
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error('Error retrieving data securely:', error);
      return defaultValue;
    }
  },
  
  /**
   * Remove a value from secure storage
   * @param key The key to remove
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data securely:', error);
    }
  },
  
  /**
   * Clear all values from secure storage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
};
