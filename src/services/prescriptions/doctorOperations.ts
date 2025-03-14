
import { supabase } from "@/integrations/supabase/client";
import { Prescription } from './types';
import { transformPrescription } from './transformUtils';
import { mockPrescriptions } from './mockData';

/**
 * Fetches all prescriptions created by a specific doctor
 */
export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('doctor_id', doctorId);

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return mockPrescriptions.filter(p => p.doctorId === doctorId);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform each prescription
    const prescriptions = await Promise.all(data.map(transformPrescription));
    return prescriptions;
  } catch (error) {
    console.error('Error processing prescriptions:', error);
    return mockPrescriptions.filter(p => p.doctorId === doctorId);
  }
};

