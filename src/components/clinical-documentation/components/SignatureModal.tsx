
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, FilePenLine, AlertTriangle, XCircle } from 'lucide-react';
import { NoteStatus } from '@/types/clinicalNotes';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

interface SignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (status: NoteStatus) => void;
  hasMissingFields: boolean;
  missingFields: string[];
}

const SignatureModal = ({
  open,
  onOpenChange,
  onSign,
  hasMissingFields,
  missingFields
}: SignatureModalProps) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [confirmationText, setConfirmationText] = useState('');
  const isConfirmed = confirmationText === 'SIGN';

  const handleSign = () => {
    if (isConfirmed) {
      onSign('signed');
      onOpenChange(false);
      setConfirmationText('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePenLine className="h-5 w-5" />
            {language === 'pt' ? 'Assinar Nota Clínica' : 'Sign Clinical Note'}
          </DialogTitle>
          <DialogDescription>
            {language === 'pt' 
              ? 'Esta ação é permanente e ficará registrada no sistema.' 
              : 'This action is permanent and will be recorded in the system.'}
          </DialogDescription>
        </DialogHeader>

        {hasMissingFields ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">
                  {language === 'pt' ? 'Campos obrigatórios incompletos' : 'Required fields incomplete'}
                </h4>
                <p className="text-sm mt-1">
                  {language === 'pt'
                    ? 'Complete os seguintes campos antes de assinar:'
                    : 'Please complete the following fields before signing:'}
                </p>
                <ul className="text-sm list-disc pl-5 mt-1">
                  {missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => onOpenChange(false)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Fechar e Completar Campos' : 'Close and Complete Fields'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
              <FilePenLine className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  {language === 'pt'
                    ? `Eu, ${user?.name}, confirmo que esta nota está completa e precisa.`
                    : `I, ${user?.name}, confirm that this note is complete and accurate.`}
                </p>
                <p className="text-sm mt-2">
                  {language === 'pt'
                    ? 'Digite "SIGN" para confirmar:'
                    : 'Type "SIGN" to confirm:'}
                </p>
              </div>
            </div>

            <input
              type="text"
              className="border rounded w-full p-2"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
              placeholder={language === 'pt' ? 'Digite SIGN' : 'Type SIGN'}
            />

            <DialogFooter className="flex sm:justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setConfirmationText('');
                }}
              >
                {language === 'pt' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={!isConfirmed}
                onClick={handleSign}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                {language === 'pt' ? 'Assinar Nota' : 'Sign Note'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
