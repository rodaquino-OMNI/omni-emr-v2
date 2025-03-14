
import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CancelButtonProps {
  onCancelAppointment: () => Promise<void>;
}

const CancelButton = ({ onCancelAppointment }: CancelButtonProps) => {
  const { t } = useTranslation();
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t('cancel')}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('cancelAppointment')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('cancelAppointmentDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('goBack')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onCancelAppointment}
            className="bg-red-500 hover:bg-red-600"
          >
            {t('confirmCancel')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelButton;
