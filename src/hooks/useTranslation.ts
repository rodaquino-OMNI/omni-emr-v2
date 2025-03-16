
import { useState, useEffect, useCallback } from 'react';
import { Languages, DEFAULT_LANGUAGE } from '@/constants/language';
import { translations } from '@/i18n/translations';

export interface TranslationReturn {
  language: Languages;
  setLanguage: (lang: Languages) => void;
  t: (key: string, fallback?: string) => string;
  hasTranslation: (key: string) => boolean;
}

export const useTranslation = (): TranslationReturn => {
  const [language, setLanguage] = useState<Languages>(() => {
    // Get from localStorage or use default
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'pt' || savedLanguage === 'en') 
      ? savedLanguage as Languages
      : DEFAULT_LANGUAGE;
  });
  
  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Translation function
  const t = useCallback((key: string, fallback?: string): string => {
    // Get translations for current language
    const currentTranslations = translations[language] || {};
    
    // Return translation or fallback or key
    return currentTranslations[key] || fallback || key;
  }, [language]);
  
  // Check if translation exists
  const hasTranslation = useCallback((key: string): boolean => {
    const currentTranslations = translations[language] || {};
    return !!currentTranslations[key];
  }, [language]);
  
  return {
    language,
    setLanguage,
    t,
    hasTranslation
  };
};
