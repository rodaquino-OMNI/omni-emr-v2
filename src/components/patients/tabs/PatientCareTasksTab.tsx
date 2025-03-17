
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Plus, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PatientCareTasksTabProps {
  patientId: string;
}

const PatientCareTasksTab: React.FC<PatientCareTasksTabProps> = ({ patientId }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Simulate loading tasks
    const loadTasks = async () => {
      try {
        // In a real implementation, you would fetch tasks from an API
        // For now, let's simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate empty tasks for now
        setTasks([]);
      } catch (error) {
        console.error('Error loading care tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [patientId]);

  const handleAddTask = () => {
    console.log('Add task for patient:', patientId);
    // Open modal or navigate to task creation page
  };

  if (isLoading) {
    return <TasksLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Care Tasks</h3>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">No care tasks assigned for this patient</p>
            <Button onClick={handleAddTask} className="mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

// Placeholder component for a task card
const TaskCard: React.FC<{ task: any }> = ({ task }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-md">{task.title}</CardTitle>
        <Badge 
          variant={
            task.status === 'completed' ? 'outline' : 
            task.status === 'in_progress' ? 'default' : 
            task.status === 'due' ? 'secondary' :
            'destructive'
          }
        >
          {task.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-muted-foreground">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </p>
        {task.status !== 'completed' && (
          <Button size="sm" variant="outline" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark Complete
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const TasksLoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid gap-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center mt-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PatientCareTasksTab;
