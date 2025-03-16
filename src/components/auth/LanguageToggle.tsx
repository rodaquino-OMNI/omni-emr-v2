
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Languages } from '@/types/auth';

export interface LanguageToggleProps {
  language: Languages;
  setLanguage: (language: Languages) => void;
}

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center text-xs"
    >
      {language === 'en' ? 'PT' : 'EN'}
    </Button>
  );
};

export default LanguageToggle;
