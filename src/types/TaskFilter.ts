
import { TaskPriority, TaskStatus, TaskType } from '@/components/tasks/card/TaskCardTypes';

export interface TaskFilter {
  patientId?: string; // Changed from 'patient' to 'patientId' to match service implementation
  status?: TaskStatus; // Using TaskStatus enum instead of string
  priority?: TaskPriority; // Using TaskPriority enum instead of string
  type?: TaskType; // Using TaskType enum instead of string
  searchTerm?: string;
  assignedTo?: string;
  dueDate?: string;
  sector?: string;
  showDelayed?: boolean;
}
