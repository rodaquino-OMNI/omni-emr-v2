import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginContainer from '@/components/auth/login/LoginContainer';
import ApprovalPendingMessage from '@/components/auth/ApprovalPendingMessage';

const Login = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  
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
  return <LoginContainer />;
};

export default Login;
