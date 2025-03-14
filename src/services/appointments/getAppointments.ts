
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';
import { mapDbAppointmentToAppointment } from './utils/appointmentMappers';

/**
 * Get all appointments
 */
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      // Fall back to mock data if there's an error
      return mockAppointments;
    }
    
    // Map the database fields to our Appointment type
    return data.map(mapDbAppointmentToAppointment);
  } catch (error) {
    console.error('Exception fetching appointments:', error);
    // Fall back to mock data if there's an exception
    return mockAppointments;
  }
};

/**
 * Get appointments by date
 */
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments by date:', error);
      // Fall back to mock data if there's an error
      return mockAppointments.filter(a => a.date === date);
    }
    
    // Map the database fields to our Appointment type
    return data.map(mapDbAppointmentToAppointment);
  } catch (error) {
    console.error('Exception fetching appointments by date:', error);
    // Fall back to mock data if there's an exception
    return mockAppointments.filter(a => a.date === date);
  }
};

/**
 * Get appointments by patient ID
 */
export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments by patient:', error);
      // Fall back to mock data if there's an error
      return mockAppointments.filter(a => a.patientId === patientId);
    }
    
    return data.map(mapDbAppointmentToAppointment);
  } catch (error) {
    console.error('Exception fetching appointments by patient:', error);
    // Fall back to mock data if there's an exception
    return mockAppointments.filter(a => a.patientId === patientId);
  }
};

/**
 * Get appointments by provider ID
 */
export const getAppointmentsByProvider = async (providerId: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('provider_id', providerId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments by provider:', error);
      // Fall back to mock data if there's an error
      return mockAppointments.filter(a => a.providerId === providerId);
    }
    
    return data.map(mapDbAppointmentToAppointment);
  } catch (error) {
    console.error('Exception fetching appointments by provider:', error);
    // Fall back to mock data if there's an exception
    return mockAppointments.filter(a => a.providerId === providerId);
  }
};
