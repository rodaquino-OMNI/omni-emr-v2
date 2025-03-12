
import { useAuth } from "../context/AuthContext";
import { translations, TranslationKey } from "../i18n/translations";

export const useTranslation = () => {
  const { language } = useAuth();
  
  // Function to translate a key
  const t = (key: TranslationKey): string => {
    // Try to get translation in current language
    const translation = translations[language]?.[key];
    
    // Return the translation or fallback to Portuguese (now default)
    return translation || translations.pt[key] || key;
  };
  
  // Function to translate a plain text (not from translation keys)
  const translateContent = (text: string): string => {
    // This is a simple implementation - in a real app you might use a more 
    // sophisticated translation service or dictionary approach
    if (language === 'pt') return text; // Already in Portuguese
    
    // For English, we would need a dictionary of common phrases
    // This is simplified for the example
    return text;
  };
  
  return { t, translateContent, language };
};
