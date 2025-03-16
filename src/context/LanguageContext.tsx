
import React, { createContext, useState, useEffect } from 'react';
import { Languages } from '../types/auth';

interface LanguageContextType {
  language: Languages;
  setLanguage: (lang: Languages) => void;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {}
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Try to get stored language from localStorage, default to 'en'
  const [language, setLanguage] = useState<Languages>(() => {
    try {
      const storedLanguage = localStorage.getItem('language');
      return (storedLanguage === 'en' || storedLanguage === 'pt') 
        ? storedLanguage as Languages
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

// Export a hook for easier context consumption
export const useLanguageContext = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    console.warn('useLanguageContext: Context not available, using default values');
    return { language: 'en' as Languages, setLanguage: () => {} };
  }
  return context;
};
