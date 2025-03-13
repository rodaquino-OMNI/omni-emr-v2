
import { Task, TaskPriority, TaskStatus, TaskType } from "@/components/tasks/card/TaskCardTypes";
import { mockTasks } from "./mockTasks";

// Filter tasks by multiple criteria
export interface TaskFilter {
  patientId?: string;
  sector?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  showDelayed?: boolean;
}

export const filterTasks = async (filter: TaskFilter): Promise<Task[]> => {
  let filteredTasks = [...mockTasks];
  
  if (filter.patientId) {
    filteredTasks = filteredTasks.filter(task => task.patientId === filter.patientId);
  }
  
  if (filter.sector) {
    filteredTasks = filteredTasks.filter(task => task.sector === filter.sector);
  }
  
  if (filter.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filter.status);
  }
  
  if (filter.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
  }
  
  if (filter.type) {
    filteredTasks = filteredTasks.filter(task => task.type === filter.type);
  }
  
  if (filter.showDelayed) {
    const now = new Date();
    filteredTasks = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.status === 'pending';
    });
  }
  
  // Sort by due date (ascending)
  filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  return filteredTasks;
};
