
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Language } from '../types/auth';
import { secureStorage } from '../utils/secureStorage';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get language preference from secure storage first
    const savedLanguage = secureStorage.getItem('language', 'en') as Language;
    
    // If not found, try browser language
    if (!savedLanguage) {
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'pt' ? 'pt' : 'en';
    }
    
    return savedLanguage;
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    secureStorage.setItem('language', newLanguage);
    
    // Also update HTML lang attribute for accessibility
    document.documentElement.lang = newLanguage;
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'pt' : 'en';
    setLanguage(newLanguage);
  };

  // Set the HTML lang attribute on initial load
  useEffect(() => {
    document.documentElement.lang = language;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
