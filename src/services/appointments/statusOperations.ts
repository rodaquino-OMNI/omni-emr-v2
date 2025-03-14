
import { logAuditEvent } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { updateAppointment } from './crudOperations';

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

// Send a reminder for an appointment
export const sendAppointmentReminder = async (id: string): Promise<boolean> => {
  try {
    const result = await updateAppointment(id, { reminder_sent: true });
    
    if (result) {
      // In a real app, this would trigger an email or SMS notification
      console.log(`Reminder sent for appointment ID: ${id}`);
      
      // Log the action
      await logAuditEvent(
        result.providerId,
        'reminder_sent',
        'appointment',
        id,
        { patientId: result.patientId }
      );
      
      return true;
    }
  } catch (error) {
    console.error('Failed to send appointment reminder:', error);
  }
  
  return false;
};
