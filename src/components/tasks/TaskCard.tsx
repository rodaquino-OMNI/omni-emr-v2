
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { AlarmClock, ChevronRight, Pill, FileText, Stethoscope, UserRound } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
}

interface TaskCardProps {
  task: Task;
  onMarkComplete?: (taskId: string) => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onMarkComplete, className }) => {
  const { t } = useTranslation();
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const isDelayed = dueDate < now && task.status === 'pending';

  // Format date
  const formatTaskDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  };

  // Get task icon based on type
  const getTaskIcon = () => {
    switch (task.type) {
      case 'medication':
        return <Pill className="h-5 w-5" />;
      case 'examination':
        return <FileText className="h-5 w-5" />;
      case 'consultation':
        return <Stethoscope className="h-5 w-5" />;
      case 'procedure':
        return <Stethoscope className="h-5 w-5" />;
      case 'followup':
        return <UserRound className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Get priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className={cn(
      "glass-card p-4 border-l-4 transition-all",
      isDelayed ? "border-l-red-500" : "border-l-blue-500",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-md",
          isDelayed ? "bg-red-100" : "bg-blue-100"
        )}>
          {getTaskIcon()}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium">{task.title}</h3>
            <Badge variant={isDelayed ? "destructive" : "outline"} className="gap-1">
              {isDelayed && <AlarmClock className="h-3 w-3" />}
              {isDelayed ? t('delayed') : t('onTime')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="font-medium">{t('patient')}:</span>
              <Link to={`/patients/${task.patientId}`} className="hover:underline text-primary">
                {task.patientName}
              </Link>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="font-medium">{t('sector')}:</span>
              <span>{task.sector}</span>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="font-medium">{t('dueDate')}:</span>
              <span className={isDelayed ? "text-red-600 font-medium" : ""}>
                {formatTaskDate(task.dueDate)}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="font-medium">{t('priority')}:</span>
              <Badge className={cn("capitalize", getPriorityColor())}>
                {task.priority}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <Link to={`/tasks/${task.id}`}>
                      {t('taskDetails')}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View task details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {task.status === 'pending' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => onMarkComplete && onMarkComplete(task.id)}
              >
                {t('markAsComplete')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
