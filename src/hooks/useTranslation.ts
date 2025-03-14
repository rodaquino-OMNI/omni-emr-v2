
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { Language } from '../types/auth';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  
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
  
  return { t, language };
};
