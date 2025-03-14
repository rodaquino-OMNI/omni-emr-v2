
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslationKey } from '@/i18n/translations';

interface TranslatedTextProps {
  translationKey: TranslationKey;
  fallback?: string;
  className?: string;
  values?: Record<string, string | number>;
}

/**
 * Component that displays translated text with validation
 * and proper fallback handling
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  translationKey, 
  fallback, 
  className,
  values
}) => {
  const { t, hasTranslation } = useTranslation();
  
  // Get the translated text
  let translatedText = t(translationKey);
  
  // If we have values to interpolate, replace them in the string
  if (values) {
    Object.entries(values).forEach(([key, value]) => {
      translatedText = translatedText.replace(`{${key}}`, String(value));
    });
  }
  
  // If the translation doesn't exist, use fallback or key
  const displayText = !hasTranslation(translationKey) ? fallback : translatedText;
  
  return (
    <span className={className}>{displayText || String(translationKey)}</span>
  );
};

export default TranslatedText;
