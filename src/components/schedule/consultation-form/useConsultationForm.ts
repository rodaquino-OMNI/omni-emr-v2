
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { createAppointment } from '@/services/appointmentService';
import { consultationFormSchema, ConsultationFormValues, ScheduleConsultationFormProps } from './types';

export const useConsultationForm = ({ 
  onSuccess, 
  preselectedPatientId, 
  preselectedDate 
}: Pick<ScheduleConsultationFormProps, 'onSuccess' | 'preselectedPatientId' | 'preselectedDate'>) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      patientId: preselectedPatientId || '',
      patientName: '',
      title: '',
      notes: '',
      date: preselectedDate || new Date(),
      time: '09:00',
      duration: 30,
      location: '',
      type: 'in-person',
      sendReminder: true,
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: ConsultationFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Format date and create appointment
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      // Create the appointment
      const result = await createAppointment({
        patientId: data.patientId,
        patientName: data.patientName,
        providerId: user.id,
        providerName: user.name,
        title: data.title,
        notes: data.notes || '',
        date: formattedDate,
        time: data.time,
        duration: data.duration,
        location: data.location,
        type: data.type,
        status: 'scheduled',
        reminder_sent: false,
      });
      
      if (result) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
