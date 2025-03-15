import { useContext } from 'react';
import { LanguageContext } from '../components/providers/LanguageProvider';
import { translations } from '../i18n/translations';
import { Language } from '../types/auth';

export const useTranslation = () => {
  // Get language context
  const context = useContext(LanguageContext);
  
  // Default language if context is not available
  const language: Language = context?.language || 'en';
  const setLanguage = context?.setLanguage || (() => console.warn('Language context not available'));
  
  const t = (key: string, ...params: any[]): string => {
    try {
      // Check if translation exists in current language
      const translated = translations[language]?.[key];
      
      if (translated) return formatted(translated, params);
      
      // Fallback to English if not found in current language
      if (language !== 'en') {
        const englishFallback = translations['en']?.[key];
        if (englishFallback) return formatted(englishFallback, params);
      }
      
      // Return the key itself if no translation found
      console.warn(`Translation missing for key: ${key}`);
      return key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };
  
  // Format a string with provided parameters
  const formatted = (str: string, params: any[]): string => {
    if (params.length === 0) return str;
    
    // If a single object is passed, use it for named replacements
    if (params.length === 1 && typeof params[0] === 'object') {
      let result = str;
      const replacements = params[0];
      Object.keys(replacements).forEach(key => {
        result = result.replace(new RegExp(`{${key}}`, 'g'), replacements[key]);
      });
      return result;
    }
    
    // Otherwise replace {0}, {1}, etc. with the parameters
    return str.replace(/{(\d+)}/g, (match, index) => {
      const paramIndex = parseInt(index, 10);
      return params[paramIndex] !== undefined ? params[paramIndex] : match;
    });
  };
  
  // Add a hasTranslation utility function to check if a translation key exists
  const hasTranslation = (key: string): boolean => {
    return (
      translations[language]?.[key] !== undefined || 
      (language !== 'en' && translations['en']?.[key] !== undefined)
    );
  };
  
  return { t, language, hasTranslation, setLanguage };
};
