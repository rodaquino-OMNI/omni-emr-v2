
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TranslatedTextProps {
  textKey: string;
  fallback: string;
  className?: string;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  textKey, 
  fallback,
  className 
}) => {
  const { t, hasTranslation } = useTranslation();
  
  const translatedText = hasTranslation(textKey) ? t(textKey) : fallback;
  
  return (
    <span className={className}>
      {translatedText}
    </span>
  );
};

export default TranslatedText;
