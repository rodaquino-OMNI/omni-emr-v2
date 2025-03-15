
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { verifyPatientWithEHR, verifyMedicationWithEHR } from './EHRVerification';

export function useMedicationScanner(
  patient: any,
  medication: any,
  onPatientScan: (id: string) => void,
  onMedicationScan: (code: string) => void
) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [manualPatientId, setManualPatientId] = useState('');
  const [manualMedicationCode, setManualMedicationCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (activeTab === 'camera' && !scanning) {
      setScanning(true);
    }
    
    return () => {
      setScanning(false);
    };
  }, [activeTab]);
  
  const handleManualSubmit = () => {
    // For manual entry, we'll verify against the EHR system
    if (manualPatientId) {
      verifyPatientWithEHR(manualPatientId, patient)
        .then(verified => {
          if (verified) {
            onPatientScan(manualPatientId);
            toast.success(t('patientVerified'));
          } else {
            toast.error(t('patientVerificationFailed'));
          }
        })
        .catch(() => toast.error(t('ehrConnectionError')));
    }
    
    if (manualMedicationCode) {
      verifyMedicationWithEHR(manualMedicationCode, medication)
        .then(verified => {
          if (verified) {
            onMedicationScan(manualMedicationCode);
            toast.success(t('medicationVerified'));
          } else {
            toast.error(t('medicationVerificationFailed'));
          }
        })
        .catch(() => toast.error(t('ehrConnectionError')));
    }
  };
  
  // Simulate barcode scanning for demo purposes
  const simulateScan = (type?: 'patient' | 'medication') => {
    setScanning(false);
    
    // If a specific type was requested, scan that; otherwise alternate
    const scanType = type || (!patient ? 'patient' : !medication ? 'medication' : 'patient');
    
    toast.success(t('scanning'));
    
    setTimeout(() => {
      if (scanType === 'patient' && patient) {
        onPatientScan(patient.id);
        toast.success(t('patientScanned'));
      } else if (scanType === 'medication' && medication) {
        onMedicationScan(medication.id);
        toast.success(t('medicationScanned'));
      }
      
      setScanning(true);
    }, 1500);
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
    simulateScan
  };
}
