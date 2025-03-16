
import { OrderAlert } from '../types/orderAlerts';
import { toast } from 'sonner';
import { AlertTriangle, Info, Bell } from 'lucide-react';
import React from 'react';

/**
 * Shows a critical alert notification in the UI that requires immediate attention
 */
export const showCriticalAlert = (alert: OrderAlert) => {
  console.error(`CRITICAL ALERT: ${alert.message}`);
  
  toast.error(alert.title || "Critical Alert", {
    description: alert.message,
    duration: 10000, // longer duration for critical alerts
    icon: <AlertTriangle className="h-4 w-4" />
  });
};

/**
 * Shows a warning notification that should be reviewed but is not critical
 */
export const showWarningAlert = (alert: OrderAlert) => {
  console.warn(`Warning Alert: ${alert.message}`);
  
  toast.warning(alert.title || "Warning", {
    description: alert.message,
    duration: 6000,
    icon: <AlertTriangle className="h-4 w-4" />
  });
};

/**
 * Shows an informational notification about the order
 */
export const showInfoAlert = (alert: OrderAlert) => {
  console.info(`Info Alert: ${alert.message}`);
  
  toast.info(alert.title || "Information", {
    description: alert.message,
    duration: 4000,
    icon: <Info className="h-4 w-4" />
  });
};

/**
 * Dispatches the alert to the appropriate notification method based on its severity
 */
export const dispatchAlert = (alert: OrderAlert) => {
  switch (alert.severity) {
    case 'error':
      showCriticalAlert(alert);
      break;
    case 'warning':
      showWarningAlert(alert);
      break;
    case 'info':
    default:
      showInfoAlert(alert);
      break;
  }
};
