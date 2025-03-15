
import React from 'react';
import MissedMedicationDialog from '../record/MissedMedicationDialog';
import MedicationScanner from '../MedicationScanner';
import IVCalculator from '../IVCalculator';
import { PatientData, AdministrationRecord } from '../record/types';

interface MedicationAdministrationDialogsProps {
  showMissedDialog: boolean;
  setShowMissedDialog: (show: boolean) => void;
  selectedRecord: AdministrationRecord | null;
  missedReason: string;
  setMissedReason: (reason: string) => void;
  onConfirmMissed: () => void;
  showScanner: boolean;
  setShowScanner: (show: boolean) => void;
  patientData: PatientData | null;
  scannedPatientId: string;
  scannedMedicationCode: string;
  setScannedPatientId: (id: string) => void;
  setScannedMedicationCode: (code: string) => void;
  onVerify: () => void;
  showIVCalculator: boolean;
  setShowIVCalculator: (show: boolean) => void;
  onUpdateIVRate: (rate: number, duration: number) => void;
}

const MedicationAdministrationDialogs: React.FC<MedicationAdministrationDialogsProps> = ({
  showMissedDialog,
  setShowMissedDialog,
  selectedRecord,
  missedReason,
  setMissedReason,
  onConfirmMissed,
  showScanner,
  setShowScanner,
  patientData,
  scannedPatientId,
  scannedMedicationCode,
  setScannedPatientId,
  setScannedMedicationCode,
  onVerify,
  showIVCalculator,
  setShowIVCalculator,
  onUpdateIVRate
}) => {
  return (
    <>
      <MissedMedicationDialog
        open={showMissedDialog}
        onOpenChange={setShowMissedDialog}
        medicationName={selectedRecord?.medicationName}
        dosage={selectedRecord?.dosage}
        missedReason={missedReason}
        onMissedReasonChange={setMissedReason}
        onConfirm={onConfirmMissed}
      />
      
      <MedicationScanner 
        open={showScanner}
        onClose={() => setShowScanner(false)}
        patient={patientData}
        medication={selectedRecord}
        onPatientScan={setScannedPatientId}
        onMedicationScan={setScannedMedicationCode}
        onVerify={onVerify}
        patientScanned={!!scannedPatientId}
        medicationScanned={!!scannedMedicationCode}
      />
      
      <IVCalculator 
        open={showIVCalculator}
        onClose={() => setShowIVCalculator(false)}
        medication={selectedRecord}
        initialRate={selectedRecord?.ivRate}
        initialDuration={selectedRecord?.ivDuration}
        onSave={onUpdateIVRate}
      />
    </>
  );
};

export default MedicationAdministrationDialogs;
