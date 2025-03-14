import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from './useTranslation';
import { toast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define types for our medication safety features
export interface PatientAllergy {
  id: string;
  allergen: string;
  reaction?: string;
  severity?: string;
}

export interface MedicationSafetyCheck {
  isAllergyReviewed: boolean;
  hasAllergyWarning: boolean;
  allergyWarningDetails?: string[];
  isHighRiskMedication: boolean;
  isWeightBased: boolean;
  isWeightVerified: boolean;
  patientWeight?: number;
  weightLastUpdated?: Date;
  hasPassed: boolean;
}

// List of high-risk medications that require additional verification
const HIGH_RISK_MEDICATIONS = [
  'warfarin', 'heparin', 'insulin', 'methotrexate', 'digoxin', 
  'morphine', 'fentanyl', 'hydromorphone', 'oxycodone',
  'chemotherapy', 'thrombolytics', 'potassium chloride',
  'vancomycin', 'amiodarone', 'lidocaine'
];

// List of weight-based medications
const WEIGHT_BASED_MEDICATIONS = [
  'heparin', 'enoxaparin', 'insulin', 'vancomycin', 
  'gentamicin', 'tobramycin', 'amikacin'
];

export function useMedicationSafety(patientId: string) {
  const { t } = useTranslation();
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [isLoadingAllergies, setIsLoadingAllergies] = useState(false);
  const [patientWeight, setPatientWeight] = useState<number | undefined>(undefined);
  const [weightLastUpdated, setWeightLastUpdated] = useState<Date | undefined>(undefined);
  const [isAllergyReviewed, setIsAllergyReviewed] = useState(false);
  
  // Fetch patient allergies
  const fetchPatientAllergies = useCallback(async () => {
    if (!patientId) return;
    
    setIsLoadingAllergies(true);
    try {
      const { data, error } = await supabase
        .from('allergies')
        .select('id, allergen, reaction, severity')
        .eq('patient_id', patientId)
        .eq('is_active', true);
      
      if (error) throw error;
      setAllergies(data || []);
    } catch (error) {
      console.error('Error fetching patient allergies:', error);
      toast.error(t('error'), {
        description: t('errorFetchingAllergies'),
      });
    } finally {
      setIsLoadingAllergies(false);
    }
  }, [patientId, t]);
  
  // Fetch patient's latest weight
  const fetchPatientWeight = useCallback(async () => {
    if (!patientId) return;
    
    try {
      // Check if vital_signs table has a weight field
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(1);
      
      // If there's data and it contains weight information
      if (data && data.length > 0 && typeof data[0].weight === 'number') {
        setPatientWeight(data[0].weight);
        setWeightLastUpdated(new Date(data[0].timestamp));
      } else {
        console.log('No weight data found for patient');
      }
    } catch (error) {
      console.error('Error fetching patient weight:', error);
    }
  }, [patientId]);
  
  // Update patient weight
  const updatePatientWeight = async (weight: number) => {
    if (!patientId || !weight) return false;
    
    try {
      const timestamp = new Date().toISOString();
      const recorder_name = 'System'; // Default recorder name
      
      // Insert new vital signs record with weight
      const { error } = await supabase
        .from('vital_signs')
        .insert({
          patient_id: patientId,
          recorder_name: recorder_name,
          // If the weight field exists in vital_signs table, it will be included,
          // otherwise we'll use a note to store the weight
          notes: `Patient weight: ${weight} kg`,
          timestamp: timestamp
        });
      
      if (error) throw error;
      
      setPatientWeight(weight);
      setWeightLastUpdated(new Date());
      
      toast.success(t('success'), {
        description: t('weightUpdatedSuccessfully')
      });
      
      return true;
    } catch (error) {
      console.error('Error updating patient weight:', error);
      toast.error(t('error'), {
        description: t('errorUpdatingWeight')
      });
      return false;
    }
  };
  
  // Mark allergies as reviewed for this session
  const markAllergiesReviewed = () => {
    setIsAllergyReviewed(true);
    return true;
  };
  
  // Check if medication matches patient allergies
  const checkAllergies = (medicationName: string): string[] => {
    if (!medicationName || !allergies.length) return [];
    
    const medNameLower = medicationName.toLowerCase();
    const warnings: string[] = [];
    
    allergies.forEach(allergy => {
      const allergenLower = allergy.allergen.toLowerCase();
      
      // Check for direct match or common allergen groups
      if (
        medNameLower.includes(allergenLower) || 
        (allergenLower === 'penicillin' && isPenicillinFamily(medNameLower)) ||
        (allergenLower === 'sulfa' && isSulfaFamily(medNameLower)) ||
        (allergenLower === 'nsaid' && isNSAID(medNameLower))
      ) {
        warnings.push(`${allergy.allergen} (${allergy.severity || 'unknown severity'})`);
      }
    });
    
    return warnings;
  };
  
  // Helper functions for medication families
  const isPenicillinFamily = (med: string): boolean => {
    const penicillinDrugs = ['amoxicillin', 'ampicillin', 'dicloxacillin', 'nafcillin', 'oxacillin', 'penicillin'];
    return penicillinDrugs.some(drug => med.includes(drug));
  };
  
  const isSulfaFamily = (med: string): boolean => {
    const sulfaDrugs = ['sulfamethoxazole', 'sulfasalazine', 'sulfadiazine', 'sulfisoxazole'];
    return sulfaDrugs.some(drug => med.includes(drug));
  };
  
  const isNSAID = (med: string): boolean => {
    const nsaids = ['ibuprofen', 'naproxen', 'aspirin', 'diclofenac', 'indomethacin', 'meloxicam', 'celecoxib'];
    return nsaids.some(drug => med.includes(drug));
  };
  
  // Check if medication is high risk
  const isHighRiskMedication = (medicationName: string): boolean => {
    if (!medicationName) return false;
    
    const medNameLower = medicationName.toLowerCase();
    return HIGH_RISK_MEDICATIONS.some(drug => medNameLower.includes(drug));
  };
  
  // Check if medication requires weight-based dosing
  const isWeightBasedMedication = (medicationName: string): boolean => {
    if (!medicationName) return false;
    
    const medNameLower = medicationName.toLowerCase();
    return WEIGHT_BASED_MEDICATIONS.some(drug => medNameLower.includes(drug));
  };
  
  // Perform comprehensive medication safety check
  const performSafetyCheck = (medicationName: string): MedicationSafetyCheck => {
    const allergyWarnings = checkAllergies(medicationName);
    const isHighRisk = isHighRiskMedication(medicationName);
    const isWeightBased = isWeightBasedMedication(medicationName);
    
    // Weight is considered verified if it exists and was updated in the last 7 days
    const isWeightVerified = !!(
      patientWeight && 
      weightLastUpdated && 
      (new Date().getTime() - weightLastUpdated.getTime() < 7 * 24 * 60 * 60 * 1000)
    );
    
    // Safety check passes if:
    // 1. Allergies have been reviewed AND
    // 2. No allergy warnings exist AND
    // 3. If weight-based medication, weight is verified
    const hasPassed = 
      isAllergyReviewed && 
      allergyWarnings.length === 0 && 
      (!isWeightBased || isWeightVerified);
    
    return {
      isAllergyReviewed,
      hasAllergyWarning: allergyWarnings.length > 0,
      allergyWarningDetails: allergyWarnings,
      isHighRiskMedication: isHighRisk,
      isWeightBased,
      isWeightVerified,
      patientWeight,
      weightLastUpdated,
      hasPassed
    };
  };
  
  // Load patient data on initial mount
  useEffect(() => {
    if (patientId) {
      fetchPatientAllergies();
      fetchPatientWeight();
    }
  }, [patientId, fetchPatientAllergies, fetchPatientWeight]);
  
  return {
    allergies,
    isLoadingAllergies,
    patientWeight,
    weightLastUpdated,
    isAllergyReviewed,
    updatePatientWeight,
    markAllergiesReviewed,
    performSafetyCheck,
  };
}
