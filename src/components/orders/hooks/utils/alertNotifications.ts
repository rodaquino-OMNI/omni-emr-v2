
import { OrderAlert } from '../types/orderAlerts';
import { toast } from 'sonner';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import React from 'react';

/**
 * Display a notification for a medication interaction alert
 */
export const showDrugInteractionAlert = (alert: OrderAlert) => {
  toast.warning(alert.title || "Drug Interaction Detected", {
    description: alert.message,
    duration: 5000,
    icon: React.createElement(AlertTriangle, { className: "h-4 w-4" })
  });
};

/**
 * Display a notification for an allergy alert
 */
export const showAllergyAlert = (alert: OrderAlert) => {
  toast.error(alert.title || "Allergy Warning", {
    description: alert.message,
    duration: 5000,
    icon: React.createElement(AlertTriangle, { className: "h-4 w-4" })
  });
};

/**
 * Display a notification for a general order alert
 */
export const showOrderAlert = (alert: OrderAlert) => {
  toast.info(alert.title || "Order Alert", {
    description: alert.message,
    duration: 4000,
    icon: React.createElement(Info, { className: "h-4 w-4" })
  });
};

/**
 * Display alerts based on their type
 */
export const displayOrderAlerts = (alerts: OrderAlert[]) => {
  if (!alerts || alerts.length === 0) return;
  
  alerts.forEach(alert => {
    switch (alert.type) {
      case 'DRUG_INTERACTION':
        showDrugInteractionAlert(alert);
        break;
      case 'ALLERGY':
        showAllergyAlert(alert);
        break;
      default:
        showOrderAlert(alert);
    }
  });
};
