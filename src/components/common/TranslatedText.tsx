
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TranslatedTextProps {
  textKey: string;
  fallback?: string;
  className?: string;
  as?: React.ElementType;
}

/**
 * A component to display translated text with fallback options
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({
  textKey,
  fallback,
  className,
  as: Component = 'span'
}) => {
  const { t, hasTranslation } = useTranslation();
  
  // If the key exists in translations, use it, otherwise use fallback or key itself
  const displayText = hasTranslation(textKey) 
    ? t(textKey)
    : fallback || textKey;
  
  return (
    <Component className={className}>
      {displayText}
    </Component>
  );
};

export default TranslatedText;
