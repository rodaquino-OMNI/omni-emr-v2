
import { useState, useEffect } from 'react';
import { CriticalResult } from '@/components/critical-results/CriticalResultAlert';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useCriticalResults = (userId?: string) => {
  const [results, setResults] = useState<CriticalResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { user } = useAuth();

  // Fetch critical results
  const fetchCriticalResults = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call a Supabase function or query
      // For this demo, we'll use mock data
      const mockResults: CriticalResult[] = [
        {
          id: '1',
          patientId: 'patient1',
          patientName: 'John Doe',
          resultType: 'lab',
          resultName: 'Potassium',
          resultValue: '6.8 mmol/L',
          normalRange: '3.5-5.0 mmol/L',
          timestamp: new Date().toISOString(),
          acknowledged: false,
          severity: 'critical'
        },
        {
          id: '2',
          patientId: 'patient2',
          patientName: 'Jane Smith',
          resultType: 'vital',
          resultName: 'Blood Glucose',
          resultValue: '32 mg/dL',
          normalRange: '70-100 mg/dL',
          timestamp: new Date().toISOString(),
          acknowledged: false,
          severity: 'critical'
        },
        {
          id: '3',
          patientId: 'patient3',
          patientName: 'Robert Johnson',
          resultType: 'imaging',
          resultName: 'Chest X-Ray',
          resultValue: 'Pneumothorax',
          timestamp: new Date().toISOString(),
          acknowledged: true,
          acknowledgedBy: 'Dr. Williams',
          acknowledgedAt: new Date(Date.now() - 3600000).toISOString(),
          severity: 'urgent'
        }
      ];
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResults(mockResults);
    } catch (error) {
      console.error('Error fetching critical results:', error);
      toast.error(t('errorFetchingCriticalResults'));
    } finally {
      setIsLoading(false);
    }
  };

  // Acknowledge a critical result
  const acknowledgeCriticalResult = async (resultId: string) => {
    if (!user) return;
    
    try {
      // In a real implementation, this would call a Supabase function
      // For this demo, we'll update the local state
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setResults(prevResults => 
        prevResults.map(result => 
          result.id === resultId 
            ? {
                ...result, 
                acknowledged: true,
                acknowledgedBy: user.name || user.email,
                acknowledgedAt: new Date().toISOString()
              } 
            : result
        )
      );
      
      toast.success(t('criticalResultAcknowledged'));
    } catch (error) {
      console.error('Error acknowledging critical result:', error);
      toast.error(t('errorAcknowledgingResult'));
      throw error;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCriticalResults();
  }, []);

  return {
    results,
    isLoading,
    acknowledgeCriticalResult,
    refreshResults: fetchCriticalResults,
    unacknowledgedCount: results.filter(r => !r.acknowledged).length
  };
};
