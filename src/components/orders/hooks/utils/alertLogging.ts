
import { OrderAlert } from '../types/orderAlerts';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import React from 'react';

/**
 * Logs alert information to the system logs and displays a toast notification
 */
export const logOrderAlert = (alert: OrderAlert) => {
  console.info(`Order alert triggered: ${alert.message} (${alert.type})`);

  const iconMap = {
    error: React.createElement(AlertTriangle, { className: "h-4 w-4" }),
    warning: React.createElement(AlertTriangle, { className: "h-4 w-4" }),
    info: React.createElement(Info, { className: "h-4 w-4" })
  };

  const icon = iconMap[alert.severity || 'info'];

  toast(alert.title || "Order Alert", {
    description: alert.message,
    icon
  });
};

/**
 * Logs when an alert has been dismissed by the user
 */
export const logAlertDismissal = (alert: OrderAlert, reason: string) => {
  console.info(`Alert dismissed: ${alert.message} - Reason: ${reason}`);
};

/**
 * Logs when an alert has been acknowledged by the user
 */
export const logAlertAcknowledgement = (alert: OrderAlert) => {
  console.info(`Alert acknowledged: ${alert.message}`);
  
  toast("Alert Acknowledged", {
    description: `You've acknowledged: ${alert.message}`,
    icon: React.createElement(CheckCircle, { className: "h-4 w-4" })
  });
};

/**
 * Logs when alerts are overridden by a user
 */
export const logAlertOverrides = (userId: string | undefined, alerts: OrderAlert[]) => {
  console.info(`Alerts overridden by user: ${userId || 'Unknown'}`);
  
  alerts.forEach(alert => {
    console.info(`  - ${alert.message} (${alert.type})`);
  });
};

/**
 * Shows a toast notification when alerts are overridden
 */
export const showAlertOverrideToast = (language: string) => {
  toast.success("Alerts Overridden", {
    description: "You have overridden the medication safety alerts",
    duration: 3000
  });
};

/**
 * Shows a toast notification when an order is cancelled
 */
export const showOrderCancelledToast = (language: string) => {
  toast.info("Order Cancelled", {
    description: "The order has been cancelled",
    duration: 3000
  });
};
