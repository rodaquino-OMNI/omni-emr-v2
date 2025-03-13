
import { Task } from "@/components/tasks/card/TaskCardTypes";
import { mockTasks } from "./mockTasks";

// Update a task's status with completion information
export const completeTask = async (
  taskId: string, 
  userId: string, 
  userName: string, 
  notes?: string
): Promise<Task | undefined> => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex >= 0) {
    const now = new Date().toISOString();
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      status: 'completed',
      completedAt: now,
      completedBy: userId,
      completedByName: userName,
      completionNotes: notes,
      updatedAt: now,
    };
    return mockTasks[taskIndex];
  }
  return undefined;
};

// Get all completed tasks
export const getCompletedTasks = async (): Promise<Task[]> => {
  return mockTasks.filter(task => task.status === 'completed');
};

// Get completed tasks by user ID
export const getCompletedTasksByUser = async (userId: string): Promise<Task[]> => {
  return mockTasks.filter(task => task.status === 'completed' && task.completedBy === userId);
};

// Get completion statistics for tasks
export const getTaskCompletionStats = async (): Promise<{
  total: number;
  completed: number;
  pending: number;
  delayed: number;
  completionRate: number;
}> => {
  const now = new Date();
  
  const total = mockTasks.length;
  const completed = mockTasks.filter(task => task.status === 'completed').length;
  const pending = mockTasks.filter(task => task.status === 'pending').length;
  
  // Delayed tasks are pending tasks with a due date in the past
  const delayed = mockTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return task.status === 'pending' && dueDate < now;
  }).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    pending,
    delayed,
    completionRate
  };
};
