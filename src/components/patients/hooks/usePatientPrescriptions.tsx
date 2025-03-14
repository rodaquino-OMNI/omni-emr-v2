
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromCodeableConcept } from '@/utils/fhir/fhirExtractors';

export const usePatientPrescriptions = (patientId: string) => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        // First try to fetch from the FHIR medication_requests table
        let { data: medicationRequests, error: fhirError } = await supabase
          .from('medication_requests')
          .select('*, requester:requester_id(name)')
          .eq('subject_id', patientId)
          .order('authored_on', { ascending: false });
        
        if (fhirError || !medicationRequests || medicationRequests.length === 0) {
          // Fallback to legacy prescription data
          const { data: legacyData, error: legacyError } = await supabase
            .from('prescriptions')
            .select(`
              id, 
              date, 
              status, 
              notes,
              prescription_items(id, name, dosage, frequency, duration, instructions, start_date, end_date, status)
            `)
            .eq('patient_id', patientId)
            .order('date', { ascending: false });
            
          if (legacyError) throw legacyError;
          
          // Transform legacy data to match our new format
          const transformedData = legacyData?.flatMap(prescription => 
            prescription.prescription_items.map((item: any) => ({
              id: item.id,
              name: item.name,
              dosage: item.dosage,
              frequency: item.frequency,
              instructions: item.instructions,
              status: prescription.status,
              startDate: item.start_date,
              endDate: item.end_date,
              nextDose: calculateNextDose(item.frequency),
              priority: 'routine' // Default priority for legacy data
            }))
          ) || [];
          
          setPrescriptions(transformedData);
        } else {
          // Transform FHIR data
          const transformedFhirData = medicationRequests.map((req: any) => {
            // Safely extract medication name using our utility function
            const medicationName = extractTextFromCodeableConcept(
              req.medication_codeable_concept, 
              'Unknown Medication'
            );
              
            // Safely get first dosage instruction
            const dosageInstructions = Array.isArray(req.dosage_instruction) ? req.dosage_instruction : [];
            const dosageInst = dosageInstructions[0] || {};
            
            return {
              id: req.id,
              name: medicationName,
              dosage: extractDosage(dosageInst),
              frequency: extractFrequency(dosageInst),
              instructions: typeof dosageInst === 'object' && 'text' in dosageInst ? String(dosageInst.text || '') : '',
              status: req.status,
              startDate: req.authored_on,
              endDate: null,
              nextDose: calculateNextDose(extractFrequency(dosageInst)),
              priority: req.priority || 'routine'
            };
          });
          
          setPrescriptions(transformedFhirData);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);
  
  return { prescriptions, loading };
};

// Helper functions
const calculateNextDose = (frequency: string) => {
  if (!frequency) return null;
  
  // This is a simplified calculation for demo purposes
  // In a real app, this would be more sophisticated based on medication schedule
  if (frequency.includes('daily')) return '2 hours';
  if (frequency.includes('twice')) return '4 hours';
  if (frequency.includes('hours')) {
    const hours = parseInt(frequency.match(/\d+/)?.[0] || '8');
    return `${Math.floor(hours / 2)} hours`;
  }
  
  return 'Today';
};

const extractDosage = (dosageInst: any) => {
  if (!dosageInst || typeof dosageInst !== 'object') return '';
  
  const doseAndRate = Array.isArray(dosageInst.doseAndRate) ? dosageInst.doseAndRate : [];
  const doseQuantity = doseAndRate[0]?.doseQuantity || {};
  
  if (doseQuantity && typeof doseQuantity === 'object') {
    const value = 'value' in doseQuantity ? doseQuantity.value : '';
    const unit = 'unit' in doseQuantity ? doseQuantity.unit : '';
    return `${value || ''} ${unit || ''}`.trim();
  }
  
  return '';
};

const extractFrequency = (dosageInst: any) => {
  if (!dosageInst || typeof dosageInst !== 'object') return '';
  
  const timing = dosageInst.timing || {};
  const code = timing.code || {};
  
  return typeof code === 'object' && 'text' in code ? String(code.text || '') : '';
};

export const getPatientPrescriptions = async (patientId: string) => {
  try {
    const { prescriptions } = usePatientPrescriptions(patientId);
    return prescriptions;
  } catch (error) {
    console.error('Error in getPatientPrescriptions:', error);
    return [];
  }
};
