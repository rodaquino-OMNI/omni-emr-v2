
import React from 'react';
import { MapPin, Calendar, Phone } from 'lucide-react';
import { Appointment } from '@/services/appointments';
import { useTranslation } from '@/hooks/useTranslation';
import { AppointmentTypeInfo } from './types';

export const getAppointmentTypeInfo = (type: Appointment['type'], t: (key: any) => string): AppointmentTypeInfo => {
  switch (type) {
    case 'in-person':
      return { 
        icon: <MapPin className="h-3.5 w-3.5" />, 
        label: t('inPerson') 
      };
    case 'telemedicine':
      return { 
        icon: <Calendar className="h-3.5 w-3.5" />, 
        label: t('telemedicine') 
      };
    case 'phone':
      return { 
        icon: <Phone className="h-3.5 w-3.5" />, 
        label: t('phone') 
      };
    default:
      return { 
        icon: <MapPin className="h-3.5 w-3.5" />, 
        label: t('inPerson') 
      };
  }
};

type AppointmentTypeIconProps = {
  type: Appointment['type'];
};

const AppointmentTypeIcon = ({ type }: AppointmentTypeIconProps) => {
  const { t } = useTranslation();
  const typeInfo = getAppointmentTypeInfo(type, t);
  
  return (
    <>
      {typeInfo.icon}
    </>
  );
};

export default AppointmentTypeIcon;
