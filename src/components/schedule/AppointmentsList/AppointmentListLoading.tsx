
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const AppointmentListLoading = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-8 text-muted-foreground animate-pulse">
      {t('loadingAppointments')}...
    </div>
  );
};

export default AppointmentListLoading;
