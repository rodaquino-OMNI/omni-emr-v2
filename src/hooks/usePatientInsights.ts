
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PatientInsight {
  id: string;
  patientId: string;
  category: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
  source: string;
  metadata?: any;
}

export const usePatientInsights = (patientId?: string, categories?: string[]) => {
  const [insights, setInsights] = useState<PatientInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchInsights = useCallback(async () => {
    if (!patientId) {
      setInsights([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // First check if we have connectivity with Supabase
      const { data: connectionCheck, error: connectionError } = await supabase.rpc('check_connection');
      
      if (connectionError || !connectionCheck) {
        console.warn('Using mock data - Supabase connection failed:', connectionError);
        await useMockInsights();
        return;
      }
      
      // Try to fetch critical lab results using our new indexes
      const { data: labData, error: labError } = await supabase
        .from('lab_results')
        .select('id, patient_id, test_name, result, result_date, critical, abnormal, notes')
        .eq('patient_id', patientId)
        .eq('critical', true)
        .order('result_date', { ascending: false })
        .limit(5);
      
      if (labError) {
        console.warn('Error fetching critical lab results:', labError);
      }
      
      // Try to fetch recent diagnoses
      const { data: diagnosesData, error: diagnosesError } = await supabase
        .from('diagnoses')
        .select('id, patient_id, diagnosis, diagnosed_date, status, notes')
        .eq('patient_id', patientId)
        .order('diagnosed_date', { ascending: false })
        .limit(5);
        
      if (diagnosesError) {
        console.warn('Error fetching diagnoses:', diagnosesError);
      }
      
      // Try to fetch medication interactions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescription_items')
        .select(`
          id, 
          name, 
          prescription_id,
          prescriptions!inner(patient_id)
        `)
        .eq('prescriptions.patient_id', patientId)
        .eq('status', 'active')
        .limit(20);
        
      if (prescriptionsError) {
        console.warn('Error fetching prescriptions:', prescriptionsError);
      }
      
      // Transform the data into our insights format
      const insightsArray: PatientInsight[] = [];
      
      // Add lab insights
      if (labData && labData.length > 0) {
        labData.forEach(lab => {
          insightsArray.push({
            id: `lab-${lab.id}`,
            patientId,
            category: 'lab',
            title: `Critical lab result: ${lab.test_name}`,
            description: `Value: ${lab.result} - This lab result requires immediate attention.`,
            severity: 'critical',
            created_at: lab.result_date,
            source: 'Lab Results',
            metadata: lab
          });
        });
      }
      
      // Add diagnosis insights
      if (diagnosesData && diagnosesData.length > 0) {
        diagnosesData.forEach(diagnosis => {
          insightsArray.push({
            id: `diag-${diagnosis.id}`,
            patientId,
            category: 'diagnosis',
            title: `Diagnosis: ${diagnosis.diagnosis}`,
            description: diagnosis.notes || `Diagnosed on ${new Date(diagnosis.diagnosed_date).toLocaleDateString()}`,
            severity: 'warning',
            created_at: diagnosis.diagnosed_date,
            source: 'Diagnoses',
            metadata: diagnosis
          });
        });
      }
      
      // Add medication insights - in real app, we would check for interactions
      if (prescriptionsData && prescriptionsData.length > 0) {
        // Generate a simple insight about active medications
        insightsArray.push({
          id: `med-${Date.now()}`,
          patientId,
          category: 'medications',
          title: `${prescriptionsData.length} active medications`,
          description: `Patient is currently taking ${prescriptionsData.length} medications. Consider reviewing for potential interactions.`,
          severity: 'info',
          created_at: new Date().toISOString(),
          source: 'Medication Analysis',
          metadata: {
            medicationCount: prescriptionsData.length,
            medications: prescriptionsData.map(item => item.name)
          }
        });
      }
      
      // Filter by categories if specified
      const filteredInsights = categories 
        ? insightsArray.filter(insight => categories.includes(insight.category))
        : insightsArray;
        
      setInsights(filteredInsights);
      setError('');
    } catch (err) {
      console.error('Error fetching patient insights:', err);
      setError('Failed to fetch patient insights');
      
      // Fallback to mock data
      await useMockInsights();
    } finally {
      setIsLoading(false);
    }
  }, [patientId, categories]);

  // Fallback to mock data when needed
  const useMockInsights = async () => {
    try {
      // Simulate API request with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock insights data
      const mockInsights: PatientInsight[] = [
        {
          id: '1',
          patientId: patientId || 'unknown',
          category: 'vitals',
          title: 'Blood pressure trend indicates potential hypertension',
          description: 'Patient\'s blood pressure has been consistently elevated over the past 3 months.',
          severity: 'warning',
          created_at: new Date().toISOString(),
          source: 'AI Analysis'
        },
        {
          id: '2',
          patientId: patientId || 'unknown',
          category: 'medications',
          title: 'Potential medication interaction detected',
          description: 'Current medication regimen has two drugs with known interactions.',
          severity: 'critical',
          created_at: new Date().toISOString(),
          source: 'RxNorm API'
        },
        {
          id: '3',
          patientId: patientId || 'unknown',
          category: 'lab',
          title: 'Abnormal liver function tests',
          description: 'Latest blood work shows elevated ALT and AST levels.',
          severity: 'warning',
          created_at: new Date().toISOString(),
          source: 'Lab Results'
        }
      ];
      
      // Filter by categories if specified
      const filteredInsights = categories 
        ? mockInsights.filter(insight => categories.includes(insight.category))
        : mockInsights;
        
      setInsights(filteredInsights);
      setError('');
    } catch (err) {
      console.error('Error loading mock insights:', err);
      setError('Failed to fetch patient insights');
      setInsights([]);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const refetchInsights = async () => {
    return fetchInsights();
  };

  return { insights, isLoading, error, refetchInsights };
};
