
import { useQuery } from '@tanstack/react-query';

export const usePatientInsights = (patientId: string) => {
  return useQuery({
    queryKey: ['patientInsights', patientId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 'insight-1', text: 'Patient has a history of hypertension.' },
        { id: 'insight-2', text: 'Patient is currently taking medication for diabetes.' }
      ];
    },
    enabled: !!patientId
  });
};
