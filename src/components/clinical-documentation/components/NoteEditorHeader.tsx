
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Check } from 'lucide-react';
import { NoteStatus } from '@/types/clinicalNotes';
import { useTranslation } from '@/hooks/useTranslation';

interface NoteEditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: (status: NoteStatus) => void;
  onCancel: () => void;
}

const NoteEditorHeader = ({ 
  title, 
  onTitleChange, 
  onSave, 
  onCancel 
}: NoteEditorHeaderProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Input
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder={language === 'pt' ? 'Título da nota' : 'Note title'}
          className="text-lg font-semibold"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          {language === 'pt' ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onSave('draft')}
        >
          <Save className="mr-1 h-4 w-4" />
          {language === 'pt' ? 'Salvar rascunho' : 'Save draft'}
        </Button>
        <Button 
          onClick={() => onSave('signed')}
        >
          <Check className="mr-1 h-4 w-4" />
          {language === 'pt' ? 'Assinar e salvar' : 'Sign & save'}
        </Button>
      </div>
    </div>
  );
};

export default NoteEditorHeader;
