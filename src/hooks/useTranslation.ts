
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { Language } from '../types/auth';

export const useTranslation = () => {
  // Safely get context or use default
  let language: Language = 'en';
  let setLanguage: (lang: Language) => void = () => {};
  
  try {
    // Try to access the context, but fail gracefully if it's not available
    const context = useContext(LanguageContext);
    
    if (context) {
      language = context.language;
      setLanguage = context.setLanguage;
    } else {
      console.warn('useTranslation: LanguageContext not available, using default language');
    }
  } catch (error) {
    console.error('Error accessing LanguageContext:', error);
  }
  
  const t = (key: string): string => {
    try {
      // Attempt to get the translation for the current language
      const translated = translations[language]?.[key];
      
      // If the translation exists, return it
      if (translated) return translated;
      
      // If not found in current language, try English as fallback
      if (language !== 'en') {
        const englishFallback = translations['en']?.[key];
        if (englishFallback) return englishFallback;
      }
      
      // Return the key itself if no translation found
      return key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
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
