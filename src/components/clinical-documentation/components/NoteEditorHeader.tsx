
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, FilePenLine, MoreHorizontal, FileQuestion } from 'lucide-react';
import { NoteStatus } from '@/types/clinicalNotes';
import { useTranslation } from '@/hooks/useTranslation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SignatureModal from './SignatureModal';

interface NoteEditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: (status: NoteStatus) => void;
  onCancel: () => void;
  isSaving?: boolean;
  isOfflineMode?: boolean;
  requiredFieldsError?: string[];
  validateNote?: () => boolean;
}

const NoteEditorHeader = ({ 
  title, 
  onTitleChange, 
  onSave, 
  onCancel,
  isSaving = false,
  isOfflineMode = false,
  requiredFieldsError = [],
  validateNote = () => true
}: NoteEditorHeaderProps) => {
  const { language } = useTranslation();
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  
  const handleSignClick = () => {
    // Run validation before opening signature modal
    validateNote();
    setSignatureModalOpen(true);
  };

  return (
    <div className="space-y-3">
      {isOfflineMode && (
        <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md flex items-center gap-2 text-sm animate-pulse-subtle">
          <FileQuestion className="h-4 w-4 text-amber-500" />
          {language === 'pt' 
            ? 'Você está trabalhando offline. Suas alterações serão sincronizadas quando a conexão for restaurada.' 
            : 'You are working offline. Your changes will be synchronized when connection is restored.'}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={language === 'pt' ? "Título da nota..." : "Note title..."}
            className="font-medium text-lg h-11 transition-all duration-200 border-primary/20 focus:border-primary"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => onSave('draft')}
            disabled={isSaving}
            className="transition-all duration-200 hover:border-primary/50"
          >
            <Save className="h-4 w-4 mr-1" />
            {language === 'pt' ? 'Salvar rascunho' : 'Save draft'}
          </Button>
          
          <Button 
            onClick={handleSignClick}
            disabled={isSaving}
            className="gap-1 transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            <FilePenLine className="h-4 w-4" />
            {language === 'pt' ? 'Assinar' : 'Sign'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="transition-all duration-200 hover:border-primary/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onCancel} className="cursor-pointer">
                {language === 'pt' ? 'Cancelar' : 'Cancel'}
              </DropdownMenuItem>
              {/* More options can be added here */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <SignatureModal 
        open={signatureModalOpen}
        onOpenChange={setSignatureModalOpen}
        onSign={onSave}
        hasMissingFields={requiredFieldsError.length > 0}
        missingFields={requiredFieldsError}
      />
    </div>
  );
};

export default NoteEditorHeader;
