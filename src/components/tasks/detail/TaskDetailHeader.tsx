
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const TaskDetailHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-6">
      <Button variant="ghost" size="sm" className="gap-1" asChild>
        <Link to="/tasks">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>
      </Button>
    </div>
  );
};

export default TaskDetailHeader;
