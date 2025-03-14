
import React from 'react';
import { CriticalResultsList } from '@/components/critical-results/CriticalResultsList';
import { useCriticalResults } from '@/hooks/useCriticalResults';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/utils/permissions/roleChecks';

export default function CriticalResults() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { 
    results, 
    isLoading, 
    acknowledgeCriticalResult, 
    unacknowledgedCount 
  } = useCriticalResults();
  
  // Check if user has permission to view and manage critical results
  const canViewCriticalResults = hasPermission(user, 'view_critical_results');
  
  if (!canViewCriticalResults) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t('unauthorizedAccess')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <span>{t('criticalResultsManagement')}</span>
            {unacknowledgedCount > 0 && (
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {unacknowledgedCount} {t('unacknowledged')}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CriticalResultsList
            results={results}
            onAcknowledge={acknowledgeCriticalResult}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
