
import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

// Import refactored components
import PatientSection, { mockPatients } from './consultation-form/PatientSection';
import ConsultationDetailsSection from './consultation-form/ConsultationDetailsSection';
import SchedulingSection from './consultation-form/SchedulingSection';
import FormActions from './consultation-form/FormActions';
import { ScheduleConsultationFormProps } from './consultation-form/types';
import { useConsultationForm } from './consultation-form/useConsultationForm';

const ScheduleConsultationForm: React.FC<ScheduleConsultationFormProps> = ({
  onSuccess,
  onCancel,
  preselectedPatientId,
  preselectedDate
}) => {
  const { t } = useTranslation();
  
  // Use our custom hook for form handling
  const { form, isSubmitting, onSubmit } = useConsultationForm({
    onSuccess,
    preselectedPatientId,
    preselectedDate
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

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
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
