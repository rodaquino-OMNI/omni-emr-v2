
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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
  
  // Create a stable query key
  const queryKey = useMemo(() => 
    ['appointments', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null, patientId], 
    [selectedDate, patientId]
  );
  
  // Fetch appointments based on provided filters
  const queryResult = useQuery({
    queryKey,
    queryFn: () => fetchAppointments(selectedDate, patientId),
    enabled: !!(selectedDate || patientId),
    staleTime: 5 * 60 * 1000, // 5 minutes stale time to reduce unnecessary refetches
  });
  
  const appointments = queryResult.data || [];
  const isLoading = queryResult.isLoading;
  const error = queryResult.error;
  
  // Memoize sorted appointments to avoid recomputation on each render
  const sortedAppointments = useMemo(() => 
    sortAppointmentsByTime(appointments),
    [appointments]
  );
  
  // Memoize limited appointments
  const sortedAndLimitedAppointments = useMemo(() => 
    limitAppointments(sortedAppointments, limit),
    [sortedAppointments, limit]
  );

  return {
    appointments,
    isLoading,
    error,
    sortedAppointments,
    sortedAndLimitedAppointments
  };
};
