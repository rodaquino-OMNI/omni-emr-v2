
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRound } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from './types';

// Mock data for patients
const mockPatients = [
  { id: 'pat1', name: 'John Smith' },
  { id: 'pat2', name: 'Maria Garcia' },
  { id: 'pat3', name: 'Ahmed Khan' },
  { id: 'pat4', name: 'Sarah Johnson' },
  { id: 'pat5', name: 'Li Wei' },
];

interface PatientSectionProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const PatientSection: React.FC<PatientSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{t('patientInformation')}</h3>
      
      <FormField
        control={form.control}
        name="patientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('patientId')}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export { mockPatients };
export default PatientSection;
