
import { useState, useEffect } from 'react';

interface PatientInsight {
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

  const fetchInsights = async () => {
    if (!patientId) {
      setInsights([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API request with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock insights data
      const mockInsights: PatientInsight[] = [
        {
          id: '1',
          patientId,
          category: 'vitals',
          title: 'Blood pressure trend indicates potential hypertension',
          description: 'Patient\'s blood pressure has been consistently elevated over the past 3 months.',
          severity: 'warning',
          created_at: new Date().toISOString(),
          source: 'AI Analysis'
        },
        {
          id: '2',
          patientId,
          category: 'medications',
          title: 'Potential medication interaction detected',
          description: 'Current medication regimen has two drugs with known interactions.',
          severity: 'critical',
          created_at: new Date().toISOString(),
          source: 'RxNorm API'
        },
        {
          id: '3',
          patientId,
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
      console.error('Error fetching patient insights:', err);
      setError('Failed to fetch patient insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [patientId, categories ? categories.join(',') : '']);

  const refetchInsights = async () => {
    return fetchInsights();
  };

  return { insights, isLoading, error, refetchInsights };
};
