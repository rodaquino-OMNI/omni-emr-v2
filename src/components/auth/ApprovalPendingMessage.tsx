
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';

interface ApprovalPendingMessageProps {
  onLogout: () => Promise<void>;
}

const ApprovalPendingMessage: React.FC<ApprovalPendingMessageProps> = ({ onLogout }) => {
  const { language } = useTranslation();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-amber-100 p-3">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            
            <h1 className="text-2xl font-bold">
              {language === 'pt' ? 'Aprovação Pendente' : 'Approval Pending'}
            </h1>
            
            <p className="text-muted-foreground">
              {language === 'pt'
                ? `Olá ${user?.name || ''},`
                : `Hello ${user?.name || ''},`}
            </p>
            
            <p className="text-muted-foreground">
              {language === 'pt'
                ? 'Sua conta está aguardando aprovação administrativa. Você receberá um email quando sua conta for aprovada.'
                : 'Your account is awaiting administrative approval. You will receive an email when your account is approved.'}
            </p>
            
            <div className="border-t border-b border-border w-full py-4 my-2">
              <p className="text-sm text-muted-foreground">
                {language === 'pt'
                  ? 'Este processo geralmente leva 1-2 dias úteis. Enquanto isso, se tiver alguma dúvida, entre em contato com o suporte.'
                  : 'This process typically takes 1-2 business days. In the meantime, if you have any questions, please contact support.'}
              </p>
            </div>
            
            <Button onClick={onLogout} variant="outline" className="mt-2">
              <LogOut className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Sair' : 'Log out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalPendingMessage;
