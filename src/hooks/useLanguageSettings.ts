
import { useState, useEffect } from 'react';
import { Languages } from '../types/auth';
import { secureStorage } from '../utils/secureStorage';

export const useLanguageSettings = () => {
  const [language, setLanguage] = useState<Languages>(() => {
    return secureStorage.getItem('language', 'pt') as Languages;
  });

  // Save language preference to secured storage when it changes
  useEffect(() => {
    secureStorage.setItem('language', language);
  }, [language]);

  return { language, setLanguage };
};
