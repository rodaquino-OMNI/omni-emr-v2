
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const LanguageSwitcherButton = ({ 
  variant = 'ghost', 
  size = 'sm' 
}: LanguageSwitcherButtonProps) => {
  const { language, setLanguage } = useAuth();
  const { t } = useTranslation();
  
  const languages = [
    { code: 'pt', label: t('portuguese') },
    { code: 'en', label: t('english') }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline-block">
            {language === 'pt' ? 'PT' : 'EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center justify-between"
            onClick={() => setLanguage(lang.code as 'en' | 'pt')}
          >
            <span>{lang.label}</span>
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcherButton;
