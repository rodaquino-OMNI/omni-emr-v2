
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

interface CollectionInstructionsFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const CollectionInstructionsField = ({ value, onChange }: CollectionInstructionsFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1.5">
      <Label htmlFor="collection-instructions">
        {language === 'pt' ? 'Instruções de Coleta' : 'Collection Instructions'}
      </Label>
      <Textarea
        id="collection-instructions"
        placeholder={language === 'pt' 
          ? 'Instruções especiais para coleta da amostra...' 
          : 'Special instructions for specimen collection...'
        }
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
      />
    </div>
  );
};

export default CollectionInstructionsField;
