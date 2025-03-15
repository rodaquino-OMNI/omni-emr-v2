
import React from 'react';
import { MedicationData } from './types';
import AllergyWarning from './AllergyWarning';

interface MedicationHeaderProps {
  medication: MedicationData | null;
  patient: any;
}

const MedicationHeader: React.FC<MedicationHeaderProps> = ({ medication, patient }) => {
  if (!medication) return null;
  
  return (
    <div className="mb-4 text-center">
      <h3 className="font-medium">{medication.medicationName} {medication.dosage}</h3>
      <p className="text-sm text-muted-foreground">{medication.route}</p>
      
      <AllergyWarning patient={patient} medication={medication} />
    </div>
  );
};

export default MedicationHeader;
