
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslationKey } from '@/i18n/translations';

interface TranslatedTextProps {
  translationKey: TranslationKey;
  fallback?: string;
  className?: string;
}

/**
 * Component that displays translated text with validation
 * and proper fallback handling
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  translationKey, 
  fallback, 
  className 
}) => {
  const { t } = useTranslation();
  const translatedText = t(translationKey);
  
  // If we get back the key, it means translation wasn't found
  const displayText = translatedText === String(translationKey) ? fallback : translatedText;
  
  return (
    <span className={className}>{displayText || String(translationKey)}</span>
  );
};

export default TranslatedText;
