
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Pill, Activity, Users, ClipboardList, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import SectorPatientList from '@/components/patients/SectorPatientList';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useSectorContext } from '@/hooks/useSectorContext';

const PharmacistDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { patientsLoading } = useSectorContext();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Painel da Farmácia' : 'Pharmacy Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Pill className="mr-2 h-5 w-5 text-primary" />
              {t('pendingPrescriptions', 'Pending Prescriptions')}
            </CardTitle>
            <CardDescription>
              {t('prescriptionsToVerify', 'Prescriptions to verify')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noPendingPrescriptions', 'No pending prescriptions')}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/prescriptions">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  {t('viewPrescriptions', 'View Prescriptions')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <AlertCircle className="mr-2 h-5 w-5 text-primary" />
              {t('drugInteractions', 'Drug Interactions')}
            </CardTitle>
            <CardDescription>
              {t('interactionAlerts', 'Interaction alerts')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noInteractionsDetected', 'No interactions detected')}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/medications/interactions">
                  <Activity className="mr-2 h-4 w-4" />
                  {t('checkInteractions', 'Check Interactions')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {t('sectorPatients', 'Sector Patients')}
            </CardTitle>
            <CardDescription>
              {t('allPatientsInSector', 'All patients in this sector')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingOverlay 
              isLoading={patientsLoading} 
              text={t('loadingPatients', 'Loading patients...')}
              transparent
            >
              <SectorPatientList 
                className="max-h-96 overflow-y-auto pr-2" 
                limit={5} 
                showViewAll={true} 
              />
            </LoadingOverlay>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg font-medium">
            <Pill className="mr-2 h-5 w-5 text-primary" />
            {t('pharmacyInventory', 'Pharmacy Inventory')}
          </CardTitle>
          <CardDescription>
            {t('criticalStockLevels', 'Critical stock levels')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-900/10 p-3 flex justify-between items-center">
              <div>
                <h4 className="font-medium">Furosemide 40mg Tablet</h4>
                <p className="text-sm text-muted-foreground">{t('lowStock', 'Low stock')} - 25 {t('units', 'units')}</p>
              </div>
              <Button size="sm" variant="outline">
                {t('reorder', 'Reorder')}
              </Button>
            </div>
            
            <div className="rounded-lg border bg-red-50 dark:bg-red-900/10 p-3 flex justify-between items-center">
              <div>
                <h4 className="font-medium">Ceftriaxone 1g Vial</h4>
                <p className="text-sm text-muted-foreground">{t('criticalStock', 'Critical stock')} - 5 {t('units', 'units')}</p>
              </div>
              <Button size="sm" variant="destructive">
                {t('reorderUrgent', 'Reorder (Urgent)')}
              </Button>
            </div>
            
            <div className="rounded-lg border bg-green-50 dark:bg-green-900/10 p-3 flex justify-between items-center">
              <div>
                <h4 className="font-medium">Metoprolol 25mg Tablet</h4>
                <p className="text-sm text-muted-foreground">{t('stockReceived', 'Stock received')} - 200 {t('units', 'units')}</p>
              </div>
              <Button size="sm" variant="ghost">
                {t('details', 'Details')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacistDashboard;
