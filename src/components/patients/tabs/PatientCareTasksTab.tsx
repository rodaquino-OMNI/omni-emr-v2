
import React from 'react';
import { PatientCareTasksTabProps } from './index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const PatientCareTasksTab: React.FC<PatientCareTasksTabProps> = ({ patientId }) => {
  const { t } = useTranslation();
  
  // Placeholder for care tasks - would be fetched from API in a real implementation
  const careTasks = [
    {
      id: '1',
      title: 'Daily health check',
      status: 'completed',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Nurse Johnson'
    },
    {
      id: '2',
      title: 'Medication administration',
      status: 'pending',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Nurse Smith'
    },
    {
      id: '3',
      title: 'Physical therapy session',
      status: 'scheduled',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Dr. Williams'
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('careTasks', 'Care Tasks')}</h2>
        <Button size="sm" className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          {t('newTask', 'New Task')}
        </Button>
      </div>
      
      {careTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {t('noCareTasks', 'No care tasks found for this patient.')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {careTasks.map(task => (
            <Card key={task.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">
                    {t('assignedTo', 'Assigned to')}: {task.assignedTo}
                  </p>
                  <p className="text-muted-foreground">
                    {t('due', 'Due')}: {new Date(task.dueDate).toLocaleString()}
                  </p>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    {t('details', 'Details')}
                  </Button>
                  {task.status !== 'completed' && (
                    <Button size="sm">
                      {t('markComplete', 'Mark Complete')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientCareTasksTab;
