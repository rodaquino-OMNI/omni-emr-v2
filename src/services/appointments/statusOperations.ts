
import { Appointment } from './types';
import { updateAppointment } from './crudOperations';
import { handleServiceError, handleServiceSuccess } from './utils/standardErrorHandler';

// Cancel an appointment with standardized error handling
export const cancelAppointment = async (id: string, reason?: string): Promise<boolean> => {
  try {
    const result = await updateAppointment(id, { status: 'cancelled' });
    
    if (result) {
      await handleServiceSuccess(result, {
        userId: result.providerId,
        operation: 'cancel',
        entityType: 'appointment',
        entityId: id,
        patientId: result.patientId,
        details: { reason },
        showToast: true,
        toastMessage: 'Appointment cancelled successfully'
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    await handleServiceError(
      error,
      {
        operation: 'cancel',
        entityType: 'appointment',
        entityId: id,
        showToast: true
      }
    );
    
    return false;
  }
};

// Mark an appointment as completed with standardized error handling
export const completeAppointment = async (id: string, notes?: string): Promise<boolean> => {
  try {
    const updates: Partial<Appointment> = { 
      status: 'completed',
      notes: notes ? notes : undefined
    };
    
    const result = await updateAppointment(id, updates);
    
    if (result) {
      await handleServiceSuccess(result, {
        userId: result.providerId,
        operation: 'complete',
        entityType: 'appointment',
        entityId: id,
        patientId: result.patientId,
        showToast: true,
        toastMessage: 'Appointment marked as completed'
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    await handleServiceError(
      error,
      {
        operation: 'complete',
        entityType: 'appointment',
        entityId: id,
        showToast: true
      }
    );
    
    return false;
  }
};

// Send a reminder for an appointment with standardized error handling
export const sendAppointmentReminder = async (id: string): Promise<boolean> => {
  try {
    const result = await updateAppointment(id, { reminder_sent: true });
    
    if (result) {
      // In a real app, this would trigger an email or SMS notification
      console.log(`Reminder sent for appointment ID: ${id}`);
      
      await handleServiceSuccess(result, {
        userId: result.providerId,
        operation: 'reminder_sent',
        entityType: 'appointment',
        entityId: id,
        patientId: result.patientId,
        showToast: true,
        toastMessage: 'Reminder sent to patient'
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    await handleServiceError(
      error,
      {
        operation: 'send_reminder',
        entityType: 'appointment',
        entityId: id,
        showToast: true
      }
    );
    
    return false;
  }
};
