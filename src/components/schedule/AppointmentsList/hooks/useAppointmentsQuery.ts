
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  getAppointmentsByDate, 
  getAppointmentsByPatient,
  Appointment
} from '@/services/appointments';
import { useFetchAppointments } from './useFetchAppointments';
import { sortAppointmentsByTime, limitAppointments } from '../utils/appointmentUtils';

type UseAppointmentsQueryProps = {
  selectedDate?: Date;
  patientId?: string;
  limit?: number;
};

export const useAppointmentsQuery = ({ selectedDate, patientId, limit }: UseAppointmentsQueryProps) => {
  const fetchAppointments = useFetchAppointments();
  
  // Fetch appointments based on provided filters
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null, patientId],
    queryFn: () => fetchAppointments(selectedDate, patientId),
    enabled: !!(selectedDate || patientId),
  });
  
  // Sort appointments by time
  const sortedAppointments = sortAppointmentsByTime(appointments);
  
  // Apply limit if provided
  const sortedAndLimitedAppointments = limitAppointments(sortedAppointments, limit);

  return {
    appointments,
    isLoading,
    error,
    sortedAppointments,
    sortedAndLimitedAppointments
  };
};
