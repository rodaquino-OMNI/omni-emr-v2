
import { useQuery } from '@tanstack/react-query';

// Types for AI insights
export interface PatientInsight {
  id: string;
  patientId: string;
  type: 'critical' | 'warning' | 'info';
  source: 'labs' | 'vitals' | 'medications' | 'tasks' | 'general';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'critical' | 'warning' | 'info';
  relatedItems?: string[];
  actionRequired?: boolean;
  actionDescription?: string;
}

// Sample insights data for development
const sampleInsights: PatientInsight[] = [
  {
    id: '1',
    patientId: '1',
    type: 'critical',
    source: 'labs',
    severity: 'critical',
    title: 'Critical Potassium Levels',
    description: 'Patient has potassium level of 6.8 mmol/L, which is critically high. Immediate action required.',
    timestamp: new Date().toISOString(),
    actionRequired: true,
    actionDescription: 'Notify attending physician immediately'
  },
  {
    id: '2',
    patientId: '1',
    type: 'warning',
    source: 'medications',
    severity: 'warning',
    title: 'Potential Medication Interaction',
    description: 'Potential interaction between Warfarin and newly prescribed Ibuprofen. Monitor for increased bleeding risk.',
    timestamp: new Date().toISOString(),
    relatedItems: ['Warfarin', 'Ibuprofen']
  },
  {
    id: '3',
    patientId: '2',
    type: 'info',
    source: 'vitals',
    severity: 'info',
    title: 'Blood Pressure Trend',
    description: 'Blood pressure showing improving trend over last 24 hours. Continue current management.',
    timestamp: new Date().toISOString()
  },
  {
    id: '4',
    patientId: '3',
    type: 'warning',
    source: 'labs',
    severity: 'warning',
    title: 'Declining Renal Function',
    description: 'GFR has decreased from 68 to 52 in the past week. Consider medication adjustment.',
    timestamp: new Date().toISOString()
  }
];

/**
 * Hook to fetch AI-generated insights for a patient
 */
export const usePatientInsights = (patientId: string | undefined, sources?: string[]) => {
  return useQuery({
    queryKey: ['patientInsights', patientId, sources],
    queryFn: async () => {
      if (!patientId) return [];

      // For development, return sample insights filtered by patient ID and sources
      const filteredInsights = sampleInsights.filter(insight => {
        // Filter by patient ID
        if (insight.patientId !== patientId) return false;
        
        // Filter by sources if provided
        if (sources && sources.length > 0) {
          return sources.includes(insight.source);
        }
        
        return true;
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return filteredInsights;
    },
    enabled: !!patientId
  });
};
