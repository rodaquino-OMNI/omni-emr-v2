
import React from 'react';
import { Clock } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Languages } from '@/types/auth';

interface ApprovalPendingAlertProps {
  pendingApproval: boolean;
  language: Languages;
}

const ApprovalPendingAlert: React.FC<ApprovalPendingAlertProps> = ({ pendingApproval, language }) => {
  if (!pendingApproval) return null;
  
  return (
    <Alert variant="warning" className="mb-4">
      <Clock className="h-4 w-4 mr-2" />
      <AlertTitle>
        {language === 'pt' ? 'Aprovação Pendente' : 'Approval Pending'}
      </AlertTitle>
      <p className="text-sm mt-1">
        {language === 'pt' 
          ? 'Sua conta está aguardando aprovação administrativa. Você receberá um email quando sua conta for aprovada.'
          : 'Your account is pending administrative approval. You will receive an email when your account is approved.'}
      </p>
    </Alert>
  );
};

export default ApprovalPendingAlert;
