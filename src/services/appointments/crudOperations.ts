
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';

// Get all appointments
export const getAllAppointments = async (): Promise<Appointment[]> => {
  // Using mock data until appointments table is created in Supabase
  console.log('Using mock appointments - no appointments table exists in Supabase yet');
  return mockAppointments;
};

// Get appointments by date
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  // Using mock data until appointments table is created in Supabase
  console.log('Using mock appointments - no appointments table exists in Supabase yet');
  return mockAppointments.filter(a => a.date === date);
};

// Get appointments by patient ID
export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  // Using mock data until appointments table is created in Supabase
  console.log('Using mock appointments - no appointments table exists in Supabase yet');
  return mockAppointments.filter(a => a.patientId === patientId);
};

// Get appointments by provider ID
export const getAppointmentsByProvider = async (providerId: string): Promise<Appointment[]> => {
  // Using mock data until appointments table is created in Supabase
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
