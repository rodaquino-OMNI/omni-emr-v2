
import { useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderAlert } from './types/orderAlerts';
import { processAlertOverrides } from './utils/alertProcessing';
import { logAlertOverrides, showAlertOverrideToast, showOrderCancelledToast } from './utils/alertLogging';
import { useAuth } from '@/context/AuthContext';

export const useAlertDecisions = (alerts: OrderAlert[], setAlerts: React.Dispatch<React.SetStateAction<OrderAlert[]>>) => {
  const { language } = useTranslation();
  const { user } = useAuth();
  
  // Handle alert decisions
  const handleAlertsDecision = useCallback((proceed: boolean, overrideReasons?: {[key: number]: string}) => {
    if (proceed && overrideReasons) {
      // Update alerts with override reasons
      const updatedAlerts = processAlertOverrides(alerts, overrideReasons);
      
      setAlerts(updatedAlerts);
      
      // Show a toast to acknowledge the alert override
      showAlertOverrideToast(language);
      
      // In a real app, we would log these overrides to the audit log
      logAlertOverrides(user?.id, updatedAlerts);
      
      return updatedAlerts;
    }
    
    if (!proceed) {
      showOrderCancelledToast(language);
    }
    
    return proceed ? alerts : null;
  }, [alerts, language, setAlerts, user?.id]);

  return { handleAlertsDecision };
};
