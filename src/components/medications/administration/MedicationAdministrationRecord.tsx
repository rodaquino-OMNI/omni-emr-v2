
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { useMedicationAdministration } from './hooks/useMedicationAdministration';
import MedicationAdministrationHeader from './components/MedicationAdministrationHeader';
import MedicationAdministrationContent from './components/MedicationAdministrationContent';
import MedicationAdministrationDialogs from './components/MedicationAdministrationDialogs';
import { MedicationAdministrationRecordProps } from './record/types';

const MedicationAdministrationRecord = ({ patientId }: MedicationAdministrationRecordProps) => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const canAdministerMedications = permissions.checkMedicationPermission('administer');
  
  const {
    administrationRecords,
    selectedRecord,
    showMissedDialog,
    missedReason,
    showIVCalculator,
    showScanner,
    scannedPatientId,
    scannedMedicationCode,
    patientData,
    setMissedReason,
    setShowMissedDialog,
    setShowIVCalculator,
    setShowScanner,
    handleAdminister,
    handleHold,
    handleMissed,
    handleVerify,
    handleIVCalculator,
    handleUpdateIVRate,
    handleAddAdministration,
    confirmMissed,
    setScannedPatientId,
    setScannedMedicationCode
  } = useMedicationAdministration(patientId);
  
  return (
    <>
      <Card>
        <MedicationAdministrationHeader 
          canAdministerMedications={canAdministerMedications}
          onAddAdministration={handleAddAdministration}
        />
        
        <MedicationAdministrationContent
          patientData={patientData}
          administrationRecords={administrationRecords}
          canAdministerMedications={canAdministerMedications}
          onAdminister={handleAdminister}
          onHold={handleHold}
          onMissed={handleMissed}
          onCalculateIV={handleIVCalculator}
        />
      </Card>
      
      <MedicationAdministrationDialogs
        showMissedDialog={showMissedDialog}
        setShowMissedDialog={setShowMissedDialog}
        selectedRecord={selectedRecord}
        missedReason={missedReason}
        setMissedReason={setMissedReason}
        onConfirmMissed={confirmMissed}
        showScanner={showScanner}
        setShowScanner={setShowScanner}
        patientData={patientData}
        scannedPatientId={scannedPatientId}
        scannedMedicationCode={scannedMedicationCode}
        setScannedPatientId={setScannedPatientId}
        setScannedMedicationCode={setScannedMedicationCode}
        onVerify={handleVerify}
        showIVCalculator={showIVCalculator}
        setShowIVCalculator={setShowIVCalculator}
        onUpdateIVRate={handleUpdateIVRate}
      />
    </>
  );
};

export default MedicationAdministrationRecord;
