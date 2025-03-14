
import React from 'react';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Appointment } from '@/services/appointments';
import AppointmentTypeIcon, { getAppointmentTypeInfo } from './AppointmentTypeIcon';

type AppointmentInfoProps = {
  appointment: Appointment;
};

const AppointmentInfo = ({ appointment }: AppointmentInfoProps) => {
  const { t } = useTranslation();
  const typeInfo = getAppointmentTypeInfo(appointment.type, t);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
      <div className="flex items-center gap-1 text-muted-foreground">
        <User className="h-3.5 w-3.5" />
        <Link to={`/patients/${appointment.patientId}`} className="hover:underline text-primary">
          {appointment.patientName}
        </Link>
      </div>
      
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{appointment.duration} {t('minutes')}</span>
      </div>
      
      <div className="flex items-center gap-1 text-muted-foreground">
        <span className="font-medium">{t('provider')}:</span>
        <span>{appointment.providerName}</span>
      </div>
      
      <div className="flex items-center gap-1 text-muted-foreground">
        <AppointmentTypeIcon type={appointment.type} />
        <span>{typeInfo.label}: {appointment.location}</span>
      </div>
      
      {appointment.notes && (
        <div className="col-span-2 mt-2 text-muted-foreground">
          <span className="font-medium">{t('notes')}:</span> {appointment.notes}
        </div>
      )}
    </div>
  );
};

export default AppointmentInfo;
