
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, UserCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CosignatureRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCosignature: (cosignerId: string) => void;
}

const CosignatureRequestModal = ({
  open,
  onOpenChange,
  onRequestCosignature
}: CosignatureRequestModalProps) => {
  const { language } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useState('');
  
  // Mock providers list - in a real app this would come from an API
  const providers = [
    { id: 'provider-1', name: 'Dr. Sarah Johnson', role: 'Attending Physician' },
    { id: 'provider-2', name: 'Dr. Michael Chen', role: 'Specialist' },
    { id: 'provider-3', name: 'Dr. Emily Rodriguez', role: 'Department Head' }
  ];

  const handleRequestCosignature = () => {
    if (selectedProvider) {
      onRequestCosignature(selectedProvider);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {language === 'pt' ? 'Solicitar Coassinatura' : 'Request Cosignature'}
          </DialogTitle>
          <DialogDescription>
            {language === 'pt' 
              ? 'Selecione um provedor para coassinar esta nota clínica.' 
              : 'Select a provider to cosign this clinical note.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {providers.map((provider) => (
            <div 
              key={provider.id}
              className={`p-3 border rounded-md cursor-pointer flex items-center justify-between ${
                selectedProvider === provider.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedProvider(provider.id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{provider.name}</span>
                <span className="text-sm text-muted-foreground">{provider.role}</span>
              </div>
              {selectedProvider === provider.id && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {language === 'pt' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button
            onClick={handleRequestCosignature}
            disabled={!selectedProvider}
            className="gap-1"
          >
            <UserCheck className="h-4 w-4" />
            {language === 'pt' ? 'Solicitar Coassinatura' : 'Request Cosignature'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CosignatureRequestModal;
