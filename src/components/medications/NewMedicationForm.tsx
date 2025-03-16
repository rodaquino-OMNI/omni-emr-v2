import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MedicationAutocomplete } from './MedicationAutocomplete';
import PatientField from './form/PatientField';
import MedicationTextField from './form/MedicationTextField';
import MedicationTextareaField from './form/MedicationTextareaField';
import MedicationDateFields from './form/MedicationDateFields';
import MedicationStatusField from './form/MedicationStatusField';
import MedicationFormButtons from './form/MedicationFormButtons';
import { useMedicationForm } from './hooks/useMedicationForm';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

const medicationSchema = z.object({
  rxcui: z.string().min(1, { message: "Medication is required" }),
  patientId: z.string().min(1, { message: "Patient is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  route: z.string().min(1, { message: "Route is required" }),
  startDate: z.date(),
  endDate: z.date().optional(),
  instructions: z.string().optional(),
  status: z.string().default("active"),
  prescribedBy: z.string().optional(),
  notes: z.string().optional(),
});

type MedicationFormValues = z.infer<typeof medicationSchema>;

interface NewMedicationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  patientId?: string;
}

const NewMedicationForm = ({ onSuccess, onCancel, patientId }: NewMedicationFormProps) => {
  const { t, language } = useTranslation();
  const { 
    saveMedication, 
    isSubmitting, 
    checkInteractions,
    initialValues,
    interactionsLoading
  } = useMedicationForm({ patientId, onSuccess });
  const [selectedMedication, setSelectedMedication] = useState<{ name: string; rxcui: string } | null>(null);

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: MedicationFormValues) => {
    try {
      await saveMedication(data, selectedMedication?.name || '');
      form.reset();
      setSelectedMedication(null);
      toast.success(t('medicationAdded'));
    } catch (error) {
      toast.error(t('medicationAddError'));
      console.error('Error adding medication:', error);
    }
  };

  const handleMedicationSelect = (medication: { name: string; rxcui: string }) => {
    setSelectedMedication(medication);
    form.setValue('rxcui', medication.rxcui);
    
    // Check for potential interactions - fixed to use correct parameter count
    const patientId = form.getValues('patientId');
    if (patientId && medication.rxcui) {
      checkInteractions(patientId);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    form.setValue('patientId', patientId);
    
    // Check interactions if medication is already selected
    const rxcui = form.getValues('rxcui');
    if (patientId && rxcui) {
      checkInteractions(patientId, rxcui);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('newMedication')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PatientField 
              onPatientSelect={handlePatientSelect}
              value={form.getValues('patientId')}
              onChange={(e) => form.setValue('patientId', e.target.value)}
            />
            
            <FormField
              control={form.control}
              name="rxcui"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('medication')}</FormLabel>
                  <FormControl>
                    <MedicationAutocomplete 
                      onSelectMedication={handleMedicationSelect}
                      initialSearchTerm={selectedMedication?.name || ''}
                      patientId={form.getValues('patientId')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MedicationTextField 
                name="dosage"
                label={t('dosage')}
                control={form.control}
                placeholder="e.g. 10mg"
              />
              
              <MedicationTextField 
                name="frequency"
                label={t('frequency')}
                control={form.control}
                placeholder="e.g. Every 8 hours"
              />
              
              <FormField
                control={form.control}
                name="route"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('route')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectRoute')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="intravenous">Intravenous</SelectItem>
                        <SelectItem value="intramuscular">Intramuscular</SelectItem>
                        <SelectItem value="subcutaneous">Subcutaneous</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                        <SelectItem value="inhaled">Inhaled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <MedicationDateFields control={form.control} />
            
            <MedicationTextareaField 
              name="instructions"
              label={t('instructions')}
              control={form.control}
              placeholder={t('instructionsPlaceholder')}
            />
            
            <MedicationStatusField control={form.control} />
            
            <MedicationTextareaField 
              name="notes"
              label={t('notes')}
              control={form.control}
              placeholder={t('notesPlaceholder')}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <MedicationFormButtons 
              isSubmitting={isSubmitting}
              interactionsLoading={interactionsLoading}
              onCancel={handleCancel}
            />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default NewMedicationForm;
