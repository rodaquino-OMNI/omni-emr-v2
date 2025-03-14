
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Language } from '../types/auth';
import { translations, TranslationKey } from '../i18n/translations';

/**
 * Custom hook for accessing the current language and translation function
 * with built-in validation to catch missing translations
 */
export const useTranslation = () => {
  const auth = useContext(AuthContext);
  const language = auth?.language || 'en';

  /**
   * Translates a key into the current language
   * @param key The translation key to look up
   * @returns The translated string or the key itself if translation is missing
   */
  const t = (key: TranslationKey): string => {
    // Safe navigation through the translations object
    const translatedText = translations?.[language]?.[key];
    
    // If translation is missing, log error and return the key as fallback
    if (translatedText === undefined) {
      console.error(`Missing translation for key: ${key} in language: ${language}`);
      return String(key);
    }
    
    return translatedText;
  };

  /**
   * Checks if a translation exists for the given key in the current language
   * @param key The translation key to check
   * @returns True if the translation exists, false otherwise
   */
  const hasTranslation = (key: TranslationKey): boolean => {
    return translations?.[language]?.[key] !== undefined;
  };

  /**
   * Validates a set of keys to ensure they all have translations
   * @param keys Array of translation keys to validate
   * @returns Object with validation result and any missing keys
   */
  const validateTranslations = (keys: TranslationKey[]): { 
    valid: boolean; 
    missingKeys: TranslationKey[] 
  } => {
    const missingKeys = keys.filter(key => !hasTranslation(key));
    return {
      valid: missingKeys.length === 0,
      missingKeys
    };
  };

  return {
    t,
    hasTranslation,
    validateTranslations,
    language,
    availableLanguages: ['en', 'pt'] as Language[]
  };
};
