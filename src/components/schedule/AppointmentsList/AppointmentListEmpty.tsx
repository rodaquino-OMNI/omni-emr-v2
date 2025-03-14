
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

type AppointmentListEmptyProps = {
  selectedDate?: Date;
  patientId?: string;
};

const AppointmentListEmpty = ({ selectedDate, patientId }: AppointmentListEmptyProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      {selectedDate 
        ? t('noAppointmentsScheduled') 
        : patientId 
          ? t('noAppointmentsForPatient')
          : t('selectDateToViewAppointments')}
    </div>
  );
};

export default AppointmentListEmpty;
