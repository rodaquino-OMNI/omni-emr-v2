
import { OrderType } from '@/types/orders';
import { OrderAlert } from '../types/orderAlerts';

/**
 * Generates mock alerts based on order data for demonstration purposes
 */
export const generateMockAlerts = (activeTab: OrderType, orderData: any): OrderAlert[] => {
  if (activeTab === 'medication') {
    const medicationName = orderData.medication?.medicationName?.toLowerCase() || '';
    
    const alertsToReturn: OrderAlert[] = [];
    
    if (medicationName.includes('warfarin') || medicationName.includes('coumadin')) {
      alertsToReturn.push({
        type: 'warning',
        message: 'Potential interaction with patient\'s current aspirin therapy. Consider monitoring INR more frequently.',
        overridden: false
      });
    } 
    
    if (medicationName.includes('penicillin') || medicationName.includes('amoxicillin')) {
      alertsToReturn.push({
        type: 'critical',
        message: 'Patient has documented penicillin allergy. Consider alternative antibiotic.',
        overridden: false
      });
    } 
    
    if (medicationName && Math.random() > 0.5) {
      // Random warning for demo purposes
      alertsToReturn.push({
        type: 'info',
        message: 'This medication may cause drowsiness. Advise patient to avoid driving.',
        overridden: false
      });
    }
    
    return alertsToReturn;
  }
  
  return [];
};
