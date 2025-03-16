
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { useAdminPatientData } from './useAdminPatientData';
import { useAdminMedicationRecords } from './useAdminMedicationRecords';
import { useAdminActionHandlers } from './useAdminActionHandlers';
import { useScannerState } from './useScannerState';

export function useMedicationAdministration(patientId: string) {
  const { t } = useTranslation();
  
  // Get patient data
  const { patientData } = useAdminPatientData(patientId);
  
  // Get medication records
  const { administrationRecords, setAdministrationRecords } = useAdminMedicationRecords(patientId);
  
  // Get action handlers
  const {
    selectedRecord,
    showMissedDialog,
    missedReason,
    showIVCalculator,
    showScanner,
    setMissedReason,
    setShowMissedDialog,
    setShowIVCalculator,
    setShowScanner,
    setSelectedRecord,
    handleAdminister,
    handleHold,
    handleMissed,
    handleIVCalculator,
    handleUpdateIVRate,
    handleAddAdministration,
    confirmMissed,
    completeAdministration
  } = useAdminActionHandlers(setAdministrationRecords);
  
  // Get scanner state
  const {
    scannedPatientId,
    scannedMedicationCode,
    setScannedPatientId,
    setScannedMedicationCode,
    resetScannerState,
    handleVerify: verifyBase
  } = useScannerState();
  
  // Wrapper for handleVerify with needed dependencies
  const handleVerify = () => {
    verifyBase(
      selectedRecord,
      completeAdministration,
      setShowScanner,
      t,
      toast
    );
  };

  return {
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
  };
}
