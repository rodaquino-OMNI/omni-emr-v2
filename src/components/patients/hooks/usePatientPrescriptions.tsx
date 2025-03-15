
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromCodeableConcept } from '@/utils/fhir/fhirExtractors';

export const usePatientPrescriptions = (patientId: string) => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataStats, setDataStats] = useState<{
    fhirCount: number,
    legacyCount: number,
    totalCount: number,
    hasDualSources: boolean
  } | null>(null);
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        let fhirData: any[] = [];
        let legacyData: any[] = [];
        
        // First try to fetch from the FHIR medication_requests table
        let { data: medicationRequests, error: fhirError } = await supabase
          .from('medication_requests')
          .select('*, requester:requester_id(name)')
          .eq('subject_id', patientId)
          .order('authored_on', { ascending: false });
        
        if (!fhirError && medicationRequests && medicationRequests.length > 0) {
          fhirData = medicationRequests;
        }
          
        // Also fetch legacy prescription data
        const { data: legacyPrescriptions, error: legacyError } = await supabase
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
          
        if (!legacyError && legacyPrescriptions && legacyPrescriptions.length > 0) {
          legacyData = legacyPrescriptions;
        }
        
        // Calculate statistics about our data sources
        const fhirCount = fhirData.length;
        const legacyCount = legacyData.length;
        const totalCount = fhirCount + legacyCount;
        const hasDualSources = fhirCount > 0 && legacyCount > 0;
        
        setDataStats({
          fhirCount,
          legacyCount,
          totalCount,
          hasDualSources
        });
        
        if (fhirCount > 0) {
          // Transform FHIR data
          const transformedFhirData = fhirData.map((req: any) => {
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
              priority: req.priority || 'routine',
              // Preserve original FHIR data
              medication_codeable_concept: req.medication_codeable_concept,
              dosage_instruction: req.dosage_instruction,
              authored_on: req.authored_on,
              requesterName: req.requester?.name,
              dataSource: 'fhir'
            };
          });
          
          if (legacyCount > 0) {
            // Transform legacy data to match our new format
            const transformedLegacyData = legacyData.flatMap(prescription => 
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
                priority: 'routine', // Default priority for legacy data
                date: prescription.date,
                patientId: patientId,
                doctorName: "Unknown Provider", // Will be fetched separately if needed
                // Add metadata about the data source
                dataSource: 'legacy'
              }))
            ) || [];
            
            // Combine both data sources
            setPrescriptions([...transformedFhirData, ...transformedLegacyData]);
          } else {
            setPrescriptions(transformedFhirData);
          }
        } else if (legacyCount > 0) {
          // Only legacy data is available
          const transformedLegacyData = legacyData.flatMap(prescription => 
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
              priority: 'routine', // Default priority for legacy data
              date: prescription.date,
              patientId: patientId,
              doctorName: "Unknown Provider",
              dataSource: 'legacy'
            }))
          ) || [];
          
          setPrescriptions(transformedLegacyData);
        } else {
          // No data available
          setPrescriptions([]);
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
  
  return { prescriptions, loading, dataStats };
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
