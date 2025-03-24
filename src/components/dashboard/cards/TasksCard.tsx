import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { filterTasks } from '@/services/tasks';
import { Task } from '@/components/tasks/TaskCard';
import TaskCard from '@/components/tasks/TaskCard';
import { useSectorContext } from '@/hooks/useSectorContext';

interface TasksCardProps {
  limit?: number;
}

const TasksCard: React.FC<TasksCardProps> = ({ limit = 3 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedSector } = useSectorContext();
  
  // Fetch tasks with React Query for efficient caching
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', { limit, sector: selectedSector?.id }],
    queryFn: async () => {
      const allTasks = await filterTasks({
        sector: selectedSector?.id,
        status: 'pending'
      });
      // Apply limit client-side
      return allTasks.slice(0, limit);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleViewAll = () => {
    navigate('/tasks');
  };
  
  const handleTaskClick = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium flex items-center">
            <ListChecks className="h-4 w-4 mr-2 text-primary" />
            {t('tasks')}
          </CardTitle>
          <CardDescription>
            {t('pendingTasks')}
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleViewAll}
          className="text-xs"
        >
          {t('viewAll')}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  className="cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <TaskCard 
                    task={task} 
                    className="hover:bg-muted/50 transition-colors"
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('noTasksMessage', 'No pending tasks')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksCard;