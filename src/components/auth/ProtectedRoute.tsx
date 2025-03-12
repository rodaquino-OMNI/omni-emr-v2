
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredPermission 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <h1 className="text-2xl font-semibold text-primary">MedCare</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredPermission && user) {
    // Check if the user has the required permission
    const hasPermission = user.role === 'admin' || 
                          user.permissions.includes('all') || 
                          user.permissions.includes(requiredPermission);
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
