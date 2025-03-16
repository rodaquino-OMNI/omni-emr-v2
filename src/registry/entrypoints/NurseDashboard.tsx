
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Pill, HeartPulse, ClipboardCheck, PlusCircle, Droplet, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import SectorPatientList from '@/components/patients/SectorPatientList';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useSectorContext } from '@/hooks/useSectorContext';

const NurseDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { patientsLoading } = useSectorContext();
  const [activeTab, setActiveTab] = React.useState('tasks');
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Painel de Enfermagem' : 'Nursing Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {t('assignedPatients', 'Assigned Patients')}
            </CardTitle>
            <CardDescription>
              {t('yourCurrentPatients', 'Your current patients')}
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
              <Pill className="mr-2 h-5 w-5 text-primary" />
              {t('pendingMedications', 'Pending Medications')}
            </CardTitle>
            <CardDescription>
              {t('medicationsToAdminister', 'Medications to administer')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noPendingMedications', 'No pending medications')}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/medications/administration">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  {t('viewMAR', 'View MAR')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <HeartPulse className="mr-2 h-5 w-5 text-primary" />
              {t('vitalSigns', 'Vital Signs')}
            </CardTitle>
            <CardDescription>
              {t('vitalSignsToDocument', 'Vital signs to document')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('allVitalSignsDocumented', 'All vital signs documented')}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/vitals">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('newEntry', 'New Entry')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="tasks">{t('tasks', 'Tasks')}</TabsTrigger>
          <TabsTrigger value="assessments">{t('assessments', 'Assessments')}</TabsTrigger>
          <TabsTrigger value="fluid-balance">{t('fluidBalance', 'Fluid Balance')}</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {t('noPendingTasks', 'No pending tasks')}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="assessments" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {t('noPendingAssessments', 'No pending assessments')}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/assessments/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('newAssessment', 'New Assessment')}
              </Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="fluid-balance" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {t('noPendingEntries', 'No pending entries')}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/fluid-balance">
                <Droplet className="mr-2 h-4 w-4" />
                {t('fluidBalance', 'Fluid Balance')}
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NurseDashboard;
