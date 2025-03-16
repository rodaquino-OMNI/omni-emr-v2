
import { supabase } from '@/integrations/supabase/client';
import { OrderAlert } from '../types/orderAlerts';
import { OrderType } from '@/types/orders';
import React from 'react';
import { Pill, AlertCircle, AlertTriangle } from 'lucide-react';

/**
 * Log alert reactions (acknowledge/override/cancel) to the database
 */
export const logAlertReaction = async (
  alertId: string, 
  patientId: string,
  providerId: string,
  orderType: OrderType,
  action: 'acknowledge' | 'override' | 'cancel',
  reason?: string
) => {
  try {
    const { error } = await supabase
      .from('alert_reactions')
      .insert({
        alert_id: alertId,
        patient_id: patientId,
        provider_id: providerId,
        order_type: orderType,
        action: action,
        reason: reason,
        timestamp: new Date().toISOString()
      });
      
    if (error) throw error;
    
    console.log(`Alert reaction logged: ${action} for alert ${alertId}`);
    return true;
  } catch (error) {
    console.error('Error logging alert reaction:', error);
    return false;
  }
};

/**
 * Get alert icon based on severity
 */
export const getAlertIcon = (alert: OrderAlert) => {
  const severity = alert.severity || 'info';
  
  if (severity === 'error') {
    return React.createElement(AlertCircle, {
      className: 'h-5 w-5 text-red-600'
    });
  } else if (severity === 'warning') {
    return React.createElement(AlertTriangle, {
      className: 'h-5 w-5 text-amber-600'
    });
  } else {
    return React.createElement(Pill, {
      className: 'h-5 w-5 text-blue-600'
    });
  }
};
