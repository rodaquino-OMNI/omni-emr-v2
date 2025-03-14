
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
  const { t } = useTranslation();
  
  // Check if the translation exists by attempting to get it
  const translated = t(textKey);
  
  // If the translation is the same as the key, it means no translation was found
  // In this case, use the fallback or the key itself
  const displayText = translated !== textKey 
    ? translated
    : fallback || textKey;
  
  return (
    <Component className={className}>
      {displayText}
    </Component>
  );
};

export default TranslatedText;
