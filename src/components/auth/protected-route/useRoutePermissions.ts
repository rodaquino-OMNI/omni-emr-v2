
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkPermission } from '@/utils/permissions';

export const useRoutePermissions = (requiredPermission?: string) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState<boolean>(true);

  useEffect(() => {
    // If no permission is required, grant access
    if (!requiredPermission) {
      setHasPermission(true);
      setIsCheckingPermissions(false);
      return;
    }

    // If still loading auth state, wait
    if (isLoading) {
      return;
    }

    // If user is not authenticated, don't have permission
    if (!isAuthenticated || !user) {
      setHasPermission(false);
      setIsCheckingPermissions(false);
      return;
    }

    const checkUserPermission = async () => {
      try {
        // Check if the user has the required permission
        const hasRequiredPermission = await checkPermission(user, requiredPermission);
        setHasPermission(hasRequiredPermission);
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } finally {
        setIsCheckingPermissions(false);
      }
    };

    checkUserPermission();
  }, [user, isAuthenticated, isLoading, requiredPermission, navigate]);

  // Handle permission denied (redirect to unauthorized page)
  useEffect(() => {
    if (
      !isLoading && 
      !isCheckingPermissions && 
      !hasPermission && 
      requiredPermission && 
      isAuthenticated
    ) {
      navigate('/unauthorized', { 
        state: { 
          requiredPermission 
        }
      });
    }
  }, [
    hasPermission, 
    isAuthenticated, 
    isLoading, 
    isCheckingPermissions, 
    navigate, 
    requiredPermission
  ]);

  return {
    hasPermission,
    isCheckingPermissions
  };
};
