
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import translations from '../i18n/translations';

interface TranslationHook {
  t: (key: string) => string;
  language: string;
  changeLanguage: (lang: string) => void;
  hasTranslation: (key: string) => boolean;
}

export const useTranslation = (): TranslationHook => {
  const { language, setLanguage } = useContext(LanguageContext);

  const t = (key: string): string => {
    try {
      // Split the key by dots to access nested properties
      const keys = key.split('.');
      let translation = translations[language];
      
      for (const k of keys) {
        if (translation && typeof translation === 'object' && k in translation) {
          translation = translation[k];
        } else {
          // Return the key if translation not found
          return key;
        }
      }
      
      return translation as string;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  const hasTranslation = (key: string): boolean => {
    try {
      // Split the key by dots to access nested properties
      const keys = key.split('.');
      let translation = translations[language];
      
      for (const k of keys) {
        if (translation && typeof translation === 'object' && k in translation) {
          translation = translation[k];
        } else {
          return false;
        }
      }
      
      return typeof translation === 'string';
    } catch (error) {
      return false;
    }
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  return { t, language, changeLanguage, hasTranslation };
};

export default useTranslation;
