
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Languages } from '@/types/auth';

interface ApprovalPendingAlertProps {
  pendingApproval: boolean;
  language: Languages;
}

const ApprovalPendingAlert = ({ pendingApproval, language }: ApprovalPendingAlertProps) => {
  if (!pendingApproval) return null;
  
  return (
    <Alert className="mb-6 bg-amber-50 text-amber-900 border-amber-200">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {language === 'pt' ? 'Aprovação Pendente' : 'Approval Pending'}
      </AlertTitle>
      <AlertDescription>
        {language === 'pt' 
          ? 'Sua conta está aguardando aprovação. Você será notificado assim que for aprovada.'
          : 'Your account is pending approval. You will be notified once it is approved.'}
      </AlertDescription>
    </Alert>
  );
};

export default ApprovalPendingAlert;
