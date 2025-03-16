
import { OrderAlert, AlertType } from '../types/orderAlerts';
import { v4 as uuidv4 } from 'uuid';
import { OrderType } from '@/types/orders';

/**
 * Generates mock medication order alerts for testing
 */
export const generateMockMedicationAlerts = (medications: string[]): OrderAlert[] => {
  if (!medications || medications.length === 0) {
    return [];
  }
  
  const alerts: OrderAlert[] = [];
  
  // Add a potential drug interaction alert (50% chance)
  if (medications.length > 1 && Math.random() > 0.5) {
    alerts.push({
      id: uuidv4(),
      type: AlertType.DRUG_INTERACTION,
      message: `Potential interaction between ${medications[0]} and ${medications[1]}`,
      severity: 'warning',
      requiresAcknowledgement: true,
      overridden: false
    });
  }
  
  // Add a potential allergy alert (25% chance)
  if (Math.random() > 0.75) {
    alerts.push({
      id: uuidv4(),
      type: AlertType.ALLERGY,
      message: `Patient has a recorded allergy to ${medications[0]} or similar medications`,
      severity: 'error',
      requiresAcknowledgement: true,
      overridden: false
    });
  }
  
  // Add a dosage warning (30% chance)
  if (Math.random() > 0.7) {
    alerts.push({
      id: uuidv4(),
      type: AlertType.INAPPROPRIATE_DOSE,
      message: `The dosage for ${medications[0]} is outside recommended range`,
      severity: 'warning',
      requiresAcknowledgement: true,
      overridden: false
    });
  }
  
  return alerts;
};

/**
 * Generates mock laboratory order alerts for testing
 */
export const generateMockLabAlerts = (): OrderAlert[] => {
  const alerts: OrderAlert[] = [];
  
  // Add a duplicate order warning (40% chance)
  if (Math.random() > 0.6) {
    alerts.push({
      id: uuidv4(),
      type: AlertType.DUPLICATE_ORDER,
      message: "Similar laboratory tests were ordered in the past 48 hours",
      severity: 'info',
      requiresAcknowledgement: false,
      overridden: false
    });
  }
  
  return alerts;
};

/**
 * Generates mock radiology order alerts for testing
 */
export const generateMockRadiologyAlerts = (): OrderAlert[] => {
  const alerts: OrderAlert[] = [];
  
  // Add a duplicate order warning (35% chance)
  if (Math.random() > 0.65) {
    alerts.push({
      id: uuidv4(),
      type: AlertType.DUPLICATE_ORDER,
      message: "Similar radiology procedure was ordered in the past 7 days",
      severity: 'info',
      requiresAcknowledgement: false,
      overridden: false
    });
  }
  
  // Add a guideline deviation warning (20% chance)
  if (Math.random() > 0.8) {
    alerts.push({
      id: uuidv4(),
      type: AlertType.GUIDELINE_DEVIATION,
      message: "This order deviates from current radiology guidelines",
      severity: 'warning',
      requiresAcknowledgement: true,
      overridden: false
    });
  }
  
  return alerts;
};

/**
 * Generate mock alerts based on order type and data
 */
export const generateMockAlerts = (orderType: OrderType, orderData: any): OrderAlert[] => {
  switch (orderType) {
    case 'medication':
      return generateMockMedicationAlerts([orderData.medicationName]);
    case 'laboratory':
      return generateMockLabAlerts();
    case 'radiology':
      return generateMockRadiologyAlerts();
    default:
      return [];
  }
};
