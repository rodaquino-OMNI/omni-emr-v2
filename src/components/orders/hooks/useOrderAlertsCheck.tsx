
import { useState } from 'react';
import { OrderType } from '@/types/orders';
import { OrderAlert } from './types/orderAlerts';
import { useAlertVerification } from './useAlertVerification';
import { useAlertDecisions } from './useAlertDecisions';

export const useOrderAlertsCheck = () => {
  const [alerts, setAlerts] = useState<OrderAlert[]>([]);
  const [showAIModal, setShowAIModal] = useState(false);
  
  const { isSubmitting, checkForAlerts } = useAlertVerification(setAlerts, setShowAIModal);
  const { handleAlertsDecision } = useAlertDecisions(alerts, setAlerts);
  
  return {
    alerts,
    setAlerts,
    isSubmitting,
    showAIModal,
    setShowAIModal,
    checkForAlerts,
    handleAlertsDecision
  };
};
