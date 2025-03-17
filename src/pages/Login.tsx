
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkSupabaseConnection } from '../utils/supabaseConnectivity';
import LoginContainer from '../components/auth/login/LoginContainer';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect directly to dashboard instead of sector selection
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        setIsSupabaseConnected(isConnected);
      } catch (error) {
        console.error('Failed to check Supabase connection:', error);
        setIsSupabaseConnected(false);
      }
    };
    
    checkConnection();
    
    // Set up an interval to periodically check connection
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <LoginContainer 
        isSupabaseConnected={isSupabaseConnected} 
      />
    </div>
  );
};

export default Login;
