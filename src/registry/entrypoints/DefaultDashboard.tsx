
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Activity, Clock, Calendar } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import SectorPatientList from '@/components/patients/SectorPatientList';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useSectorContext } from '@/hooks/useSectorContext';

const DefaultDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { patientsLoading } = useSectorContext();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Activity className="mr-2 h-5 w-5 text-primary" />
              {t('recentActivity', 'Recent Activity')}
            </CardTitle>
            <CardDescription>
              {t('recentEventsAndNotifications', 'Recent events and notifications')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noRecentActivity', 'No recent activity')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              {t('upcomingTasks', 'Upcoming Tasks')}
            </CardTitle>
            <CardDescription>
              {t('scheduledTasksAndReminders', 'Scheduled tasks and reminders')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noUpcomingTasks', 'No upcoming tasks')}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              {t('schedule', 'Schedule')}
            </CardTitle>
            <CardDescription>
              {t('upcomingEvents', 'Upcoming events')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {t('noScheduledEvents', 'No scheduled events')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DefaultDashboard;
