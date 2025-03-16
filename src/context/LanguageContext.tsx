
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Languages } from '@/types/auth';

interface LanguageContextProps {
  language: Languages;
  setLanguage: (language: Languages) => void;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Languages>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Languages;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguage(savedLanguage);
    } else {
      // Try to get browser language, defaulting to English if not available
      const browserLang = navigator.language.substring(0, 2).toLowerCase();
      if (browserLang === 'pt') {
        setLanguage('pt');
      }
    }
  }, []);

  const handleSetLanguage = (newLanguage: Languages) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
