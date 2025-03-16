
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle, Languages, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { savePortugueseNameMapping } from '@/services/rxnorm/rxnormLanguageMapping';

interface MedicineTranslationFormProps {
  rxnormCode?: string;
  englishName?: string;
  onSuccess?: (portugueseName: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MedicineTranslationForm: React.FC<MedicineTranslationFormProps> = ({
  rxnormCode,
  englishName,
  onSuccess,
  open,
  onOpenChange
}) => {
  const { t, language } = useTranslation();
  const [portugueseName, setPortugueseName] = useState('');
  const [anvisaCode, setAnvisaCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!portugueseName || !rxnormCode || !englishName) {
      toast.error(language === 'pt' 
        ? 'Por favor, preencha todos os campos obrigatórios' 
        : 'Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to database
      const success = await savePortugueseNameMapping(
        rxnormCode,
        englishName,
        portugueseName,
        anvisaCode,
        notes
      );
      
      if (!success) throw new Error('Failed to save translation');
      
      toast.success(
        language === 'pt' 
          ? 'Tradução enviada com sucesso' 
          : 'Translation submitted successfully',
        {
          description: language === 'pt'
            ? 'Obrigado pela sua contribuição!'
            : 'Thank you for your contribution!',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        }
      );
      
      // Call success callback with the new translation
      if (onSuccess) {
        onSuccess(portugueseName);
      }
      
      // Close dialog
      onOpenChange(false);
      
      // Reset form
      setPortugueseName('');
      setAnvisaCode('');
      setNotes('');
    } catch (error) {
      console.error('Error submitting translation:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao enviar tradução' 
          : 'Error submitting translation',
        {
          description: error.message,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              {language === 'pt' 
                ? 'Contribuir com Tradução de Medicamento' 
                : 'Contribute Medication Translation'}
            </div>
          </DialogTitle>
          <DialogDescription>
            {language === 'pt'
              ? 'Ajude-nos a construir uma base de dados bilíngue de medicamentos.'
              : 'Help us build a bilingual medication database.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="english-name">
              {language === 'pt' ? 'Nome em Inglês' : 'English Name'}
            </Label>
            <Input
              id="english-name"
              value={englishName}
              readOnly
              className="bg-muted"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="portuguese-name" className="text-primary">
              {language === 'pt' ? 'Nome em Português' : 'Portuguese Name'} *
            </Label>
            <Input
              id="portuguese-name"
              value={portugueseName}
              onChange={(e) => setPortugueseName(e.target.value)}
              placeholder={language === 'pt' ? 'Ex: Paracetamol' : 'Ex: Paracetamol'}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="anvisa-code">
              {language === 'pt' ? 'Código ANVISA (opcional)' : 'ANVISA Code (optional)'}
            </Label>
            <Input
              id="anvisa-code"
              value={anvisaCode}
              onChange={(e) => setAnvisaCode(e.target.value)}
              placeholder={language === 'pt' ? 'Ex: 1234567890' : 'Ex: 1234567890'}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">
              {language === 'pt' ? 'Observações (opcional)' : 'Notes (optional)'}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'pt' 
                ? 'Qualquer informação adicional sobre este medicamento...' 
                : 'Any additional information about this medication...'}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isSubmitting || !portugueseName}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {language === 'pt' ? 'Enviar Tradução' : 'Submit Translation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineTranslationForm;
