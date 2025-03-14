
import { useState, useEffect } from 'react';
import { Prescription, getPrescriptionById } from '@/services/prescriptions';

export const usePrescriptionDetails = (id?: string) => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        if (id) {
          const data = await getPrescriptionById(id);
          if (data) {
            setPrescription(data);
          } else {
            setError('Prescription not found');
          }
        }
      } catch (err) {
        console.error('Error fetching prescription:', err);
        setError('Failed to load prescription');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescription();
  }, [id]);
  
  // Format date helper function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return {
    prescription,
    loading,
    error,
    formatDate
  };
};
