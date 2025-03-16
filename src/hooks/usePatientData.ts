
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patientTypes';
import { mapToPatientStatus, calculatePatientAge } from '@/utils/patientUtils';

// Mock data for fallback
const mockPatients = [
  {
    id: 'patient-1',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1980-01-01',
    gender: 'Male',
    mrn: '123456',
    status: 'hospital',
    is_assigned: true,
    room_number: '101',
    age: 43,
    diagnosis: 'Hypertension',
    name: 'John Doe'
  },
  {
    id: 'patient-2',
    first_name: 'Jane',
    last_name: 'Smith',
    date_of_birth: '1990-05-15',
    gender: 'Female',
    mrn: '789012',
    status: 'home',
    is_assigned: true,
    room_number: '202',
    age: 33,
    diagnosis: 'Diabetes',
    name: 'Jane Smith'
  },
  {
    id: 'patient-3',
    first_name: 'Robert',
    last_name: 'Jones',
    date_of_birth: '1975-11-20',
    gender: 'Male',
    mrn: '345678',
    status: 'discharged',
    is_assigned: false,
    room_number: null,
    age: 47,
    diagnosis: 'Asthma',
    name: 'Robert Jones'
  }
];

export const usePatientData = (patientId: string) => {
  // Fetch patient data
  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) return null;
      
      // First check if the table exists and we can connect
      const { data: connected, error: connError } = await supabase.rpc('check_connection');
      
      if (connError || !connected) {
        console.error('Database connection error:', connError);
        // Return mock data as fallback
        const mockPatient = mockPatients.find(p => p.id === patientId);
        return mockPatient || null;
      }
      
      // Try to get from the new patient_status_view first
      const { data: viewData, error: viewError } = await supabase
        .from('patient_status_view')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (!viewError && viewData) {
        // Convert to Patient type with proper status mapping
        return {
          id: viewData.id,
          first_name: viewData.first_name,
          last_name: viewData.last_name,
          name: `${viewData.first_name} ${viewData.last_name}`,
          date_of_birth: viewData.date_of_birth,
          gender: viewData.gender,
          mrn: viewData.mrn,
          room_number: viewData.room_number,
          // Explicitly map the status string to PatientStatus enum type
          status: mapToPatientStatus(viewData.mapped_status || 'stable'),
          is_assigned: true, // Default value
          // Calculate age from date of birth
          age: calculatePatientAge(viewData.date_of_birth),
          diagnosis: "Primary diagnosis information would be fetched separately"
        };
      }
      
      // Fallback to patients table if view doesn't exist
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (error) {
        console.error('Error fetching patient:', error);
        // Return mock data as fallback
        const mockPatient = mockPatients.find(p => p.id === patientId);
        return mockPatient || null;
      }
      
      // Convert to Patient type
      return {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        name: `${data.first_name} ${data.last_name}`,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        mrn: data.mrn,
        room_number: data.room_number,
        // Map the status string to PatientStatus enum type
        status: mapToPatientStatus(data.status || 'stable'),
        is_assigned: true, // Default for the detail view
        // Calculate age from date of birth
        age: calculatePatientAge(data.date_of_birth),
        diagnosis: "Primary diagnosis information would be fetched separately"
      };
    },
    enabled: !!patientId
  });

  return {
    patient,
    isLoading: patientLoading
  };
};
