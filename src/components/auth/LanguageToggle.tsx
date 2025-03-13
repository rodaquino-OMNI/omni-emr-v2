
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import { Language } from '@/types/auth';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageToggle = ({ language, setLanguage }: LanguageToggleProps) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => {
            // Toggle between Portuguese and English only
            const nextLang = language === 'pt' ? 'en' : 'pt';
            setLanguage(nextLang);
          }}
        >
          <Globe className="h-4 w-4" />
          {language === 'pt' ? 'Português' : 'English'}
        </Button>
      </div>
    </div>
  );
};

export default LanguageToggle;
