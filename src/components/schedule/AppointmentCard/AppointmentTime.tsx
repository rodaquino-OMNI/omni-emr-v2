
import React from 'react';

type AppointmentTimeProps = {
  time: string;
  duration: number;
};

const AppointmentTime = ({ time, duration }: AppointmentTimeProps) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const calculateEndTime = (timeString: string, durationMinutes: number) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    
    const ampm = endHours >= 12 ? 'PM' : 'AM';
    const hour12 = endHours % 12 || 12;
    return `${hour12}:${endMinutes} ${ampm}`;
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium">{formatTime(time)}</span>
      <div className="h-full w-0.5 bg-gray-200 my-1"></div>
      <span className="text-sm text-muted-foreground">{calculateEndTime(time, duration)}</span>
    </div>
  );
};

export default AppointmentTime;
