
import React from 'react';
import { Task } from './TaskCardTypes';
import { Badge } from '@/components/ui/badge';
import { AlarmClock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskHeaderProps {
  task: Task;
  isDelayed: boolean;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ task, isDelayed }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-medium">{task.title}</h3>
      {task.status === 'completed' ? (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {t('completed')}
        </Badge>
      ) : (
        <Badge variant={isDelayed ? "destructive" : "outline"} className="gap-1">
          {isDelayed && <AlarmClock className="h-3 w-3" />}
          {isDelayed ? t('delayed') : t('onTime')}
        </Badge>
      )}
    </div>
  );
};

export default TaskHeader;
