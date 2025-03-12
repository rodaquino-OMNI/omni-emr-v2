
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  provider: string;
  location: string;
  status: "scheduled" | "completed" | "cancelled";
};

type AppointmentCardProps = {
  appointment: Appointment;
  className?: string;
};

const AppointmentCard = ({ appointment, className }: AppointmentCardProps) => {
  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Calculate end time
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
  
  // Get status color
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-gray-400';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Link to={`/schedule/${appointment.id}`}>
      <div className={cn("glass-card p-4 hover:shadow-md transition-shadow cursor-pointer", className)}>
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">{formatTime(appointment.time)}</span>
              <div className="h-full w-0.5 bg-gray-200 my-1"></div>
              <span className="text-sm text-muted-foreground">{calculateEndTime(appointment.time, appointment.duration)}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("h-2 w-2 rounded-full", getStatusColor(appointment.status))}></div>
              <h3 className="font-medium">{appointment.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>{appointment.patientName}</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{appointment.duration} minutes</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="font-medium">Provider:</span>
                <span>{appointment.provider}</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{appointment.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AppointmentCard;
