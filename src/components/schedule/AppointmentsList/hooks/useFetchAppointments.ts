
import { format } from 'date-fns';
import { 
  getAppointmentsByDate, 
  getAppointmentsByPatient,
  Appointment
} from '@/services/appointments';

/**
 * Hook that returns a function to fetch appointments based on date or patient ID
 */
export const useFetchAppointments = () => {
  return async (selectedDate?: Date, patientId?: string): Promise<Appointment[]> => {
    if (patientId) {
      return getAppointmentsByPatient(patientId);
    }
    
    if (selectedDate) {
      return getAppointmentsByDate(format(selectedDate, 'yyyy-MM-dd'));
    }
    
    return [];
  };
};
