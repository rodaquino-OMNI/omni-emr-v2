
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';

// Get all appointments
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
    
    return data as Appointment[];
  } catch (error) {
    console.error('Exception fetching appointments:', error);
    // Fall back to mock data if there's an exception
    return mockAppointments;
  }
};

// Get appointments by date
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
    
    return data as Appointment[];
  } catch (error) {
    console.error('Exception fetching appointments by date:', error);
    // Fall back to mock data if there's an exception
    return mockAppointments.filter(a => a.date === date);
  }
};

// Get appointments by patient ID
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
    
    return data.map(row => ({
      ...row,
      patientId: row.patient_id,
      providerId: row.provider_id,
      patientName: row.patient_name,
      providerName: row.provider_name,
      reminder_sent: row.reminder_sent
    })) as Appointment[];
  } catch (error) {
    console.error('Exception fetching appointments by patient:', error);
    // Fall back to mock data if there's an exception
    return mockAppointments.filter(a => a.patientId === patientId);
  }
};

// Get appointments by provider ID
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
    
    return data.map(row => ({
      ...row,
      patientId: row.patient_id,
      providerId: row.provider_id,
      patientName: row.patient_name,
      providerName: row.provider_name,
      reminder_sent: row.reminder_sent
    })) as Appointment[];
  } catch (error) {
    console.error('Exception fetching appointments by provider:', error);
    // Fall back to mock data if there's an exception
    return mockAppointments.filter(a => a.providerId === providerId);
  }
};

// Create a new appointment
export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  try {
    // Prepare data for Supabase insert
    const appointmentData = {
      patient_id: appointment.patientId,
      patient_name: appointment.patientName,
      provider_id: appointment.providerId,
      provider_name: appointment.providerName,
      title: appointment.title,
      notes: appointment.notes || null,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      location: appointment.location,
      type: appointment.type,
      status: appointment.status,
      reminder_sent: appointment.reminder_sent
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      // Fall back to mock data approach
      const now = new Date().toISOString();
      const newAppointment: Appointment = {
        ...appointment,
        id: `app-${Date.now()}`,
        created_at: now,
        updated_at: now
      };
      
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
    }
    
    // Map the returned data back to our Appointment type
    const result: Appointment = {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      providerId: data.provider_id,
      providerName: data.provider_name,
      title: data.title,
      notes: data.notes,
      date: data.date,
      time: data.time,
      duration: data.duration,
      location: data.location,
      type: data.type,
      status: data.status,
      reminder_sent: data.reminder_sent,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    // Log the action
    await logAuditEvent(
      appointment.providerId,
      'create',
      'appointment',
      result.id,
      { patientId: appointment.patientId }
    );
    
    return result;
  } catch (error) {
    console.error('Exception creating appointment:', error);
    
    // Fall back to mock data approach
    const now = new Date().toISOString();
    const newAppointment: Appointment = {
      ...appointment,
      id: `app-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    
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
  }
};

// Update an appointment
export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    // Convert from our API format to database format if needed
    const dbUpdates: any = { ...updates };
    
    if (updates.patientId) {
      dbUpdates.patient_id = updates.patientId;
      delete dbUpdates.patientId;
    }
    
    if (updates.providerId) {
      dbUpdates.provider_id = updates.providerId;
      delete dbUpdates.providerId;
    }
    
    if (updates.patientName) {
      dbUpdates.patient_name = updates.patientName;
      delete dbUpdates.patientName;
    }
    
    if (updates.providerName) {
      dbUpdates.provider_name = updates.providerName;
      delete dbUpdates.providerName;
    }
    
    // Remove created_at and updated_at if present
    delete dbUpdates.created_at;
    delete dbUpdates.updated_at;
    
    const { data, error } = await supabase
      .from('appointments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating appointment:', error);
      
      // Fall back to mock data
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index >= 0) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          ...updates,
          updated_at: new Date().toISOString()
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
    }
    
    // Map the returned data back to our Appointment type
    const result: Appointment = {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      providerId: data.provider_id,
      providerName: data.provider_name,
      title: data.title,
      notes: data.notes,
      date: data.date,
      time: data.time,
      duration: data.duration,
      location: data.location,
      type: data.type,
      status: data.status,
      reminder_sent: data.reminder_sent,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    // Log the action
    await logAuditEvent(
      result.providerId,
      'update',
      'appointment',
      id,
      { patientId: result.patientId, updates }
    );
    
    return result;
  } catch (error) {
    console.error('Exception updating appointment:', error);
    
    // Update in mock data
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index >= 0) {
      mockAppointments[index] = {
        ...mockAppointments[index],
        ...updates,
        updated_at: new Date().toISOString()
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
  }
};
