
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import NotificationItem from './NotificationItem';
import { BellOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockNotifications } from './mockNotifications';

interface NotificationsListProps {
  filter: string;
}

const NotificationsList = ({ filter }: NotificationsListProps) => {
  const { language } = useTranslation();
  
  // Filter notifications based on the selected filter
  const filteredNotifications = mockNotifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'important') return notification.important;
    if (filter === 'archived') return notification.archived;
    return true;
  });
  
  if (filteredNotifications.length === 0) {
    return (
      <Alert className="flex items-center justify-center p-8">
        <BellOff className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
        <AlertDescription className="text-center mt-4">
          {language === 'pt' 
            ? 'Nenhuma notificação encontrada' 
            : 'No notifications found'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredNotifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
    </div>
  );
};

export default NotificationsList;
