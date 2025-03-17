
import React from 'react';
import { Button } from "@/components/ui/button";
import { Languages } from '@/types/auth';
import { AlertCircle, Loader2 } from 'lucide-react';

interface SocialLoginButtonsProps {
  handleSocialLogin: (provider: 'google' | 'facebook' | 'twitter' | 'azure') => void;
  isLoading: boolean;
  language: Languages;
  isSupabaseConnected: boolean;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  handleSocialLogin,
  isLoading,
  language,
  isSupabaseConnected
}) => {
  return (
    <div className="space-y-4">
      {!isSupabaseConnected && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            {language === 'pt' 
              ? 'Conexão com servidor indisponível. Autenticação social temporariamente desativada.' 
              : 'Server connection unavailable. Social authentication temporarily disabled.'}
          </div>
        </div>
      )}

      <Button
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading || !isSupabaseConnected}
        className="w-full h-11 bg-white text-black hover:bg-gray-100 border border-gray-300 flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {language === 'pt' ? 'Continuar com Google' : 'Continue with Google'}
      </Button>

      <Button
        onClick={() => handleSocialLogin('facebook')}
        disabled={isLoading || !isSupabaseConnected}
        className="w-full h-11 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
            <path
              d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
              fill="white"
            />
          </svg>
        )}
        {language === 'pt' ? 'Continuar com Facebook' : 'Continue with Facebook'}
      </Button>

      <Button
        onClick={() => handleSocialLogin('azure')}
        disabled={isLoading || !isSupabaseConnected}
        className="w-full h-11 bg-[#0078D4] hover:bg-[#0078D4]/90 text-white flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23" fill="none">
            <path d="M1 1h9v9H1V1z" fill="#f25022" />
            <path d="M1 12h9v9H1v-9z" fill="#00a4ef" />
            <path d="M12 1h9v9h-9V1z" fill="#7fba00" />
            <path d="M12 12h9v9h-9v-9z" fill="#ffb900" />
          </svg>
        )}
        {language === 'pt' ? 'Continuar com Microsoft' : 'Continue with Microsoft'}
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
