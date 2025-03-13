
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getTaskById, updateTaskStatus } from '@/services/tasks';
import { Task, TaskStatus } from '@/components/tasks/card/TaskCardTypes';

export const useTaskDetail = (id: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch task data
  const { 
    data: task, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
  
  // Calculate if task is delayed
  const isDelayed = task ? new Date(task.dueDate) < new Date() && task.status === 'pending' : false;
  
  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: TaskStatus }) => 
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task updated',
        description: 'The task status has been updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    },
  });
  
  // Handle status change
  const handleStatusChange = (status: TaskStatus) => {
    if (id) {
      updateTaskMutation.mutate({ id, status });
    }
  };

  return {
    task,
    isLoading,
    isError,
    isDelayed,
    handleStatusChange
  };
};
