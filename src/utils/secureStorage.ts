
// Define allowed storage keys for type safety
export type StorageKey = 
  | 'login_attempts' 
  | 'login_lockout_until' 
  | 'csrf_token' 
  | 'language' 
  | 'theme' 
  | 'selected_sector'
  | 'last_activity'
  | 'user_preferences';

/**
 * Get an item from secure storage
 */
export const getSecureItem = <T>(key: StorageKey): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item from storage: ${key}`, error);
    return null;
  }
};

/**
 * Set an item in secure storage
 */
export const setSecureItem = <T>(key: StorageKey, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in storage: ${key}`, error);
  }
};

/**
 * Remove an item from secure storage
 */
export const removeSecureItem = (key: StorageKey): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from storage: ${key}`, error);
  }
};

/**
 * Clear all secure storage
 */
export const clearSecureStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`Error clearing storage`, error);
  }
};
