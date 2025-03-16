
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginContainer from '@/components/auth/login/LoginContainer';
import ApprovalPendingMessage from '@/components/auth/ApprovalPendingMessage';
import { useTranslation } from '@/hooks/useTranslation';
import { checkConnectivity } from '@/utils/supabaseConnectivity';
import { toast } from 'sonner';

const Login = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, language } = useTranslation();
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Safely check Supabase connection
    const checkConnection = async () => {
      try {
        const isConnected = await checkConnectivity();
        setIsSupabaseConnected(isConnected);
        
        if (!isConnected) {
          toast.error('Database Connection Error', {
            description: 'Cannot connect to the database. Some features may not work properly.',
          });
        }
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsSupabaseConnected(false);
        
        toast.error('Connection Check Failed', {
          description: 'Could not verify database connection status.',
        });
      }
    };
    
    checkConnection();
  }, []);
  
  useEffect(() => {
    // Check if user is authenticated but has a pending approval status
    if (user && user.approvalStatus === 'pending') {
      setIsPendingApproval(true);
    } else {
      setIsPendingApproval(false);
    }
  }, [user]);
  
  // If user is authenticated and not pending approval, redirect to dashboard
  if (isAuthenticated && !isPendingApproval) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user is authenticated but pending approval, show pending approval message
  if (isAuthenticated && isPendingApproval) {
    return <ApprovalPendingMessage onLogout={logout} />;
  }
  
  // Otherwise, show login container
  return <LoginContainer 
    t={t} 
    language={language} 
    isSupabaseConnected={isSupabaseConnected}
    setIsSupabaseConnected={setIsSupabaseConnected}
  />;
};

export default Login;
