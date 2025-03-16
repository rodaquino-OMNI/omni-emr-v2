
import { useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { verifyPatientWithEHR, verifyMedicationWithEHR } from '../EHRVerification';

interface VerificationServiceProps {
  onPatientScan: (id: string) => void;
  onMedicationScan: (code: string) => void;
  setScanning: (scanning: boolean) => void;
  patient: any;
  medication: any;
}

export function useVerificationService({
  onPatientScan,
  onMedicationScan,
  setScanning,
  patient,
  medication
}: VerificationServiceProps) {
  const { t } = useTranslation();
  
  /**
   * Verify patient ID against EHR
   */
  const verifyPatient = useCallback((patientId: string) => {
    verifyPatientWithEHR(patientId, patient)
      .then(verified => {
        if (verified) {
          onPatientScan(patientId);
          toast({
            title: t('patientVerified'),
            variant: "success"
          });
        } else {
          toast({
            title: t('patientVerificationFailed'),
            variant: "destructive"
          });
        }
      })
      .catch(() => toast({
        title: t('ehrConnectionError'),
        variant: "destructive"
      }));
  }, [patient, onPatientScan, t]);
  
  /**
   * Verify medication code against EHR
   */
  const verifyMedication = useCallback((medicationCode: string) => {
    verifyMedicationWithEHR(medicationCode, medication)
      .then(verified => {
        if (verified) {
          onMedicationScan(medicationCode);
          toast({
            title: t('medicationVerified'),
            variant: "success"
          });
        } else {
          toast({
            title: t('medicationVerificationFailed'),
            variant: "destructive"
          });
        }
      })
      .catch(() => toast({
        title: t('ehrConnectionError'),
        variant: "destructive"
      }));
  }, [medication, onMedicationScan, t]);
  
  /**
   * Simulate barcode scanning for demo purposes
   */
  const simulateScanForDemo = useCallback((type?: 'patient' | 'medication') => {
    setScanning(false);
    
    // If a specific type was requested, scan that; otherwise alternate
    const scanType = type || (!patient ? 'patient' : !medication ? 'medication' : 'patient');
    
    toast({
      title: t('scanning'),
      variant: "default"
    });
    
    setTimeout(() => {
      if (scanType === 'patient' && patient) {
        onPatientScan(patient.id);
        toast({
          title: t('patientScanned'),
          variant: "success"
        });
      } else if (scanType === 'medication' && medication) {
        onMedicationScan(medication.id);
        toast({
          title: t('medicationScanned'),
          variant: "success"
        });
      }
      
      setScanning(true);
    }, 1500);
  }, [patient, medication, onPatientScan, onMedicationScan, setScanning, t]);
  
  return {
    verifyPatient,
    verifyMedication,
    simulateScanForDemo
  };
}
