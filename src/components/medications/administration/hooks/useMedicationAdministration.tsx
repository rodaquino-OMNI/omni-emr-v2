
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AdministrationRecord, PatientData } from '../record/types';

export function useMedicationAdministration(patientId: string) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [administrationRecords, setAdministrationRecords] = useState<AdministrationRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AdministrationRecord | null>(null);
  const [showMissedDialog, setShowMissedDialog] = useState(false);
  const [missedReason, setMissedReason] = useState('');
  const [showIVCalculator, setShowIVCalculator] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedPatientId, setScannedPatientId] = useState('');
  const [scannedMedicationCode, setScannedMedicationCode] = useState('');
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    // Fetch mock patient data
    const mockPatient: PatientData = {
      id: patientId,
      name: "John Doe",
      allergies: ["Penicillin", "Sulfa drugs", "Latex"],
      roomNumber: "101",
      mrn: "MRN001"
    };
    
    // Fetch mock medication data
    const mockMedications: AdministrationRecord[] = [
      {
        id: '1',
        medicationName: 'Acetaminophen',
        dosage: '500mg',
        route: 'PO',
        scheduledTime: '08:00',
        status: 'administered',
        administeredBy: 'Nurse Johnson',
        administeredAt: '08:15',
        notes: 'Patient reported pain level 6/10 before administration',
        medicationType: 'analgesic'
      },
      {
        id: '2',
        medicationName: 'Lisinopril',
        dosage: '10mg',
        route: 'PO',
        scheduledTime: '09:00',
        status: 'scheduled',
        medicationType: 'regular'
      },
      {
        id: '3',
        medicationName: 'Insulin Regular',
        dosage: '5 units',
        route: 'SubQ',
        scheduledTime: '11:30',
        status: 'scheduled',
        medicationType: 'critical'
      },
      {
        id: '4',
        medicationName: 'Furosemide',
        dosage: '20mg',
        route: 'IV',
        scheduledTime: '06:00',
        status: 'held',
        administeredBy: 'Dr. Smith',
        notes: 'Held due to low blood pressure',
        medicationType: 'regular',
        isIV: true,
        ivRate: 20,
        ivDuration: 30
      },
      {
        id: '5',
        medicationName: 'Ceftriaxone',
        dosage: '1g',
        route: 'IV',
        scheduledTime: '10:00',
        status: 'scheduled',
        medicationType: 'antibiotic',
        isIV: true,
        ivRate: 100,
        ivDuration: 60
      },
      {
        id: '6',
        medicationName: 'Morphine',
        dosage: '2mg',
        route: 'IV',
        scheduledTime: '14:00',
        status: 'scheduled',
        medicationType: 'prn',
        isIV: true,
        ivRate: 10,
        ivDuration: 5
      }
    ];
    
    setPatientData(mockPatient);
    setAdministrationRecords(mockMedications);
  }, [patientId]);

  const handleAdminister = (recordId: string) => {
    const record = administrationRecords.find(r => r.id === recordId);
    if (!record) return;
    
    setSelectedRecord(record);
    setShowScanner(true);
  };

  const handleVerify = () => {
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
  
  const resetScannerState = () => {
    setSelectedRecord(null);
    setScannedPatientId('');
    setScannedMedicationCode('');
  };
  
  const completeAdministration = (recordId: string, timeString: string) => {
    setAdministrationRecords(records =>
      records.map(record => {
        if (record.id === recordId) {
          return {
            ...record,
            status: 'administered',
            administeredBy: user?.name || 'Current User',
            administeredAt: timeString
          };
        }
        return record;
      })
    );
    
    toast.success(t('medicationAdministered'));
  };
  
  const handleHold = (recordId: string) => {
    const reason = 'Clinical decision';
    
    setAdministrationRecords(records =>
      records.map(record => {
        if (record.id === recordId) {
          return {
            ...record,
            status: 'held',
            administeredBy: user?.name || 'Current User',
            notes: `Held due to: ${reason}`
          };
        }
        return record;
      })
    );
    
    toast.success(t('medicationHeld'));
  };
  
  const handleMissed = (recordId: string) => {
    const record = administrationRecords.find(r => r.id === recordId);
    if (!record) return;
    
    setSelectedRecord(record);
    setShowMissedDialog(true);
  };
  
  const confirmMissed = () => {
    if (!selectedRecord || !missedReason) return;
    
    setAdministrationRecords(records =>
      records.map(record => {
        if (record.id === selectedRecord.id) {
          return {
            ...record,
            status: 'missed',
            administeredBy: user?.name || 'Current User',
            notes: `Missed dose: ${missedReason}`
          };
        }
        return record;
      })
    );
    
    toast.info(t('medicationMissed'));
    
    setShowMissedDialog(false);
    setSelectedRecord(null);
    setMissedReason('');
  };
  
  const handleIVCalculator = (recordId: string) => {
    const record = administrationRecords.find(r => r.id === recordId);
    if (!record) return;
    
    setSelectedRecord(record);
    setShowIVCalculator(true);
  };
  
  const handleUpdateIVRate = (rate: number, duration: number) => {
    if (!selectedRecord) return;
    
    setAdministrationRecords(records =>
      records.map(record => {
        if (record.id === selectedRecord.id) {
          return {
            ...record,
            ivRate: rate,
            ivDuration: duration
          };
        }
        return record;
      })
    );
    
    toast.success(t('ivRateUpdated'));
    
    setShowIVCalculator(false);
    setSelectedRecord(null);
  };
  
  const handleAddAdministration = () => {
    toast.info(t('featureNotImplemented'));
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
