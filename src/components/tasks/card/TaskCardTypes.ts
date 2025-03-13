
import { ReactNode } from 'react';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'completed' | 'cancelled';
export type TaskType = 'medication' | 'examination' | 'consultation' | 'procedure' | 'followup';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  dueDate: Date | string;
  patientId: string;
  patientName: string;
  sector: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
  completedBy?: string;
  completedByName?: string;
  completionNotes?: string;
}

export interface TaskCardProps {
  task: Task;
  onMarkComplete?: () => void;
  className?: string;
  showCompletionInfo?: boolean;
}
