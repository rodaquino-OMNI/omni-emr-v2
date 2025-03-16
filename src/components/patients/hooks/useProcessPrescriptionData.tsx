
import { useMemo, useCallback } from 'react';
import { extractTextFromCodeableConcept } from '@/utils/fhir/fhirExtractors';

export const useProcessPrescriptionData = () => {
  // Memoize transformation functions to avoid recreation on render
  const transformFHIRData = useCallback((fhirData: any[]) => {
    return fhirData.map(item => {
      // Process only the necessary fields to avoid redundant operations
      const medicationName = extractTextFromCodeableConcept(item.medication);
      
      return {
        id: item.id,
        medicationName,
        status: item.status,
        dateWritten: item.authored_on,
        dosage: item.dosage_instruction?.[0]?.text || 'No dosage information',
        source: 'fhir'
      };
    });
  }, []);
  
  const transformLegacyData = useCallback((legacyData: any[]) => {
    return legacyData.flatMap(prescription => {
      // If no prescription items, return early
      if (!prescription.prescription_items || prescription.prescription_items.length === 0) {
        return [];
      }
      
      // Map only the required fields from each item
      return prescription.prescription_items
        .filter(item => item.type === 'medication')
        .map(item => ({
          id: item.id,
          prescriptionId: prescription.id,
          medicationName: item.name,
          status: item.status,
          dateWritten: prescription.created_at,
          dosage: `${item.dosage} ${item.frequency}`,
          source: 'legacy'
        }));
    });
  }, []);

  return {
    transformFHIRData,
    transformLegacyData
  };
};
