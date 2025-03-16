
import { useState, useEffect } from 'react';
import { PatientData } from '../record/types';

/**
 * Hook to manage patient data for medication administration
 */
export function useAdminPatientData(patientId: string) {
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
    
    setPatientData(mockPatient);
  }, [patientId]);
  
  return { patientData };
}
