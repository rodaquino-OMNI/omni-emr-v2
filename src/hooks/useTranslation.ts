
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { Language } from '../types/auth';

export const useTranslation = () => {
  const { language, setLanguage, toggleLanguage } = useContext(LanguageContext);

  if (!language) {
    console.warn('useTranslation: No language set in context, defaulting to "en"');
  }

  const t = (key: string): string => {
    const currentLanguage = language || 'en';
    const keys = key.split('.');
    let result: any = translations;
    
    // Navigate through nested properties
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Get translation for current language
    if (result && typeof result === 'object' && currentLanguage in result) {
      return result[currentLanguage];
    }
    
    // Fallback to English if translation not found
    if (result && typeof result === 'object' && 'en' in result) {
      console.warn(`Translation not found for key ${key} in language ${currentLanguage}, falling back to English`);
      return result.en;
    }
    
    // Return key if no translation found
    console.warn(`No translation found for ${key}`);
    return key;
  };

  // Add a hasTranslation utility function to check if a translation key exists
  const hasTranslation = (key: string): boolean => {
    const currentLanguage = language || 'en';
    const keys = key.split('.');
    let result: any = translations;
    
    // Navigate through nested properties
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return false;
      }
    }
    
    // Check if translation exists for current language
    return result && typeof result === 'object' && currentLanguage in result;
  };

  return {
    t,
    language: language as Language,
    setLanguage,
    toggleLanguage,
    hasTranslation
  };
};

export default useTranslation;
