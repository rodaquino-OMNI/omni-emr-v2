
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

interface InstructionsFieldProps {
  preInstructions: string;
  postInstructions: string;
  onPreInstructionsChange: (value: string) => void;
  onPostInstructionsChange: (value: string) => void;
}

const InstructionsField = ({
  preInstructions,
  postInstructions,
  onPreInstructionsChange,
  onPostInstructionsChange
}: InstructionsFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="pre-instructions">
          {language === 'pt' ? 'Instruções Pré-Procedimento' : 'Pre-Procedure Instructions'}
        </Label>
        <Textarea
          id="pre-instructions"
          placeholder={language === 'pt' ? 'Instruções para antes do procedimento...' : 'Instructions for before the procedure...'}
          value={preInstructions}
          onChange={(e) => onPreInstructionsChange(e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="post-instructions">
          {language === 'pt' ? 'Instruções Pós-Procedimento' : 'Post-Procedure Instructions'}
        </Label>
        <Textarea
          id="post-instructions"
          placeholder={language === 'pt' ? 'Instruções para após o procedimento...' : 'Instructions for after the procedure...'}
          value={postInstructions}
          onChange={(e) => onPostInstructionsChange(e.target.value)}
          rows={2}
        />
      </div>
    </>
  );
};

export default InstructionsField;
