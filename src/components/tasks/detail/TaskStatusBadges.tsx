
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskStatusBadgesProps {
  priority: string;
  status: string;
}

const TaskStatusBadges: React.FC<TaskStatusBadgesProps> = ({ priority, status }) => {
  const { t } = useTranslation();
  
  // Get priority badge style
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">{t('lowPriority')}</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('mediumPriority')}</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">{t('highPriority')}</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{t('urgentPriority')}</Badge>;
      default:
        return <Badge variant="outline">{t('unknown')}</Badge>;
    }
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('pending')}</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{t('completed')}</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">{t('cancelled')}</Badge>;
      default:
        return <Badge variant="outline">{t('unknown')}</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getPriorityBadge(priority)}
      {getStatusBadge(status)}
    </div>
  );
};

export default TaskStatusBadges;
