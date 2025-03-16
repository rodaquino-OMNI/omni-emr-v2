
import { useState, useEffect } from 'react';
import { Languages, DEFAULT_LANGUAGE } from '@/constants/language';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Languages>(() => {
    // Get from localStorage or use default
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'pt' || savedLanguage === 'en') 
      ? savedLanguage 
      : DEFAULT_LANGUAGE;
  });
  
  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  return {
    language,
    setLanguage
  };
};
