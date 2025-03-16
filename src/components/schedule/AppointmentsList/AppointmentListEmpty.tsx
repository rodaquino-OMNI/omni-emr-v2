
import React from 'react';
import { format } from 'date-fns';
import { CalendarX } from 'lucide-react';

type AppointmentListEmptyProps = {
  selectedDate?: Date;
  patientId?: string;
};

const AppointmentListEmpty: React.FC<AppointmentListEmptyProps> = ({ 
  selectedDate, 
  patientId 
}) => {
  const getMessage = () => {
    if (selectedDate) {
      return `No appointments scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`;
    }
    
    if (patientId) {
      return 'No appointments scheduled for this patient';
    }
    
    return 'No appointments found';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
      <CalendarX className="h-10 w-10 mb-2 text-muted-foreground/50" />
      <p>{getMessage()}</p>
    </div>
  );
};

export default AppointmentListEmpty;
