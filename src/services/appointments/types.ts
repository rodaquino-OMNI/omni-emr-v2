
export type AppointmentType = 'in-person' | 'telemedicine' | 'phone';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  title: string;
  notes?: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}
