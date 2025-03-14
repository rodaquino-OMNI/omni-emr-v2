
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PatientSelectorField from '../fields/PatientSelectorField';
import ProviderField from '../fields/ProviderField';
import DiagnosisField from '../fields/DiagnosisField';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderFormHeaderProps {
  patientId: string;
  diagnoses: string[];
  onPatientSelect: (patientId: string, patientName: string) => void;
  onDiagnosisChange: (diagnoses: string[]) => void;
  readOnly?: boolean;
}

const OrderFormHeader = ({
  patientId,
  diagnoses,
  onPatientSelect,
  onDiagnosisChange,
  readOnly = false
}: OrderFormHeaderProps) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PatientSelectorField 
            patientId={patientId}
            onPatientSelect={onPatientSelect}
            disabled={readOnly}
          />
          <ProviderField editable={false} />
        </div>
        <DiagnosisField 
          diagnoses={diagnoses}
          onDiagnosisChange={onDiagnosisChange}
        />
      </CardContent>
    </Card>
  );
};

export default OrderFormHeader;
