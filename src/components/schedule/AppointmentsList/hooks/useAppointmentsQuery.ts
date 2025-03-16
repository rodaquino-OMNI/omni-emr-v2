
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  getAppointmentsByDate, 
  getAppointmentsByPatient, 
  getAllAppointments 
} from '@/services/appointments';
import { Appointment } from '@/services/appointments/types';

interface UseAppointmentsQueryProps {
  selectedDate?: Date;
  patientId?: string;
  limit?: number;
}

export const useAppointmentsQuery = ({ 
  selectedDate, 
  patientId, 
  limit = 50 
}: UseAppointmentsQueryProps) => {
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ['appointments', { date: formattedDate, patientId, limit }],
    queryFn: async () => {
      if (patientId) {
        return await getAppointmentsByPatient(patientId, limit);
      } else if (formattedDate) {
        return await getAppointmentsByDate(formattedDate, limit);
      } else {
        return await getAllAppointments(limit);
      }
    }
  });

  return {
    appointments: data || [],
    isLoading,
    error: error as Error | null
  };
};

export type { Appointment };
