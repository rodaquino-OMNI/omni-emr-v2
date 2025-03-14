
// Mock patient data to use when viewing vitals
export const getPatientName = (id: string): string => {
  const patients: Record<string, string> = {
    '1': 'John Doe',
    '2': 'Jane Smith',
    '3': 'Michael Johnson',
    '4': 'Sarah Williams',
  };
  return patients[id] || 'Unknown Patient';
};
