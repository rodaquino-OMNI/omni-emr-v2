
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'icon';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'default' }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();
  
  // Helper function to toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };
  
  if (variant === 'icon') {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleLanguage} 
        title={language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'}
      >
        <Globe className="h-5 w-5" />
      </Button>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <button 
        onClick={toggleLanguage} 
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {language === 'en' ? 'PT' : 'EN'}
      </button>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage} 
      className="flex items-center gap-1.5"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? t('portuguese') : t('english')}
    </Button>
  );
};

export default LanguageSwitcher;
