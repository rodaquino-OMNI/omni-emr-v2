
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';
import { Languages } from '@/types/auth';
import { translations } from '@/translations';

export interface TranslationReturn {
  language: Languages;
  setLanguage: (language: Languages) => void;
  t: (key: string, fallback?: string) => string;
  hasTranslation: (key: string) => boolean;
}

export const useTranslation = (): TranslationReturn => {
  const { language, setLanguage } = useContext(LanguageContext);

  // Function to get the translated value for a key
  const t = (key: string, fallback?: string): string => {
    // If the language doesn't exist in our translations, fall back to English
    if (!translations[language]) {
      console.warn(`Language ${language} is not supported, falling back to English`);
      
      // If the key exists in English translations, use it
      if (translations.en[key]) {
        return translations.en[key];
      }
      
      // Otherwise use the fallback or the key itself
      return fallback || key;
    }
    
    // If the translation exists, return it
    if (translations[language][key]) {
      return translations[language][key];
    }
    
    // If the key doesn't exist in the current language but exists in English, use English
    if (translations.en[key]) {
      console.warn(`Translation key "${key}" missing for language "${language}", using English`);
      return translations.en[key];
    }
    
    // Otherwise, return the fallback or the key itself
    return fallback || key;
  };

  // Function to check if a translation exists
  const hasTranslation = (key: string): boolean => {
    return !!translations[language]?.[key] || !!translations.en?.[key];
  };

  return {
    language,
    setLanguage,
    t,
    hasTranslation
  };
};

export default useTranslation;
