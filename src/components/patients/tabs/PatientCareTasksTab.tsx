
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { ListChecks, CheckCircle2 } from 'lucide-react';

interface CareTask {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  created_at: string;
  completed_at?: string;
  assigned_to?: string;
  completed_by?: string;
}

const PatientCareTasksTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const [careTasks, setCareTasks] = useState<CareTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCareTasks = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('care_tasks')
          .select('*')
          .eq('patient_id', patientId)
          .order('due_date', { ascending: true });
          
        if (error) throw error;
        
        setCareTasks(data || []);
      } catch (err: any) {
        console.error("Error fetching care tasks:", err);
        setError(err.message || "Failed to load care tasks");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCareTasks();
  }, [patientId]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading care tasks: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (careTasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            No care tasks recorded for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Split tasks into active and completed
  const activeTasks = careTasks.filter(task => task.status !== 'completed' && task.status !== 'cancelled');
  const completedTasks = careTasks.filter(task => task.status === 'completed' || task.status === 'cancelled');
  
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-amber-100 text-amber-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {activeTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Care Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTasks.map((task) => (
                <div key={task.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{task.title}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  {task.description && (
                    <div className="text-sm mt-1">{task.description}</div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">
                    {task.due_date && (
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    )}
                    {task.status === 'in_progress' && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        In Progress
                      </span>
                    )}
                  </div>
                  {task.assigned_to && (
                    <div className="text-xs text-muted-foreground mt-1">Assigned to: {task.assigned_to}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div key={task.id} className="border-b pb-3 last:border-0 last:pb-0 opacity-75">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {task.completed_at && (
                          <span>Completed: {new Date(task.completed_at).toLocaleDateString()}</span>
                        )}
                        {task.status === 'cancelled' && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                            Cancelled
                          </span>
                        )}
                      </div>
                      {task.completed_by && (
                        <div className="text-xs text-muted-foreground mt-1">Completed by: {task.completed_by}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientCareTasksTab;
