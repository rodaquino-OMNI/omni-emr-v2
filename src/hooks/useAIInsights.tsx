
import { useState, useEffect } from 'react';
import { AIInsight } from '@/components/ai/AIInsights';

export const useAIInsights = (
  patientId?: string,
  sources: Array<'vitals' | 'labs' | 'medications' | 'tasks' | 'general'> = ['general']
) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true);
      try {
        // This would normally be an API call to a backend service
        // that processes the patient data and returns AI insights
        // For now, we'll generate mock insights based on the patient ID and sources
        
        const mockInsights: AIInsight[] = [];
        
        // Generate mock insights based on selected sources
        if (sources.includes('vitals') && patientId) {
          mockInsights.push({
            id: `vital-${patientId}-1`,
            type: 'warning',
            source: 'vitals',
            title: 'Blood Pressure Trend',
            description: 'Systolic pressure has increased by 15% over the last 3 measurements. Consider adjusting hypertension medication.',
            relatedTo: { type: 'vital', id: 'bp' },
            timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
          });

          if (patientId === '2') { // For specific patient
            mockInsights.push({
              id: `vital-${patientId}-2`,
              type: 'critical',
              source: 'vitals',
              title: 'Oxygen Saturation Alert',
              description: 'O₂ saturation has dropped below 92% in the last hour. Immediate respiratory assessment recommended.',
              relatedTo: { type: 'vital', id: 'o2' },
              timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
            });
          }
        }
        
        if (sources.includes('labs') && patientId) {
          mockInsights.push({
            id: `lab-${patientId}-1`,
            type: 'info',
            source: 'labs',
            title: 'Electrolyte Analysis',
            description: 'Potassium levels are at the lower end of the normal range. Monitor for potential hypokalemia.',
            relatedTo: { type: 'lab', id: 'electrolytes' },
            timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
          });
        }
        
        if (sources.includes('medications') && patientId) {
          mockInsights.push({
            id: `med-${patientId}-1`,
            type: 'warning',
            source: 'medications',
            title: 'Potential Drug Interaction',
            description: 'Current medication regimen includes two drugs with known interaction risk. Consider alternative therapy.',
            relatedTo: { type: 'medication', id: 'interaction' },
            timestamp: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
          });
        }
        
        if (sources.includes('tasks') && patientId) {
          const delayedTask = {
            id: `task-${patientId}-1`,
            type: 'warning' as const,
            source: 'tasks' as const,
            title: 'Delayed Tasks',
            description: 'There are 2 delayed tasks for this patient that require immediate attention.',
            relatedTo: { type: 'task', id: 'delayed' },
            timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
          };
          
          mockInsights.push(delayedTask);
        }
        
        if (sources.includes('general')) {
          if (patientId === '2') {
            mockInsights.push({
              id: `general-${patientId}-1`,
              type: 'critical',
              source: 'general',
              title: 'Critical Patient Status',
              description: 'Multiple vital signs and lab results indicate rapidly deteriorating condition. Consider ICU transfer.',
              timestamp: new Date()
            });
          } else if (patientId) {
            mockInsights.push({
              id: `general-${patientId}-1`,
              type: 'info',
              source: 'general',
              title: 'Treatment Progress',
              description: 'Patient is responding well to current treatment plan based on latest assessments.',
              timestamp: new Date(Date.now() - 1000 * 60 * 240) // 4 hours ago
            });
          } else {
            // General system insights when no patient is selected
            mockInsights.push({
              id: `general-system-1`,
              type: 'info',
              source: 'general',
              title: 'Department Overview',
              description: 'ICU is currently at 85% capacity with 3 pending admissions from ER.',
              timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
            });
            
            mockInsights.push({
              id: `general-system-2`,
              type: 'warning',
              source: 'general',
              title: 'Staff Allocation Alert',
              description: 'Nurse-to-patient ratio in Pediatrics is below recommended level for next shift.',
              timestamp: new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
            });
          }
        }
        
        // Sort by criticality and timestamp
        const sortedInsights = mockInsights.sort((a, b) => {
          const typeOrder = { critical: 0, warning: 1, info: 2, positive: 3 };
          const typeDiff = 
            typeOrder[a.type as keyof typeof typeOrder] - 
            typeOrder[b.type as keyof typeof typeOrder];
          
          if (typeDiff !== 0) return typeDiff;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        
        setInsights(sortedInsights);
      } catch (error) {
        console.error('Error generating AI insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    generateInsights();
  }, [patientId, sources]);

  return {
    insights,
    loading
  };
};
