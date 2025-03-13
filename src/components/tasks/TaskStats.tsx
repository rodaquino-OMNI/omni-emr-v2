
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    delayed: number;
  } | undefined;
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  const { t } = useTranslation();
  
  if (!stats) return null;
  
  return (
    <div className="flex flex-wrap gap-3">
      <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
        {t('total')}: {stats.total}
      </div>
      <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
        {t('completed')}: {stats.completed}
      </div>
      <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
        {t('pending')}: {stats.pending}
      </div>
      <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">
        {t('delayed')}: {stats.delayed}
      </div>
    </div>
  );
};

export default TaskStats;
