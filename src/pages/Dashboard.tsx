
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Activity, Calendar, FilePlus, Users, PlusCircle, Clock, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // We'll add sector information based on the selection made
  const sectorId = localStorage.getItem('selectedSector') || 'emergency';
  
  const getSectorName = (id: string): string => {
    const sectorMap: Record<string, string> = {
      'emergency': 'Emergency Department',
      'inpatient': 'Inpatient Ward',
      'outpatient': 'Outpatient Clinic',
      'icu': 'Intensive Care Unit',
      'pediatrics': 'Pediatrics'
    };
    
    return sectorMap[id] || id;
  };

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-muted-foreground">
            {getSectorName(sectorId)} • {new Date().toLocaleDateString()}
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t('changeSector', 'Change Sector')}
          </Button>
        </div>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('todaysPatients', "Today's Patients")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 {t('fromYesterday', 'from yesterday')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('pendingOrders', 'Pending Orders')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              -3 {t('fromYesterday', 'from yesterday')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('urgentTasks', 'Urgent Tasks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 {t('inLastHour', 'in last hour')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('criticalAlerts', 'Critical Alerts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              {t('needsAttention', 'needs immediate attention')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-8">
        {/* Main content - 5/8 columns */}
        <div className="md:col-span-4 lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('quickActions')}</CardTitle>
              <CardDescription>
                {t('quickActionsDesc', 'Frequently used actions for your role')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span>{t('viewPatients', 'View Patients')}</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <FilePlus className="h-5 w-5" />
                  <span>{t('newNote', 'New Note')}</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <PlusCircle className="h-5 w-5" />
                  <span>{t('prescribeMedication')}</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{t('scheduleAppointment', 'Schedule')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-md p-3 hover:bg-accent">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {t('activityTitle' + i, `Example activity ${i + 1}`)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('activityDesc' + i, `Description for activity ${i + 1}`)}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {i === 0 ? '10m ago' : i === 1 ? '1h ago' : i === 2 ? '3h ago' : '5h ago'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar - 3/8 columns */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('upcomingTasks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {t('task' + i, `Task ${i + 1}`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('taskTime' + i, `In ${(i + 1) * 30} minutes`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('criticalAlerts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t('criticalTest', 'Critical Lab Result')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('patientName', 'Patient')}: John Doe
                    </p>
                    <Button size="sm" variant="destructive" className="mt-2">
                      {t('viewDetails', 'View Details')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
