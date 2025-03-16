
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { useScannerState } from './hooks/useScannerState';
import { useVerificationService } from './hooks/useVerificationService';

export function useMedicationScanner(
  patient: any,
  medication: any,
  onPatientScan: (id: string) => void,
  onMedicationScan: (code: string) => void
) {
  const { t } = useTranslation();
  
  // Use dedicated hooks for state management and verification
  const { 
    activeTab,
    setActiveTab,
    manualPatientId,
    setManualPatientId,
    manualMedicationCode,
    setManualMedicationCode,
    scanning,
    setScanning,
    error,
    setError
  } = useScannerState();
  
  const { 
    verifyPatient,
    verifyMedication,
    simulateScanForDemo
  } = useVerificationService({
    onPatientScan,
    onMedicationScan,
    setScanning,
    patient,
    medication
  });
  
  useEffect(() => {
    if (activeTab === 'camera' && !scanning) {
      setScanning(true);
    }
    
    return () => {
      setScanning(false);
    };
  }, [activeTab, scanning, setScanning]);
  
  const handleManualSubmit = () => {
    // For manual entry, we'll verify against the EHR system
    if (manualPatientId) {
      verifyPatient(manualPatientId);
    }
    
    if (manualMedicationCode) {
      verifyMedication(manualMedicationCode);
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    manualPatientId,
    setManualPatientId,
    manualMedicationCode,
    setManualMedicationCode,
    scanning,
    setScanning,
    error,
    setError,
    handleManualSubmit,
    simulateScan: simulateScanForDemo
  };
}
