
import React from 'react';
import { Medication } from '../MedicationCard';
import SpecialInstructions from './SpecialInstructions';

interface MedicationInfoProps {
  medication: Medication;
  formatDate: (dateString: string) => string;
}

const MedicationInfo = ({ medication, formatDate }: MedicationInfoProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Frequency</h3>
          <p>{medication.frequency}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
          <p>{formatDate(medication.startDate)}</p>
        </div>
        
        {medication.endDate && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">End Date</h3>
            <p>{formatDate(medication.endDate)}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Prescribed By</h3>
          <p>{medication.prescribedBy}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Patient ID</h3>
          <p>{medication.patientId}</p>
        </div>
        
        <SpecialInstructions />
      </div>
    </div>
  );
};

export default MedicationInfo;
