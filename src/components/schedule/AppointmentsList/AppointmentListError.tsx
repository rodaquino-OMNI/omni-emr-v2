
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const AppointmentListError = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-8 text-red-500">
      {t('errorLoadingAppointments')}
    </div>
  );
};

export default AppointmentListError;
