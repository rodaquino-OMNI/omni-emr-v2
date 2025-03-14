
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderType } from '@/types/orders';

interface OrderAlert {
  type: 'critical' | 'warning' | 'info';
  message: string;
  overridden: boolean;
}

export const useOrderAlertsCheck = () => {
  const { toast } = useToast();
  const { language } = useTranslation();
  const [alerts, setAlerts] = useState<OrderAlert[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  
  const checkForAlerts = async (activeTab: OrderType, orderData: any) => {
    if (isSubmitting) return { hasAlerts: false, alerts: [] };
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an AI service
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate new alerts based on the order data
      const newAlerts = generateMockAlerts(activeTab, orderData);
      
      // Update state with new alerts
      setAlerts(newAlerts);
      
      // Determine if we need to show the AI modal
      const hasAlerts = newAlerts.length > 0;
      setShowAIModal(hasAlerts);
      
      return { hasAlerts, alerts: newAlerts };
      
    } catch (error) {
      console.error('Error checking for alerts:', error);
      
      // Clear alerts in case of error
      setAlerts([]);
      
      // Show error toast
      toast({
        variant: 'destructive',
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' 
          ? 'Falha ao verificar alertas. Deseja prosseguir mesmo assim?' 
          : 'Failed to check for alerts. Do you want to proceed anyway?'
      });
      
      return { hasAlerts: false, alerts: [] };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAlertsDecision = (proceed: boolean, overrideReasons?: {[key: number]: string}) => {
    setShowAIModal(false);
    
    if (proceed && overrideReasons) {
      // Update alerts with override reasons
      const updatedAlerts = alerts.map((alert, index) => ({
        ...alert,
        overridden: true,
        overriddenReason: overrideReasons[index] || 'Clinical decision'
      }));
      setAlerts(updatedAlerts);
      
      return updatedAlerts;
    }
    
    return proceed ? alerts : null;
  };
  
  // Extracted function to generate mock alerts based on order data
  const generateMockAlerts = (activeTab: OrderType, orderData: any): OrderAlert[] => {
    if (activeTab === 'medication') {
      const medicationName = orderData.medication?.medicationName?.toLowerCase() || '';
      
      if (medicationName.includes('warfarin') || medicationName.includes('coumadin')) {
        return [{
          type: 'warning',
          message: 'Potential interaction with patient\'s current aspirin therapy. Consider monitoring INR more frequently.',
          overridden: false
        }];
      } else if (medicationName.includes('penicillin') || medicationName.includes('amoxicillin')) {
        return [{
          type: 'critical',
          message: 'Patient has documented penicillin allergy. Consider alternative antibiotic.',
          overridden: false
        }];
      } else if (medicationName && Math.random() > 0.5) {
        // Random warning for demo purposes
        return [{
          type: 'info',
          message: 'This medication may cause drowsiness. Advise patient to avoid driving.',
          overridden: false
        }];
      }
    }
    
    return [];
  };
  
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
