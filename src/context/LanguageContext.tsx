
import React, { createContext, useState, useEffect } from 'react';
import { Language } from '../types/auth';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {}
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Try to get stored language from localStorage, default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const storedLanguage = localStorage.getItem('language');
      return (storedLanguage === 'en' || storedLanguage === 'pt') 
        ? storedLanguage 
        : 'en';
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 'en';
    }
  });

  // Store language changes in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
