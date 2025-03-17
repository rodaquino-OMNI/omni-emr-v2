
import { useState, useEffect } from 'react';

interface PrescriptionItem {
  id: string;
  prescription_id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  status: string;
}

interface Prescription {
  id: string;
  patient_id: string;
  provider_id: string;
  status: string;
  created_at: string;
  notes?: string;
  items?: PrescriptionItem[];
}

export const usePatientPrescriptions = (patientId?: string) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataStats, setDataStats] = useState({
    fhirCount: 0,
    legacyCount: 0,
    totalCount: 0,
    hasDualSources: false
  });
  
  const fetchPrescriptions = async () => {
    if (!patientId) {
      setPrescriptions([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock prescription data
      const mockPrescriptions: Prescription[] = [
        {
          id: '1',
          patient_id: patientId,
          provider_id: 'provider-1',
          status: 'active',
          created_at: new Date().toISOString(),
          notes: 'Take with food',
          items: [
            {
              id: 'item-1',
              prescription_id: '1',
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              instructions: 'Take in the morning',
              status: 'active'
            }
          ]
        },
        {
          id: '2',
          patient_id: patientId,
          provider_id: 'provider-2',
          status: 'completed',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              id: 'item-2',
              prescription_id: '2',
              name: 'Amoxicillin',
              dosage: '500mg',
              frequency: 'Three times daily',
              duration: '7 days',
              instructions: 'Take until completed',
              status: 'completed'
            }
          ]
        }
      ];
      
      setPrescriptions(mockPrescriptions);
      setDataStats({
        fhirCount: 1,
        legacyCount: 1,
        totalCount: 2,
        hasDualSources: true
      });
    } catch (error) {
      console.error('Error fetching patient prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);
  
  const refetchPrescriptions = async () => {
    return fetchPrescriptions();
  };
  
  return { prescriptions, loading, dataStats, refetchPrescriptions };
};
