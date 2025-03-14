
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskFooterProps {
  patientId: string;
}

const TaskFooter: React.FC<TaskFooterProps> = ({ patientId }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between border-t pt-4 mt-4">
      <Button variant="ghost" size="sm" className="gap-1" asChild>
        <Link to="/tasks">
          <ArrowLeft className="h-4 w-4" />
          {t('back')} {t('to')} {t('tasks')}
        </Link>
      </Button>
      
      <Button variant="ghost" size="sm" className="gap-1" asChild>
        <Link to={`/patients/${patientId}`}>
          {t('viewPatient')}
        </Link>
      </Button>
    </div>
  );
};

export default TaskFooter;
