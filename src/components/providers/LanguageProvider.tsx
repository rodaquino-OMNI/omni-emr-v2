
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Languages } from '@/types/auth';

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
  // Try to get stored language from localStorage, default to browser language or 'en'
  const [language, setLanguage] = useState<Languages>(() => {
    try {
      // First check localStorage
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage === 'en' || storedLanguage === 'pt') {
        return storedLanguage as Languages;
      }
      
      // If no stored language, check browser language
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      return (browserLang === 'pt') ? 'pt' as Languages : 'en' as Languages;
    } catch (error) {
      console.error('Error accessing language settings:', error);
      return 'en';
    }
  });

  // Store language changes in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
      // Also update html lang attribute for accessibility
      document.documentElement.lang = language;
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, [language]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export for usage in the app root
export default LanguageProvider;
