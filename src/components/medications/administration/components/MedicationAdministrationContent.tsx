
import React from 'react';
import { CardContent } from '@/components/ui/card';
import PatientSafetyHeader from '../PatientSafetyHeader';
import TimelineView from '../TimelineView';
import MedicationTable from '../record/MedicationTable';
import ViewOnlyPermissionWarning from './ViewOnlyPermissionWarning';
import { AdministrationRecord, PatientData } from '../record/types';

interface MedicationAdministrationContentProps {
  patientData: PatientData | null;
  administrationRecords: AdministrationRecord[];
  canAdministerMedications: boolean;
  onAdminister: (id: string) => void;
  onHold: (id: string) => void;
  onMissed: (id: string) => void;
  onCalculateIV: (id: string) => void;
}

const MedicationAdministrationContent: React.FC<MedicationAdministrationContentProps> = ({
  patientData,
  administrationRecords,
  canAdministerMedications,
  onAdminister,
  onHold,
  onMissed,
  onCalculateIV
}) => {
  return (
    <CardContent>
      {patientData && (
        <PatientSafetyHeader 
          patient={patientData}
          className="mb-4"
        />
      )}
      
      <div className="mb-6">
        <TimelineView 
          medications={administrationRecords} 
          onAdminister={onAdminister}
          onHold={onHold}
          onMissed={onMissed}
          onCalculateIV={onCalculateIV}
          canAdminister={canAdministerMedications}
        />
      </div>
      
      <MedicationTable
        administrationRecords={administrationRecords}
        patientData={patientData}
        canAdministerMedications={canAdministerMedications}
        onAdminister={onAdminister}
        onHold={onHold}
        onMissed={onMissed}
        onCalculateIV={onCalculateIV}
      />
      
      <ViewOnlyPermissionWarning show={!canAdministerMedications} />
    </CardContent>
  );
};

export default MedicationAdministrationContent;
