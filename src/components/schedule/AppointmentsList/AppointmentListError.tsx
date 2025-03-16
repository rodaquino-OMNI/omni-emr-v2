
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

const AppointmentListError = () => {
  const { t } = useTranslation();
  
  return (
    <div className="p-6 text-center border rounded-md border-red-200 bg-red-50">
      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 className="mb-2 text-lg font-medium text-red-800">{t('appointmentsLoadError')}</h3>
      <p className="mb-4 text-sm text-red-600">
        {t('appointmentsErrorDescription')}
      </p>
      <Button 
        variant="outline" 
        onClick={() => window.location.reload()}
      >
        {t('tryAgain')}
      </Button>
    </div>
  );
};

export default AppointmentListError;
