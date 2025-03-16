
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';

type AppointmentListEmptyProps = {
  selectedDate?: Date;
  patientId?: string;
};

const AppointmentListEmpty = ({ selectedDate, patientId }: AppointmentListEmptyProps) => {
  const { t } = useTranslation();
  
  let message = t('noAppointmentsFound');
  
  if (selectedDate) {
    message = t('noAppointmentsForDate', { date: format(selectedDate, 'PPP') });
  } else if (patientId) {
    message = t('noAppointmentsForPatient');
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center border rounded-md border-dashed">
      <Calendar className="w-12 h-12 mb-4 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-medium">{message}</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {t('appointmentsEmptyDescription')}
      </p>
      <Button>{t('scheduleAppointment')}</Button>
    </div>
  );
};

export default AppointmentListEmpty;
