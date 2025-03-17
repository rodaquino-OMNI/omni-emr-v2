
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

// Renamed to avoid React hooks naming conflict
export const fetchPatientPrescriptions = async (patientId: string) => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    return [];
  }
};

export const usePatientPrescriptions = (patientId: string) => {
  const { language } = useTranslation();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataStats, setDataStats] = useState({
    fhirCount: 0,
    legacyCount: 0,
    totalCount: 0,
    hasDualSources: false
  });
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Use the renamed function
        const data = await fetchPatientPrescriptions(patientId);
        
        setPrescriptions(data);
        
        // Calculate data statistics
        const fhirPrescriptions = data.filter(p => p.fhir_id);
        const legacyPrescriptions = data.filter(p => !p.fhir_id);
        
        setDataStats({
          fhirCount: fhirPrescriptions.length,
          legacyCount: legacyPrescriptions.length,
          totalCount: data.length,
          hasDualSources: fhirPrescriptions.length > 0 && legacyPrescriptions.length > 0
        });
      } catch (error) {
        console.error('Error in usePatientPrescriptions:', error);
        toast.error(
          language === 'pt' 
            ? 'Erro ao buscar prescrições' 
            : 'Error fetching prescriptions'
        );
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescriptions();
  }, [patientId, language]);
  
  return { prescriptions, loading, dataStats };
};
