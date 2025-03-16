
import React from 'react';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import SectorSelectionSkeleton from '@/components/sector/SectorSelectionSkeleton';

const RoleDashboardContainer: React.FC = () => {
  const { selectedSector, isLoading } = useSectorContext();
  const { DashboardComponent } = useRoleBasedDashboard();
  const { t } = useTranslation();
  
  // Handle loading state
  if (isLoading) {
    return <SectorSelectionSkeleton />;
  }
  
  // Require sector selection first
  if (!selectedSector) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          {t('selectSectorFirst', 'Please select a sector first')}
        </p>
      </Card>
    );
  }
  
  // Render the appropriate dashboard
  return <DashboardComponent />;
};

export default RoleDashboardContainer;
