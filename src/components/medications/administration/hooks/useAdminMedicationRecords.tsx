
import { useState, useEffect } from 'react';
import { AdministrationRecord } from '../record/types';

/**
 * Hook to manage medication administration records
 */
export function useAdminMedicationRecords(patientId: string) {
  const [administrationRecords, setAdministrationRecords] = useState<AdministrationRecord[]>([]);
  
  useEffect(() => {
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
    
    setAdministrationRecords(mockMedications);
  }, [patientId]);
  
  return { 
    administrationRecords, 
    setAdministrationRecords
  };
}
