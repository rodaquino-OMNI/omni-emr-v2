
import { supabase } from '@/integrations/supabase/client';

/**
 * Map RxNorm code to ANVISA code
 */
export const mapRxNormToANVISA = async (
  rxcui: string
): Promise<string | null> => {
  try {
    // Check if mapping exists in our database
    const { data: mapping, error: mappingError } = await supabase
      .from('rxnorm_anvisa_mappings')
      .select('*')
      .eq('rxnorm_code', rxcui)
      .maybeSingle();

    if (mapping && !mappingError) {
      return mapping.anvisa_code;
    }

    // If no mapping found, return null
    return null;
  } catch (error) {
    console.error('Error mapping RxNorm to ANVISA:', error);
    return null;
  }
};

/**
 * Save a mapping between RxNorm and ANVISA codes
 */
export const saveRxNormAnvisaMapping = async (
  rxnormCode: string,
  anvisaCode: string,
  name: string,
  isVerified = false
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('rxnorm_anvisa_mappings').insert({
      rxnorm_code: rxnormCode,
      anvisa_code: anvisaCode,
      medication_name: name,
      mapping_date: new Date().toISOString(),
      is_verified: isVerified
    });
    
    if (error) {
      console.error('Error saving mapping:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving RxNorm-ANVISA mapping:', error);
    return false;
  }
};

/**
 * Get a patient's medication history
 */
export const getPatientMedicationHistory = async (
  patientId: string
): Promise<{
  rxcui: string;
  medicationName: string;
  startDate: string;
  endDate: string | null;
  status: string;
}[]> => {
  try {
    // Use our new stored procedure to get medication history
    const { data, error } = await supabase
      .rpc('get_patient_medication_history', { patient_id_param: patientId });
    
    if (error) {
      console.error('Error getting patient medication history:', error);
      return [];
    }
    
    // Transform the data to match our frontend type expectations
    return data.map((item: any) => ({
      rxcui: item.rxcui || '',
      medicationName: item.medication_name,
      startDate: item.start_date,
      endDate: item.end_date,
      status: item.status
    }));
  } catch (error) {
    console.error('Error getting patient medication history:', error);
    return [];
  }
};
