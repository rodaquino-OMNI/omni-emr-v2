
import { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderType } from '@/types/orders';
import { OrderAlert } from './types/orderAlerts';
import { generateMockAlerts } from './utils/mockAlertGenerator';
import { 
  showAnalyzingOrderToast, 
  showVerificationSuccessToast, 
  showVerificationErrorToast 
} from './utils/alertNotifications';
import { verifyOrderWithSupabase } from './utils/aiVerificationService';

export const useAlertVerification = (
  setAlerts: React.Dispatch<React.SetStateAction<OrderAlert[]>>,
  setShowAIModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { language } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for alerts
  const checkForAlerts = useCallback(async (activeTab: OrderType, orderData: any) => {
    if (isSubmitting) return { hasAlerts: false, alerts: [] };
    
    setIsSubmitting(true);
    
    try {
      // Show toast to indicate AI is analyzing the order
      showAnalyzingOrderToast(language);
      
      // Try to verify order with Supabase
      await verifyOrderWithSupabase(activeTab, orderData);
      
      // Generate mock alerts for demo purposes
      const newAlerts = generateMockAlerts(activeTab, orderData);
      
      // Update state with new alerts
      setAlerts(newAlerts);
      
      // Determine if we need to show the AI modal
      const hasAlerts = newAlerts.length > 0;
      setShowAIModal(hasAlerts);
      
      // Show success toast if no alerts were found
      if (!hasAlerts) {
        showVerificationSuccessToast(language);
      }
      
      return { hasAlerts, alerts: newAlerts };
      
    } catch (error) {
      console.error('Error checking for alerts:', error);
      
      // Show error toast
      showVerificationErrorToast(language);
      
      return { hasAlerts: false, alerts: [] };
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, language, setAlerts, setShowAIModal]);

  return {
    isSubmitting,
    checkForAlerts
  };
};
