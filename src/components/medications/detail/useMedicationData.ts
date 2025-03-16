
import { useState, useEffect } from 'react';
import { Medication } from '../MedicationCard';

export const useMedicationData = (medicationId?: string) => {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!medicationId) {
      setError('No medication ID provided');
      setLoading(false);
      return;
    }
    
    // In a real application, this would be an API call
    const fetchMedicationData = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration
        const medicationData: Medication = {
          id: medicationId,
          patientId: "1",
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          startDate: "2023-10-15",
          endDate: "2023-12-15",
          status: "active",
          prescribedBy: "Dr. Sarah Chen"
        };
        
        // Simulate API call delay
        setTimeout(() => {
          setMedication(medicationData);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        setError('Failed to fetch medication data');
        setLoading(false);
      }
    };
    
    fetchMedicationData();
  }, [medicationId]);
  
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'discontinued':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };
  
  return { medication, loading, error, formatDate, getStatusStyle };
};
