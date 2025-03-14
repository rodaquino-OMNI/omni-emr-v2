
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskActionsSectionProps {
  status: string;
  onStatusChange: (status: 'pending' | 'completed' | 'cancelled') => void;
}

const TaskActionsSection: React.FC<TaskActionsSectionProps> = ({ status, onStatusChange }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('taskActions')}</h3>
      <div className="flex flex-wrap gap-2">
        {status === 'pending' && (
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => onStatusChange('completed')}
          >
            <CheckCircle className="h-4 w-4" />
            {t('markAsComplete')}
          </Button>
        )}
        
        {status === 'completed' && (
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => onStatusChange('pending')}
          >
            {t('reopenTask')}
          </Button>
        )}
        
        {status !== 'cancelled' && (
          <Button 
            variant="outline" 
            className="gap-1 text-destructive"
            onClick={() => onStatusChange('cancelled')}
          >
            {t('cancelTask')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskActionsSection;
