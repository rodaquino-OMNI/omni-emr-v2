
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  UserPlus, 
  BarChart, 
  FileText, 
  ClipboardList, 
  PlusCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import SectorPatientList from '@/components/patients/SectorPatientList';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useSectorContext } from '@/hooks/useSectorContext';

const AdminDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { patientsLoading } = useSectorContext();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Painel Administrativo' : 'Administrative Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              {t('todaysAppointments', 'Today\'s Appointments')}
            </CardTitle>
            <CardDescription>
              {t('scheduleForToday', 'Schedule for today')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noAppointmentsToday', 'No appointments today')}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/appointments/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('schedule', 'Schedule')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <UserPlus className="mr-2 h-5 w-5 text-primary" />
              {t('pendingAdmissions', 'Pending Admissions')}
            </CardTitle>
            <CardDescription>
              {t('patientsToAdmit', 'Patients to admit')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noPendingAdmissions', 'No pending admissions')}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/patients/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('newPatient', 'New Patient')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              {t('sectorOccupancy', 'Sector Occupancy')}
            </CardTitle>
            <CardDescription>
              {t('bedCapacityOverview', 'Bed capacity overview')}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                {t('occupancyChartPlaceholder', 'Occupancy chart will appear here')}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <ClipboardList className="mr-2 h-5 w-5 text-primary" />
              {t('pendingReports', 'Pending Reports')}
            </CardTitle>
            <CardDescription>
              {t('administrativeReports', 'Administrative reports')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{t('dailyCensus', 'Daily Census')}</h4>
                  <p className="text-sm text-muted-foreground">{t('dueToday', 'Due today')}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('generate', 'Generate')}
                </Button>
              </div>
              
              <div className="rounded-lg border p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{t('staffingReport', 'Staffing Report')}</h4>
                  <p className="text-sm text-muted-foreground">{t('weeklyReport', 'Weekly report')}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('generate', 'Generate')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
