
import { OrderAlert } from '../types/orderAlerts';

/**
 * Updates alerts with override reasons
 */
export const processAlertOverrides = (
  alerts: OrderAlert[], 
  overrideReasons?: {[key: number]: string}
): OrderAlert[] => {
  if (!overrideReasons) return alerts;
  
  return alerts.map((alert, index) => ({
    ...alert,
    overridden: true,
    overriddenReason: overrideReasons[index] || 'Clinical decision'
  }));
};
