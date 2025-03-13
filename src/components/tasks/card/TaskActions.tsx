
import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from './TaskCardTypes';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskActionsProps {
  task: Task;
  onMarkComplete?: () => void;
}

const TaskActions: React.FC<TaskActionsProps> = ({ task, onMarkComplete }) => {
  const { t } = useTranslation();

  return (
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
            <p>{t('viewTaskDetails')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {task.status === 'pending' && onMarkComplete && (
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={onMarkComplete}
        >
          <CheckCircle2 className="h-4 w-4" />
          {t('markAsComplete')}
        </Button>
      )}
    </div>
  );
};

export default TaskActions;
