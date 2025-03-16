
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Languages } from '../types/auth';
import { translations } from '../i18n/translations';

export interface TranslationHook {
  language: Languages;
  setLanguage: (lang: Languages) => void;
  t: (key: string, fallback?: string) => string;
  hasTranslation: (key: string) => boolean;
}

export const useTranslation = (): TranslationHook => {
  const { language, setLanguage } = useContext(LanguageContext);

  const hasTranslation = (key: string): boolean => {
    return !!translations[language] && !!translations[language][key];
  };

  const t = (key: string, fallback?: string): string => {
    // If the key doesn't exist in the current language, try to use the English version
    if (!translations[language] || !translations[language][key]) {
      if (translations.en && translations.en[key]) {
        return translations.en[key];
      }
      return fallback || key; // Fallback to provided fallback or key if not found in any language
    }
    
    return translations[language][key];
  };

  return {
    language: language as Languages,
    setLanguage: (lang: Languages) => setLanguage(lang),
    t,
    hasTranslation
  };
};
