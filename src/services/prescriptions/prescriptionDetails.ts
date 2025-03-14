
import { supabase } from "@/integrations/supabase/client";
import { Prescription } from './types';
import { transformPrescription } from './transformUtils';
import { mockPrescriptions } from './mockData';

/**
 * Fetches a single prescription by its ID
 */
export const getPrescriptionById = async (id: string): Promise<Prescription | null> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching prescription:', error);
      return mockPrescriptions.find(p => p.id === id) || null;
    }

    return await transformPrescription(data);
  } catch (error) {
    console.error('Error processing prescription:', error);
    return mockPrescriptions.find(p => p.id === id) || null;
  }
};

