
import { useState, useEffect } from 'react';
import { Prescription } from '../../components/prescriptions';

export const usePrescriptionDetails = (id?: string) => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) {
      setError('No prescription ID provided');
      setLoading(false);
      return;
    }
    
    // In a real application, this would be an API call
    const fetchPrescriptionDetails = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration
        // In a production app, this would be:
        // const response = await supabase.from('prescriptions').select('*').eq('id', id).single();
        // const data = response.data;
        
        // Simulate API call delay
        setTimeout(() => {
          // Mock prescription data
          const mockPrescriptions = [
            {
              id: '1',
              patientId: '101',
              patientName: 'John Doe',
              doctorId: '201',
              doctorName: 'Dr. Sarah Chen',
              date: '2023-11-15T08:30:00.000Z',
              status: 'active',
              items: [
                {
                  id: '1001',
                  name: 'Lisinopril',
                  dosage: '10mg',
                  frequency: 'Once daily',
                  duration: '30 days',
                  status: 'active'
                },
                {
                  id: '1002',
                  name: 'Metformin',
                  dosage: '500mg',
                  frequency: 'Twice daily',
                  duration: '30 days',
                  status: 'active'
                }
              ]
            },
            {
              id: '2',
              patientId: '102',
              patientName: 'Jane Smith',
              doctorId: '201',
              doctorName: 'Dr. Sarah Chen',
              date: '2023-11-10T10:15:00.000Z',
              status: 'completed',
              items: [
                {
                  id: '1003',
                  name: 'Amoxicillin',
                  dosage: '500mg',
                  frequency: 'Three times daily',
                  duration: '10 days',
                  status: 'completed'
                }
              ]
            },
            {
              id: '3',
              patientId: '103',
              patientName: 'Robert Johnson',
              doctorId: '202',
              doctorName: 'Dr. Michael Rodriguez',
              date: '2023-11-12T14:45:00.000Z',
              status: 'cancelled',
              items: [
                {
                  id: '1004',
                  name: 'Ibuprofen',
                  dosage: '400mg',
                  frequency: 'As needed',
                  duration: '7 days',
                  status: 'cancelled'
                }
              ]
            }
          ];
          
          const foundPrescription = mockPrescriptions.find(p => p.id === id);
          
          if (foundPrescription) {
            setPrescription(foundPrescription);
          } else {
            setError('Prescription not found');
          }
          
          setLoading(false);
        }, 500);
        
      } catch (err) {
        setError('Failed to fetch prescription details');
        setLoading(false);
      }
    };
    
    fetchPrescriptionDetails();
  }, [id]);
  
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return { prescription, loading, error, formatDate };
};
