
import { supabase } from "@/integrations/supabase/client";
import { Prescription } from './types';
import { transformPrescription } from './transformUtils';
import { mockPrescriptions } from './mockData';

/**
 * Fetches all prescriptions for a specific patient
 */
export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId);

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return mockPrescriptions.filter(p => p.patientId === patientId);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform each prescription
    const prescriptions = await Promise.all(data.map(transformPrescription));
    return prescriptions;
  } catch (error) {
    console.error('Error processing prescriptions:', error);
    return mockPrescriptions.filter(p => p.patientId === patientId);
  }
};

