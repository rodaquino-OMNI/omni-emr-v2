
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useAuth();
  const { t } = useTranslation();
  
  const languages = [
    { code: 'en', label: t('english') },
    { code: 'pt', label: t('portuguese') },
    { code: 'es', label: t('spanish') }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline-block">
            {language === 'en' ? 'EN' : language === 'pt' ? 'PT' : 'ES'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="py-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => setLanguage(lang.code as 'en' | 'pt' | 'es')}
            >
              <span>{lang.label}</span>
              {language === lang.code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
