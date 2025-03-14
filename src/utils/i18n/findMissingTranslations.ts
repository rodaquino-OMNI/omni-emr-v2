
import { translations } from '@/i18n/translations';

/**
 * Finds missing translations by comparing English and Portuguese keys
 * @returns Object containing keys that exist in one language but not the other
 */
export const findMissingTranslations = () => {
  const missingInPortuguese: string[] = [];
  const missingInEnglish: string[] = [];
  
  // Extract all English and Portuguese translations
  const englishEntries = Object.entries(translations).filter(
    ([key, value]) => typeof value === 'object' && 'en' in value
  );
  
  const portugueseEntries = Object.entries(translations).filter(
    ([key, value]) => typeof value === 'object' && 'pt' in value
  );
  
  // Find keys that exist in English but not in Portuguese
  const englishKeys = new Set(englishEntries.map(([key]) => key));
  const portugueseKeys = new Set(portugueseEntries.map(([key]) => key));
  
  englishKeys.forEach(key => {
    if (!portugueseKeys.has(key)) {
      missingInPortuguese.push(key);
    } else if (!translations[key].pt) {
      missingInPortuguese.push(key);
    }
  });
  
  portugueseKeys.forEach(key => {
    if (!englishKeys.has(key)) {
      missingInEnglish.push(key);
    } else if (!translations[key].en) {
      missingInEnglish.push(key);
    }
  });
  
  return {
    missingInPortuguese,
    missingInEnglish,
    hasIncomplete: missingInPortuguese.length > 0 || missingInEnglish.length > 0
  };
};

/**
 * Validates that specific values are consistent across translations
 * @returns Array of validation errors
 */
export const validateConsistentValues = () => {
  const validationErrors: string[] = [];
  
  // Check specific values that should be identical in both languages
  const identicalValuesKeys = [
    'appName',
    'bpm',
    'mmHg'
  ];
  
  identicalValuesKeys.forEach(key => {
    if (translations[key] && translations[key].en !== translations[key].pt) {
      validationErrors.push(`Value for "${key}" should be identical across languages`);
    }
  });
  
  return validationErrors;
};
