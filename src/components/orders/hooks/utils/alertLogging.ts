
import { supabase } from '@/integrations/supabase/client';
import { OrderAlert } from '../types/orderAlerts';
import { OrderType } from '@/types/orders';
import React from 'react';
import { Pill, AlertCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

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
    // In a real implementation, this would write to the database
    // For now, we'll just log to console since the table doesn't exist
    console.log('Alert reaction logged:', {
      alert_id: alertId,
      patient_id: patientId,
      provider_id: providerId,
      order_type: orderType,
      action: action,
      reason: reason,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error logging alert reaction:', error);
    return false;
  }
};

/**
 * Log alert overrides to the audit log
 */
export const logAlertOverrides = (userId?: string, alerts?: OrderAlert[]) => {
  if (!userId || !alerts || alerts.length === 0) return;
  
  console.log('Alert overrides logged:', {
    userId,
    alerts: alerts.filter(a => a.overridden),
    timestamp: new Date().toISOString()
  });
};

/**
 * Show toast for alert override
 */
export const showAlertOverrideToast = (language: string) => {
  toast.success(
    language === 'pt' 
      ? 'Alertas confirmados com sucesso' 
      : 'Alerts successfully acknowledged'
  );
};

/**
 * Show toast for order cancelled
 */
export const showOrderCancelledToast = (language: string) => {
  toast.info(
    language === 'pt' 
      ? 'Pedido cancelado' 
      : 'Order cancelled'
  );
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
