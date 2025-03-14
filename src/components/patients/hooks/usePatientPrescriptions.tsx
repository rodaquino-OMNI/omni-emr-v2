
import { useState, useEffect } from 'react';
import { getPatientPrescriptions } from '../../../services/prescriptionService';

export const usePatientPrescriptions = (patientId: string) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await getPatientPrescriptions(patientId);
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescriptions();
  }, [patientId]);
  
  return { prescriptions, loading };
};
