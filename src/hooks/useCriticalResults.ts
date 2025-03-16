
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { CriticalResult } from '@/components/critical-results/CriticalResultAlert';
import { toast } from 'sonner';
import { useTranslation } from './useTranslation';

// Mock critical results data for demonstration
const mockCriticalResults: CriticalResult[] = [
  {
    id: '1',
    patientId: '101',
    patientName: 'João Silva',
    resultType: 'lab',
    resultName: 'Potássio',
    resultValue: '6.2 mmol/L',
    normalRange: '3.5-5.0 mmol/L',
    timestamp: new Date().toISOString(),
    acknowledged: false,
    severity: 'critical'
  },
  {
    id: '2',
    patientId: '102',
    patientName: 'Maria Oliveira',
    resultType: 'vital',
    resultName: 'Pressão Arterial',
    resultValue: '190/110 mmHg',
    normalRange: '< 140/90 mmHg',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    acknowledged: false,
    severity: 'urgent'
  },
  {
    id: '3',
    patientId: '103',
    patientName: 'Pedro Santos',
    resultType: 'imaging',
    resultName: 'Radiografia de Tórax',
    resultValue: 'Pneumotórax',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    acknowledged: true,
    acknowledgedBy: 'Dr. Carlos',
    acknowledgedAt: new Date(Date.now() - 3600000).toISOString(),
    severity: 'critical'
  }
];

export const useCriticalResults = () => {
  const { language } = useTranslation();
  const { user } = useAuth();
  const [results, setResults] = useState<CriticalResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to calculate the count of unacknowledged results
  const unacknowledgedCount = results.filter(result => !result.acknowledged).length;

  // Fetch critical results (mocked for now)
  useEffect(() => {
    const fetchCriticalResults = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, you would fetch from Supabase
        // For now, use mock data with a slight delay to simulate a network request
        await new Promise(resolve => setTimeout(resolve, 500));
        setResults(mockCriticalResults);
      } catch (error) {
        console.error('Error fetching critical results:', error);
        toast.error(
          language === 'pt' ? 'Erro ao carregar resultados críticos' : 'Error loading critical results'
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCriticalResults();
  }, [language]);

  // Function to acknowledge a critical result
  const acknowledgeCriticalResult = async (resultId: string): Promise<void> => {
    try {
      if (!user) {
        throw new Error(language === 'pt' ? 'Usuário não autenticado' : 'User not authenticated');
      }
      
      // In a real implementation, you would update in Supabase
      // For now, update the local state
      setResults(prevResults => prevResults.map(result => {
        if (result.id === resultId) {
          return {
            ...result,
            acknowledged: true,
            acknowledgedBy: user.email || 'Unknown User',
            acknowledgedAt: new Date().toISOString()
          };
        }
        return result;
      }));
      
      toast.success(
        language === 'pt' ? 'Resultado confirmado' : 'Result acknowledged',
        {
          description: language === 'pt' 
            ? 'O resultado crítico foi confirmado com sucesso' 
            : 'The critical result has been successfully acknowledged'
        }
      );
    } catch (error) {
      console.error('Error acknowledging critical result:', error);
      toast.error(
        language === 'pt' ? 'Erro ao confirmar resultado' : 'Error acknowledging result',
        {
          description: error instanceof Error ? error.message : String(error)
        }
      );
      throw error;
    }
  };

  return {
    results,
    isLoading,
    acknowledgeCriticalResult,
    unacknowledgedCount
  };
};
