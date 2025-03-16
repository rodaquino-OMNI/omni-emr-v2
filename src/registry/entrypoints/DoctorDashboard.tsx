
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FileText, Calendar, Activity, Pill, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import SectorPatientList from '@/components/patients/SectorPatientList';
import SectorPatientListSkeleton from '@/components/patients/SectorPatientListSkeleton';
import { useSectorContext } from '@/hooks/useSectorContext';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

const DoctorDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { patientsLoading } = useSectorContext();
  const [activeTab, setActiveTab] = React.useState('orders');
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Painel do Médico' : 'Physician Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <User className="mr-2 h-5 w-5 text-primary" />
              {t('myPatients', 'My Patients')}
            </CardTitle>
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
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              {t('pendingDocumentation', 'Pending Documentation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noDocumentation', 'No pending documentation')}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/clinical-notes/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('newNote', 'New Note')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              {t('criticalResults', 'Critical Results')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noCriticalResults', 'No pending critical results')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="orders">{t('orders', 'Orders')}</TabsTrigger>
          <TabsTrigger value="medications">{t('medications', 'Medications')}</TabsTrigger>
          <TabsTrigger value="appointments">{t('appointments', 'Appointments')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {t('noPendingOrders', 'No pending orders')}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/orders/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('newOrder', 'New Order')}
              </Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="medications" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {t('noMedicationsToReview', 'No medications to review')}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/medications/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('newPrescription', 'New Prescription')}
              </Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {t('noAppointmentsToday', 'No appointments today')}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                {t('viewCalendar', 'View Calendar')}
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
