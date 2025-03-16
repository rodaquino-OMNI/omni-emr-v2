
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
  // New fields added to match the database schema
  category?: string;
  is_telehealth?: boolean;
  reminder_time?: string;
  created_by?: string;
}
