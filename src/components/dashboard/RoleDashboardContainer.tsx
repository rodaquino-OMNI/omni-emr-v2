
import React from 'react';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, AlertCircle } from 'lucide-react';
import SectorSelectionSkeleton from '@/components/sector/SectorSelectionSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RoleDashboardContainer: React.FC = () => {
  const { selectedSector, isLoading, sectors } = useSectorContext();
  const { DashboardComponent, userRole } = useRoleBasedDashboard();
  const { t } = useTranslation();
  
  // Check if user needs a sector
  const isClinicalRole = ['doctor', 'nurse', 'medical_staff'].includes(userRole);
  const needsSector = isClinicalRole && !selectedSector && sectors.length > 0;
  
  // Handle loading state
  if (isLoading) {
    return <SectorSelectionSkeleton />;
  }
  
  // Render the appropriate dashboard with sector data if available
  return (
    <div className="space-y-6">
      {needsSector ? (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('sectorSelectionRequired', 'Please select a sector from the sidebar to view complete dashboard')}
          </AlertDescription>
        </Alert>
      ) : selectedSector && (
        <Alert variant="default" className="bg-muted/30 border-muted">
          <Building className="h-5 w-5 text-primary" />
          <AlertDescription className="text-base flex items-center gap-2">
            <span>
              {t('currentSector', 'Current Sector')}: <span className="font-semibold">{selectedSector?.name}</span>
            </span>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Always show dashboard, even if sector selection is needed */}
      <DashboardComponent />
    </div>
  );
};

export default RoleDashboardContainer;
