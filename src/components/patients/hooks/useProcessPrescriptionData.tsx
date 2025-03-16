
import { useCallback } from 'react';
import { extractTextFromCodeableConcept } from '@/utils/fhir/fhirExtractors';

export const useProcessPrescriptionData = () => {
  /**
   * Calculate next dose time based on frequency
   */
  const calculateNextDose = useCallback((frequency: string) => {
    if (!frequency) return null;
    
    // This is a simplified calculation for demo purposes
    if (frequency.includes('daily')) return '2 hours';
    if (frequency.includes('twice')) return '4 hours';
    if (frequency.includes('hours')) {
      const hours = parseInt(frequency.match(/\d+/)?.[0] || '8');
      return `${Math.floor(hours / 2)} hours`;
    }
    
    return 'Today';
  }, []);
  
  /**
   * Extract dosage information from FHIR dosage instruction
   */
  const extractDosage = useCallback((dosageInst: any) => {
    if (!dosageInst || typeof dosageInst !== 'object') return '';
    
    const doseAndRate = Array.isArray(dosageInst.doseAndRate) ? dosageInst.doseAndRate : [];
    const doseQuantity = doseAndRate[0]?.doseQuantity || {};
    
    if (doseQuantity && typeof doseQuantity === 'object') {
      const value = 'value' in doseQuantity ? doseQuantity.value : '';
      const unit = 'unit' in doseQuantity ? doseQuantity.unit : '';
      return `${value || ''} ${unit || ''}`.trim();
    }
    
    return '';
  }, []);
  
  /**
   * Extract frequency information from FHIR timing
   */
  const extractFrequency = useCallback((dosageInst: any) => {
    if (!dosageInst || typeof dosageInst !== 'object') return '';
    
    const timing = dosageInst.timing || {};
    const code = timing.code || {};
    
    return typeof code === 'object' && 'text' in code ? String(code.text || '') : '';
  }, []);
  
  /**
   * Transform FHIR medication request data to standardized format
   */
  const transformFHIRData = useCallback((fhirData: any[]) => {
    return fhirData.map((req: any) => {
      // Safely extract medication name
      const medicationName = extractTextFromCodeableConcept(
        req.medication_codeable_concept, 
        'Unknown Medication'
      );
        
      // Safely get first dosage instruction
      const dosageInstructions = Array.isArray(req.dosage_instruction) ? req.dosage_instruction : [];
      const dosageInst = dosageInstructions[0] || {};
      
      // Extract frequency for next dose calculation
      const frequency = extractFrequency(dosageInst);
      
      return {
        id: req.id,
        name: medicationName,
        dosage: extractDosage(dosageInst),
        frequency: frequency,
        instructions: typeof dosageInst === 'object' && 'text' in dosageInst ? String(dosageInst.text || '') : '',
        status: req.status,
        startDate: req.authored_on,
        endDate: null,
        nextDose: calculateNextDose(frequency),
        priority: req.priority || 'routine',
        // Preserve original FHIR data
        medication_codeable_concept: req.medication_codeable_concept,
        dosage_instruction: req.dosage_instruction,
        authored_on: req.authored_on,
        requesterName: req.requester?.name,
        dataSource: 'fhir'
      };
    });
  }, [calculateNextDose, extractDosage, extractFrequency]);
  
  /**
   * Transform legacy prescription data to standardized format
   */
  const transformLegacyData = useCallback((legacyData: any[]) => {
    return legacyData.flatMap(prescription => 
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
        patientId: prescription.patient_id,
        doctorName: "Unknown Provider", // Will be fetched separately if needed
        dataSource: 'legacy'
      }))
    ) || [];
  }, [calculateNextDose]);
  
  return { 
    transformFHIRData, 
    transformLegacyData,
    calculateNextDose,
    extractDosage,
    extractFrequency
  };
};
