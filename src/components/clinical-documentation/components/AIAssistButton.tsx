
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface AIAssistButtonProps {
  isRequestingAI: boolean;
  onClick: () => void;
}

const AIAssistButton = ({ 
  isRequestingAI, 
  onClick 
}: AIAssistButtonProps) => {
  const { language } = useTranslation();
  
  return (
    <Button
      variant="outline"
      className="w-full justify-center"
      onClick={onClick}
      disabled={isRequestingAI}
    >
      {isRequestingAI ? (
        <>
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          {language === 'pt' ? 'Gerando com IA...' : 'Generating with AI...'}
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          {language === 'pt' ? 'Gerar conteúdo com IA' : 'Generate content with AI'}
        </>
      )}
    </Button>
  );
};

export default AIAssistButton;
