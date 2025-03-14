
import { translations, TranslationKey } from '@/i18n/translations';

/**
 * Validates that all translations exist in both languages
 * @returns Object containing missing keys for each language
 */
export const validateTranslations = () => {
  const missingKeys = {
    en: [] as string[],
    pt: [] as string[]
  };
  
  // Check all keys for each language
  Object.keys(translations.en).forEach((key) => {
    if (!translations.pt[key as TranslationKey]) {
      missingKeys.pt.push(key);
    }
  });
  
  Object.keys(translations.pt).forEach((key) => {
    if (!translations.en[key as TranslationKey]) {
      missingKeys.en.push(key);
    }
  });
  
  return missingKeys;
};

/**
 * Validates that all translations exist for a specific component's keys
 * @param keys Array of translation keys used in a component
 * @returns Object containing missing keys for each language
 */
export const validateComponentTranslations = <T extends readonly string[]>(keys: T) => {
  const missingKeys = {
    en: [] as string[],
    pt: [] as string[]
  };
  
  keys.forEach((key) => {
    if (!translations.en[key as TranslationKey]) {
      missingKeys.en.push(key as string);
    }
    if (!translations.pt[key as TranslationKey]) {
      missingKeys.pt.push(key as string);
    }
  });
  
  return missingKeys;
};
