
import React from 'react';
import { cn } from '@/lib/utils';
import { AppointmentCardProps } from './types';
import AppointmentTime from './AppointmentTime';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import AppointmentActions from './AppointmentActions';
import AppointmentInfo from './AppointmentInfo';
import AppointmentStatus from './AppointmentStatus';

const AppointmentCard = ({ appointment, className, showActions = true }: AppointmentCardProps) => {
  return (
    <div className={cn("glass-card p-4 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <AppointmentTime time={appointment.time} duration={appointment.duration} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <AppointmentStatusBadge status={appointment.status} />
              <h3 className="font-medium">{appointment.title}</h3>
            </div>
            
            <AppointmentActions appointment={appointment} showActions={showActions} />
          </div>
          
          <AppointmentInfo appointment={appointment} />
          
          <AppointmentStatus appointment={appointment} />
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
