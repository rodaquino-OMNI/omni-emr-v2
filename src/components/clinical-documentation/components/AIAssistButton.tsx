
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface AIAssistButtonProps {
  onClick: () => void;
  isRequestingAI: boolean;
  disabled?: boolean;
}

const AIAssistButton = ({ 
  onClick, 
  isRequestingAI,
  disabled = false
}: AIAssistButtonProps) => {
  const { language } = useTranslation();
  
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      disabled={isRequestingAI || disabled}
      className="border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
    >
      <Sparkles className="h-4 w-4 mr-2" />
      {isRequestingAI 
        ? (language === 'pt' ? 'Gerando conteúdo...' : 'Generating content...') 
        : (language === 'pt' ? 'Assistência de IA' : 'AI Assistance')}
    </Button>
  );
};

export default AIAssistButton;
