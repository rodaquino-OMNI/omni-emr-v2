import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromCodeableConcept } from '@/utils/fhir/fhirExtractors';
import { useFetchPrescriptionData } from './useFetchPrescriptionData';
import { useProcessPrescriptionData } from './useProcessPrescriptionData';

export const usePatientPrescriptions = (patientId: string) => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataStats, setDataStats] = useState<{
    fhirCount: number,
    legacyCount: number,
    totalCount: number,
    hasDualSources: boolean
  } | null>(null);
  
  const { fetchFHIRData, fetchLegacyData } = useFetchPrescriptionData();
  const { transformFHIRData, transformLegacyData } = useProcessPrescriptionData();
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!patientId) return;
      
      setLoading(true);
      try {
        const fhirData = await fetchFHIRData(patientId);
        const legacyData = await fetchLegacyData(patientId);
        
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
        
        let combinedData: any[] = [];
        
        if (fhirCount > 0) {
          const transformedFhirData = transformFHIRData(fhirData);
          
          if (legacyCount > 0) {
            const transformedLegacyData = transformLegacyData(legacyData);
            combinedData = [...transformedFhirData, ...transformedLegacyData];
          } else {
            combinedData = transformedFhirData;
          }
        } else if (legacyCount > 0) {
          combinedData = transformLegacyData(legacyData);
        }
        
        setPrescriptions(combinedData);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescriptions();
  }, [patientId, fetchFHIRData, fetchLegacyData, transformFHIRData, transformLegacyData]);
  
  return { prescriptions, loading, dataStats };
};

export const fetchPatientPrescriptions = async (patientId: string) => {
  try {
    const { prescriptions } = usePatientPrescriptions(patientId);
    return prescriptions;
  } catch (error) {
    console.error('Error in fetchPatientPrescriptions:', error);
    return [];
  }
};
