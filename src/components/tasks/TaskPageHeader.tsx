
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import TaskStats from './TaskStats';

interface TaskPageHeaderProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    delayed: number;
  } | undefined;
}

const TaskPageHeader: React.FC<TaskPageHeaderProps> = ({ stats }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-semibold">{t('tasks')}</h1>
      {stats && <TaskStats stats={stats} />}
    </div>
  );
};

export default TaskPageHeader;
