
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  getAppointmentsByDate, 
  getAppointmentsByPatient,
  Appointment
} from '@/services/appointments';

type UseAppointmentsQueryProps = {
  selectedDate?: Date;
  patientId?: string;
  limit?: number;
};

export const useAppointmentsQuery = ({ selectedDate, patientId, limit }: UseAppointmentsQueryProps) => {
  // Fetch appointments based on provided filters
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null, patientId],
    queryFn: async () => {
      if (patientId) {
        return getAppointmentsByPatient(patientId);
      }
      if (selectedDate) {
        return getAppointmentsByDate(format(selectedDate, 'yyyy-MM-dd'));
      }
      return [];
    },
    enabled: !!(selectedDate || patientId),
  });
  
  // Sort appointments by time
  const sortedAppointments = [...appointments].sort((a, b) => a.time.localeCompare(b.time));
  
  // Apply limit if provided
  const sortedAndLimitedAppointments = limit ? sortedAppointments.slice(0, limit) : sortedAppointments;

  return {
    appointments,
    isLoading,
    error,
    sortedAppointments,
    sortedAndLimitedAppointments
  };
};
