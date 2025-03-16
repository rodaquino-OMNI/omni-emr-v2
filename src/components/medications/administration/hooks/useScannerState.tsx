
import { useState } from 'react';

/**
 * Hook to manage medication scanner state
 */
export function useScannerState() {
  const [scannedPatientId, setScannedPatientId] = useState('');
  const [scannedMedicationCode, setScannedMedicationCode] = useState('');
  
  const resetScannerState = () => {
    setScannedPatientId('');
    setScannedMedicationCode('');
  };
  
  const handleVerify = (
    selectedRecord: any | null,
    completeAdministration: (recordId: string, timeString: string) => void,
    setShowScanner: (show: boolean) => void,
    t: (key: string) => string,
    toast: any
  ) => {
    if (!selectedRecord) return;
    
    if (scannedPatientId && scannedMedicationCode) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      completeAdministration(selectedRecord.id, timeString);
      setShowScanner(false);
      resetScannerState();
    } else {
      toast.error(t('verificationFailed'));
    }
  };
  
  return {
    scannedPatientId,
    scannedMedicationCode,
    setScannedPatientId,
    setScannedMedicationCode,
    resetScannerState,
    handleVerify
  };
}
