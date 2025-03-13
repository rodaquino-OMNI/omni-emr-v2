
import { useState, useEffect } from 'react';
import { Language } from '../types/auth';
import { secureStorage } from '../utils/secureStorage';

export const useLanguageSettings = () => {
  const [language, setLanguage] = useState<Language>(() => {
    return secureStorage.getItem('language', 'pt') as Language;
  });

  // Save language preference to secured storage when it changes
  useEffect(() => {
    secureStorage.setItem('language', language);
  }, [language]);

  return { language, setLanguage };
};
