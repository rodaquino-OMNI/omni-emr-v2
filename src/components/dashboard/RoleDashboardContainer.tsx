
import React from 'react';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, AlertCircle } from 'lucide-react';
import SectorSelectionSkeleton from '@/components/sector/SectorSelectionSkeleton';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      <div className="container max-w-md mx-auto mt-8">
        <Card className="border border-muted/60 shadow-sm">
          <CardHeader className="text-center pb-2">
            <Building className="h-12 w-12 mx-auto text-primary/60 mb-2" />
            <CardTitle className="text-xl">
              {t('sectorSelectionRequired', 'Sector Selection Required')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center pt-2">
            <p className="text-muted-foreground">
              {t('selectSectorFirst', 'Please select a sector to view the dashboard')}
            </p>
            <Button 
              onClick={() => navigate('/sectors')}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {t('selectSector', 'Select Sector')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Display no sectors available message
  if (!selectedSector && sectors.length === 0) {
    return (
      <div className="container max-w-md mx-auto mt-8">
        <Card className="border border-muted/60 shadow-sm">
          <CardHeader className="text-center pb-2">
            <Building className="h-12 w-12 mx-auto text-amber-500/60 mb-2" />
            <CardTitle className="text-xl">
              {t('noSectorsAvailable', 'No Sectors Available')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center pt-2">
            <p className="text-muted-foreground">
              {t('noSectorsMessage', 'There are no sectors available for your account.')}
            </p>
            <Button 
              onClick={() => navigate('/sectors')}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              {t('refreshSectors', 'Refresh Sectors')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render the appropriate dashboard with sector data
  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-muted/30 border-muted">
        <Building className="h-5 w-5 text-primary" />
        <AlertDescription className="text-base flex items-center gap-2">
          <span>
            {t('currentSector', 'Current Sector')}: <span className="font-semibold">{selectedSector?.name}</span>
          </span>
        </AlertDescription>
      </Alert>
      
      <DashboardComponent />
    </div>
  );
};

export default RoleDashboardContainer;
