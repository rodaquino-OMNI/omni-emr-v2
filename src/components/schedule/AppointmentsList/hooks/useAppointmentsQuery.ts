
import { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  providerId: string;
  providerName: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'canceled' | 'no-show';
  type: string;
  notes?: string;
  location?: string;
  reason?: string;
}

interface AppointmentsQueryProps {
  selectedDate?: Date;
  patientId?: string;
  providerId?: string;
  status?: string;
  limit?: number;
}

export const useAppointmentsQuery = ({
  selectedDate,
  patientId,
  providerId,
  status,
  limit = 50
}: AppointmentsQueryProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data for demonstration
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientName: 'John Doe',
          patientId: '123',
          providerId: '456',
          providerName: 'Dr. Smith',
          startTime: new Date(new Date().setHours(9, 0, 0)),
          endTime: new Date(new Date().setHours(9, 30, 0)),
          status: 'scheduled',
          type: 'follow-up'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          patientId: '124',
          providerId: '456',
          providerName: 'Dr. Smith',
          startTime: new Date(new Date().setHours(10, 0, 0)),
          endTime: new Date(new Date().setHours(10, 45, 0)),
          status: 'scheduled',
          type: 'initial-consultation'
        }
      ];
      
      // Filter appointments based on parameters
      let filteredAppointments = [...mockAppointments];
      
      if (selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        filteredAppointments = filteredAppointments.filter(app => 
          format(app.startTime, 'yyyy-MM-dd') === dateStr
        );
      }
      
      if (patientId) {
        filteredAppointments = filteredAppointments.filter(app => 
          app.patientId === patientId
        );
      }
      
      if (providerId) {
        filteredAppointments = filteredAppointments.filter(app => 
          app.providerId === providerId
        );
      }
      
      if (status && status !== 'all') {
        filteredAppointments = filteredAppointments.filter(app => 
          app.status === status
        );
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(filteredAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch appointments'));
      toast('Error', {
        description: 'Failed to fetch appointments'
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, patientId, providerId, status]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments
  };
};

export default useAppointmentsQuery;
