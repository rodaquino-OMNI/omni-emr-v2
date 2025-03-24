import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSectorContext } from '@/hooks/useSectorContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Calendar, ClipboardList, Users } from 'lucide-react';
import SectorPatientList from '@/components/patients/SectorPatientList';
import TasksCard from './cards/TasksCard';
import VitalSignsCard from './cards/VitalSignsCard';
import ScheduleCard from './cards/ScheduleCard';

const DefaultDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { selectedSector } = useSectorContext();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalPatients', 'Total Patients')}
            </CardTitle>
            <CardDescription>
              {t('inCurrentSector', 'In current sector')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 {language === 'pt' ? 'desde ontem' : 'since yesterday'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('criticalPatients', 'Critical Patients')}
            </CardTitle>
            <CardDescription>
              {t('requiresAttention', 'Requires immediate attention')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
            <p className="text-xs text-muted-foreground">
              -1 {language === 'pt' ? 'desde ontem' : 'since yesterday'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('pendingTasks', 'Pending Tasks')}
            </CardTitle>
            <CardDescription>
              {t('forCurrentSector', 'For current sector')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              +3 {language === 'pt' ? 'desde ontem' : 'since yesterday'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{t('patients', 'Patients')}</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>{t('tasks', 'Tasks')}</span>
          </TabsTrigger>
          <TabsTrigger value="vital-signs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>{t('vitalSigns', 'Vital Signs')}</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{t('schedule', 'Schedule')}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">
              {t('patientsInSector', 'Patients in Sector')}
            </h2>
            <Button variant="outline" size="sm">
              {t('viewAll', 'View All')}
            </Button>
          </div>
          
          <SectorPatientList 
            limit={5}
            showViewAll={true}
          />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TasksCard limit={5} />
        </TabsContent>
        
        <TabsContent value="vital-signs">
          <VitalSignsCard limit={5} />
        </TabsContent>
        
        <TabsContent value="schedule">
          <ScheduleCard limit={5} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DefaultDashboard;
