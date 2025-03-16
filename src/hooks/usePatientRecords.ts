
import { useQuery } from '@tanstack/react-query';

export const usePatientRecords = (patientId: string) => {
  return useQuery({
    queryKey: ['patientRecords', patientId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 'record-1', type: 'Lab Report', date: '2023-01-01', description: 'Complete blood count' },
        { id: 'record-2', type: 'Imaging', date: '2023-02-15', description: 'X-ray of chest' }
      ];
    },
    enabled: !!patientId
  });
};
