import { supabase, logAuditEvent } from '@/integrations/supabase/client';

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

// Generate a set of mock appointments
const generateMockAppointments = (): Appointment[] => {
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      patientId: "1",
      patientName: "John Doe",
      providerId: "101",
      providerName: "Dr. Sarah Chen",
      title: "Follow-up Consultation",
      notes: "Check progress on medication",
      date: "2023-11-15",
      time: "09:00",
      duration: 30,
      location: "Room 203",
      type: "in-person",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      patientId: "2",
      patientName: "Emma Thompson",
      providerId: "102",
      providerName: "Dr. Michael Rodriguez",
      title: "Medication Review",
      notes: "Adjust medication dosage if needed",
      date: "2023-11-15",
      time: "10:00",
      duration: 15,
      location: "Room 105",
      type: "in-person",
      status: "scheduled",
      reminder_sent: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "3",
      patientId: "3",
      patientName: "Michael Johnson",
      providerId: "103",
      providerName: "Dr. Lisa Wilson",
      title: "Physical Therapy",
      notes: "Follow-up on exercise routine",
      date: "2023-11-15",
      time: "11:30",
      duration: 45,
      location: "Therapy Room A",
      type: "in-person",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "4",
      patientId: "4",
      patientName: "Sophia Martinez",
      providerId: "101",
      providerName: "Dr. Sarah Chen",
      title: "Diagnostic Imaging",
      notes: "Review MRI results",
      date: "2023-11-16",
      time: "09:30",
      duration: 60,
      location: "Radiology Dept.",
      type: "in-person",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "5",
      patientId: "1",
      patientName: "John Doe",
      providerId: "101",
      providerName: "Dr. Sarah Chen",
      title: "Telemedicine Consultation",
      notes: "Discuss treatment progress",
      date: "2023-11-17",
      time: "14:00",
      duration: 30,
      location: "Virtual",
      type: "telemedicine",
      status: "scheduled",
      reminder_sent: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "6",
      patientId: "5",
      patientName: "Robert Chen",
      providerId: "102",
      providerName: "Dr. Michael Rodriguez",
      title: "Post-Surgery Check",
      notes: "Evaluate recovery progress",
      date: "2023-11-18",
      time: "11:00",
      duration: 20,
      location: "Room 110",
      type: "in-person",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "7",
      patientId: "6",
      patientName: "Olivia Wilson",
      providerId: "103",
      providerName: "Dr. Lisa Wilson",
      title: "Phone Consultation",
      notes: "Discuss test results",
      date: "2023-11-20",
      time: "15:30",
      duration: 15,
      location: "Phone",
      type: "phone",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  return mockAppointments;
};

let mockAppointments = generateMockAppointments();

// Get all appointments
export const getAllAppointments = async (): Promise<Appointment[]> => {
  console.log('Using mock appointments - no appointments table exists in Supabase yet');
  return mockAppointments;
};

// Get appointments by date
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  console.log('Using mock appointments - no appointments table exists in Supabase yet');
  return mockAppointments.filter(a => a.date === date);
};

// Get appointments by patient ID
export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  console.log('Using mock appointments - no appointments table exists in Supabase yet');
  return mockAppointments.filter(a => a.patientId === patientId);
};

// Get appointments by provider ID
export const getAppointmentsByProvider = async (providerId: string): Promise<Appointment[]> => {
  console.log('Using mock appointments - no appointments table exists in Supabase yet');
  return mockAppointments.filter(a => a.providerId === providerId);
};

// Create a new appointment
export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  const now = new Date().toISOString();
  const newAppointment: Appointment = {
    ...appointment,
    id: `app-${Date.now()}`,
    created_at: now,
    updated_at: now
  };
  
  console.log('Using mock data - no appointments table exists in Supabase yet');
  mockAppointments.push(newAppointment);
  
  // Log the action
  await logAuditEvent(
    appointment.providerId,
    'create',
    'appointment',
    newAppointment.id,
    { patientId: appointment.patientId }
  );
  
  return newAppointment;
};

// Update an appointment
export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
  const updatedAppointment = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  console.log('Using mock data - no appointments table exists in Supabase yet');
  
  // Update in mock data
  const index = mockAppointments.findIndex(a => a.id === id);
  if (index >= 0) {
    mockAppointments[index] = {
      ...mockAppointments[index],
      ...updatedAppointment
    };
    
    // Log the action
    await logAuditEvent(
      mockAppointments[index].providerId,
      'update',
      'appointment',
      id,
      { patientId: mockAppointments[index].patientId, updates }
    );
    
    return mockAppointments[index];
  }
  
  return null;
};

// Cancel an appointment
export const cancelAppointment = async (id: string, reason?: string): Promise<boolean> => {
  try {
    const result = await updateAppointment(id, { status: 'cancelled' });
    
    if (result) {
      // Log the action with the reason
      await logAuditEvent(
        result.providerId,
        'cancel',
        'appointment',
        id,
        { patientId: result.patientId, reason }
      );
      
      return true;
    }
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
  }
  
  return false;
};

// Send a reminder for an appointment
export const sendAppointmentReminder = async (id: string): Promise<boolean> => {
  try {
    const appointment = mockAppointments.find(a => a.id === id);
    
    if (appointment) {
      const result = await updateAppointment(id, { reminder_sent: true });
      
      if (result) {
        // In a real app, this would trigger an email or SMS notification
        console.log(`Reminder sent for appointment ID: ${id}`);
        
        // Log the action
        await logAuditEvent(
          appointment.providerId,
          'reminder_sent',
          'appointment',
          id,
          { patientId: appointment.patientId }
        );
        
        return true;
      }
    }
  } catch (error) {
    console.error('Failed to send appointment reminder:', error);
  }
  
  return false;
};

// Mark an appointment as completed
export const completeAppointment = async (id: string, notes?: string): Promise<boolean> => {
  try {
    const updates: Partial<Appointment> = { 
      status: 'completed',
      notes: notes ? notes : undefined
    };
    
    const result = await updateAppointment(id, updates);
    
    if (result) {
      // Log the action
      await logAuditEvent(
        result.providerId,
        'complete',
        'appointment',
        id,
        { patientId: result.patientId }
      );
      
      return true;
    }
  } catch (error) {
    console.error('Failed to complete appointment:', error);
  }
  
  return false;
};
