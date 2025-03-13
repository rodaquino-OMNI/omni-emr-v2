
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { createAppointment } from '@/services/appointmentService';

// Import refactored components
import PatientSection, { mockPatients } from './consultation-form/PatientSection';
import ConsultationDetailsSection from './consultation-form/ConsultationDetailsSection';
import SchedulingSection from './consultation-form/SchedulingSection';
import FormActions from './consultation-form/FormActions';
import { consultationFormSchema, ConsultationFormValues, ScheduleConsultationFormProps } from './consultation-form/types';

const ScheduleConsultationForm: React.FC<ScheduleConsultationFormProps> = ({
  onSuccess,
  onCancel,
  preselectedPatientId,
  preselectedDate
}) => {
  const { t } = useTranslation();
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
  
  // Update patient name when patient ID changes
  useEffect(() => {
    const patientId = form.getValues('patientId');
    if (patientId) {
      const patient = mockPatients.find(p => p.id === patientId);
      if (patient) {
        form.setValue('patientName', patient.name);
      }
    }
  }, [form.watch('patientId')]);
  
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PatientSection form={form} />
        
        <Separator />
        
        <ConsultationDetailsSection form={form} />
        
        <Separator />
        
        <SchedulingSection form={form} />
        
        <FormActions 
          isSubmitting={isSubmitting} 
          onCancel={onCancel} 
        />
      </form>
    </Form>
  );
};

export default ScheduleConsultationForm;

// Helper component for FormDescription
export function FormDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
