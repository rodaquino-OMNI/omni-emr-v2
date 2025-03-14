
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertTriangle, Check, Star, Clock, Archive, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Notification } from './mockNotifications';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { language } = useTranslation();
  
  const handleMarkAsRead = () => {
    // In a real app, this would update the notification in the backend
    toast.success(
      language === 'pt' ? 'Notificação marcada como lida' : 'Notification marked as read'
    );
  };
  
  const handleToggleImportant = () => {
    // In a real app, this would update the notification in the backend
    toast.success(
      notification.important 
        ? (language === 'pt' ? 'Removido dos importantes' : 'Removed from important') 
        : (language === 'pt' ? 'Marcado como importante' : 'Marked as important')
    );
  };
  
  const handleArchive = () => {
    // In a real app, this would update the notification in the backend
    toast.success(
      language === 'pt' ? 'Notificação arquivada' : 'Notification archived'
    );
  };
  
  const formattedTime = formatDistanceToNow(new Date(notification.timestamp), { 
    addSuffix: true,
    locale: language === 'pt' ? ptBR : enUS
  });
  
  return (
    <Card className={`p-4 transition-all ${notification.read ? 'bg-card' : 'bg-primary/5 border-l-4 border-l-primary'}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full shrink-0 ${getIconBackground(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-muted-foreground text-sm my-1">{notification.message}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <Clock className="h-3 w-3" />
                <span>{formattedTime}</span>
              </div>
            </div>
            
            {notification.important && (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 ml-2" />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        {!notification.read && (
          <Button variant="outline" size="sm" onClick={handleMarkAsRead}>
            <Check className="h-4 w-4 mr-1" />
            {language === 'pt' ? 'Marcar como lida' : 'Mark as read'}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleToggleImportant}
          title={language === 'pt' ? 'Marcar como importante' : 'Mark as important'}
        >
          <Star className={`h-4 w-4 ${notification.important ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleArchive}
          title={language === 'pt' ? 'Arquivar' : 'Archive'}
        >
          <Archive className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

function getNotificationIcon(type: string) {
  switch (type) {
    case 'appointment':
      return <Clock className="h-5 w-5 text-blue-500" />;
    case 'medication':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'system':
      return <Check className="h-5 w-5 text-green-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
  }
}

function getIconBackground(type: string) {
  switch (type) {
    case 'appointment':
      return 'bg-blue-100 dark:bg-blue-900/20';
    case 'medication':
      return 'bg-amber-100 dark:bg-amber-900/20';
    case 'system':
      return 'bg-green-100 dark:bg-green-900/20';
    default:
      return 'bg-red-100 dark:bg-red-900/20';
  }
}

export default NotificationItem;
