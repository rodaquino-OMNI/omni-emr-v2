
import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { getQuickActions } from '../data/quickActionsData';
import { useTranslation } from '@/hooks/useTranslation';
import type { QuickAction } from '../types/quickActionTypes';

export const useQuickActions = () => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const permissions = usePermissions(user);
  
  // Get all quick actions with translations applied
  const allQuickActions = useMemo(() => getQuickActions(language), [language]);
  
  // Filter actions based on user permissions and role
  const filteredActions = useMemo(() => {
    return allQuickActions.filter(action => {
      // If no user, don't show any actions
      if (!user) return false;
      
      // Check role-specific visibility
      if (action.roles && !action.roles.includes(user.role)) {
        return false;
      }
      
      // Check permission if required
      if (action.permissionRequired && !permissions.hasPermission(action.permissionRequired)) {
        return false;
      }
      
      return true;
    });
  }, [allQuickActions, user, permissions]);
  
  // Limit to 4 most relevant actions for each role
  const displayActions = useMemo(() => {
    return filteredActions.slice(0, 4);
  }, [filteredActions]);
  
  return {
    displayActions,
    hasActions: displayActions.length > 0
  };
};
