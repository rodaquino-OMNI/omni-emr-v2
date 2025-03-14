
import React from 'react';
import { Pill } from 'lucide-react';
import { Medication } from '../MedicationCard';
import { cn } from '@/lib/utils';

interface MedicationHeaderProps {
  medication: Medication;
  getStatusStyle: (status: Medication['status']) => string;
}

const MedicationHeader = ({ medication, getStatusStyle }: MedicationHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-12 w-12 rounded-full bg-medical-red/10 flex items-center justify-center">
        <Pill className="h-6 w-6 text-medical-red" />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold">{medication.name}</h2>
        <div className="text-sm text-muted-foreground">
          {medication.dosage}
        </div>
      </div>
      
      <div className="ml-auto">
        <span className={cn("px-3 py-1 rounded-full capitalize", getStatusStyle(medication.status))}>
          {medication.status}
        </span>
      </div>
    </div>
  );
};

export default MedicationHeader;
