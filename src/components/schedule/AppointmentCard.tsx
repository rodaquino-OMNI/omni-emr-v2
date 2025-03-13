
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Appointment, cancelAppointment, completeAppointment, sendAppointmentReminder } from '@/services/appointmentService';

import { Clock, MapPin, User, Calendar, Bell, CheckCircle, X, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type AppointmentCardProps = {
  appointment: Appointment;
  className?: string;
  showActions?: boolean;
};

const AppointmentCard = ({ appointment, className, showActions = true }: AppointmentCardProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
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
      case 'no-show':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Get appointment type icon and label
  const getAppointmentTypeInfo = (type: Appointment['type']) => {
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
          icon: <Clock className="h-3.5 w-3.5" />, 
          label: t('phone') 
        };
      default:
        return { 
          icon: <MapPin className="h-3.5 w-3.5" />, 
          label: t('inPerson') 
        };
    }
  };
  
  // Handle send reminder
  const handleSendReminder = async () => {
    setIsLoading(true);
    try {
      const result = await sendAppointmentReminder(appointment.id);
      if (result) {
        toast({
          title: t('reminderSent'),
          description: t('reminderSentDescription'),
        });
      } else {
        throw new Error('Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: t('errorSendingReminder'),
        description: t('errorSendingReminderDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle complete appointment
  const handleCompleteAppointment = async () => {
    setIsLoading(true);
    try {
      const result = await completeAppointment(appointment.id);
      if (result) {
        toast({
          title: t('appointmentCompleted'),
          description: t('appointmentCompletedDescription'),
        });
      } else {
        throw new Error('Failed to complete appointment');
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast({
        title: t('errorCompletingAppointment'),
        description: t('errorCompletingAppointmentDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cancel appointment
  const handleCancelAppointment = async () => {
    setIsLoading(true);
    try {
      const result = await cancelAppointment(appointment.id);
      if (result) {
        toast({
          title: t('appointmentCancelled'),
          description: t('appointmentCancelledDescription'),
        });
      } else {
        throw new Error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: t('errorCancellingAppointment'),
        description: t('errorCancellingAppointmentDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const typeInfo = getAppointmentTypeInfo(appointment.type);

  return (
    <div className={cn("glass-card p-4 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">{formatTime(appointment.time)}</span>
            <div className="h-full w-0.5 bg-gray-200 my-1"></div>
            <span className="text-sm text-muted-foreground">{calculateEndTime(appointment.time, appointment.duration)}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", getStatusColor(appointment.status))}></div>
              <h3 className="font-medium">{appointment.title}</h3>
            </div>
            
            {showActions && appointment.status === 'scheduled' && (
              <div className="flex items-center gap-1">
                {!appointment.reminder_sent && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={isLoading}
                    onClick={handleSendReminder}
                    className="h-8 w-8 p-0"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">{t('sendReminder')}</span>
                  </Button>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">{t('cancel')}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('cancelAppointment')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('cancelAppointmentDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('goBack')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleCancelAppointment}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {t('confirmCancel')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">{t('options')}</span>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onSelect={handleSendReminder}
                      className="cursor-pointer"
                      disabled={appointment.reminder_sent || isLoading}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {appointment.reminder_sent ? t('reminderAlreadySent') : t('sendReminder')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={handleCompleteAppointment}
                      className="cursor-pointer"
                      disabled={isLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('markAsCompleted')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={`/patients/${appointment.patientId}`} className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        {t('viewPatientProfile')}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
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
              {typeInfo.icon}
              <span>{typeInfo.label}: {appointment.location}</span>
            </div>
            
            {appointment.notes && (
              <div className="col-span-2 mt-2 text-muted-foreground">
                <span className="font-medium">{t('notes')}:</span> {appointment.notes}
              </div>
            )}
          </div>
          
          {appointment.status === 'completed' && (
            <div className="mt-2 bg-green-50 text-green-700 text-sm p-2 rounded-md flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              <span>{t('appointmentCompleted')}</span>
            </div>
          )}
          
          {appointment.status === 'cancelled' && (
            <div className="mt-2 bg-gray-50 text-gray-700 text-sm p-2 rounded-md flex items-center gap-1.5">
              <X className="h-4 w-4" />
              <span>{t('appointmentCancelled')}</span>
            </div>
          )}
          
          {appointment.reminder_sent && appointment.status === 'scheduled' && (
            <div className="mt-2 bg-blue-50 text-blue-700 text-sm p-2 rounded-md flex items-center gap-1.5">
              <Bell className="h-4 w-4" />
              <span>{t('reminderSent')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
