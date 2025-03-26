
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
;
;
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTaskDetail } from '@/components/tasks/detail/useTaskDetail';
import TaskDetailHeader from '@/components/tasks/detail/TaskDetailHeader';
import TaskDetailCard from '@/components/tasks/detail/TaskDetailCard';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  
  // Use the custom hook to manage task data and actions
  const { task, isLoading, isError, isDelayed, handleStatusChange } = useTaskDetail(id!);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto w-full">
            <div className="max-w-3xl mx-auto w-full">
              <div>Loading...</div>
            </div>
          </div>
    );
  }
  
  // Error state
  if (isError || !task) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
            <div className="max-w-3xl mx-auto w-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Task not found</h2>
                <p className="text-muted-foreground mb-4">
                  The task you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <Button asChild>
                  <Link to="/tasks">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tasks
                  </Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-3xl mx-auto w-full">
            <TaskDetailHeader />
            <TaskDetailCard 
              task={task} 
              isDelayed={isDelayed} 
              onStatusChange={handleStatusChange} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetail;
