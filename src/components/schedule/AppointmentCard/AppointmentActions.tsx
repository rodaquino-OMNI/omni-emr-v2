
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  X, 
  CheckCircle, 
  Send, 
  User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
import { Appointment, cancelAppointment, completeAppointment, sendAppointmentReminder } from '@/services/appointments';

type AppointmentActionsProps = {
  appointment: Appointment;
  showActions: boolean;
};

const AppointmentActions = ({ appointment, showActions }: AppointmentActionsProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
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

  if (!showActions || appointment.status !== 'scheduled') {
    return null;
  }

  return (
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
  );
};

export default AppointmentActions;
