
import React from 'react';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import SectorSelectionSkeleton from '@/components/sector/SectorSelectionSkeleton';
import { useNavigate } from 'react-router-dom';

const RoleDashboardContainer: React.FC = () => {
  const { selectedSector, isLoading, sectors } = useSectorContext();
  const { DashboardComponent } = useRoleBasedDashboard();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Handle loading state
  if (isLoading) {
    return <SectorSelectionSkeleton />;
  }
  
  // Require sector selection first if sectors exist
  if (!selectedSector && sectors.length > 0) {
    return (
      <Card className="p-6 text-center space-y-4 max-w-md mx-auto">
        <Building className="h-12 w-12 mx-auto text-primary/50" />
        <h2 className="text-xl font-semibold">
          {t('sectorSelectionRequired', 'Sector Selection Required')}
        </h2>
        <p className="text-muted-foreground">
          {t('selectSectorFirst', 'Please select a sector to view the dashboard')}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/sectors')}>
            {t('selectSector', 'Select Sector')}
          </Button>
        </div>
      </Card>
    );
  }
  
  // Display no sectors available message
  if (!selectedSector && sectors.length === 0) {
    return (
      <Card className="p-6 text-center space-y-4 max-w-md mx-auto">
        <Building className="h-12 w-12 mx-auto text-amber-500/50" />
        <h2 className="text-xl font-semibold">
          {t('noSectorsAvailable', 'No Sectors Available')}
        </h2>
        <p className="text-muted-foreground">
          {t('noSectorsMessage', 'There are no sectors available for your account.')}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/sectors')}>
            {t('refreshSectors', 'Refresh Sectors')}
          </Button>
        </div>
      </Card>
    );
  }
  
  // Render the appropriate dashboard with sector data
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <span>
            {t('currentSector', 'Current Sector')}: <span className="font-semibold">{selectedSector?.name}</span>
          </span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{selectedSector?.description}</p>
      </div>
      
      <DashboardComponent />
    </div>
  );
};

export default RoleDashboardContainer;
