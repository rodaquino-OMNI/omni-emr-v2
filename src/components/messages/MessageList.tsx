
import React from 'react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MessagePreview = {
  id: string;
  sender: {
    name: string;
    image?: string;
  };
  content: string;
  timestamp: string;
  unread: boolean;
};

// Mock data for the message list
const mockMessages: MessagePreview[] = [
  {
    id: '1',
    sender: {
      name: 'Dr. Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    },
    content: 'Hi, the lab results for John Smith came back. Can we discuss them?',
    timestamp: '2023-12-01T09:30:00Z',
    unread: true,
  },
  {
    id: '2',
    sender: {
      name: 'Nurse Alex Thompson',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    },
    content: 'Patient in room 302 needs assistance with medication.',
    timestamp: '2023-12-01T11:15:00Z',
    unread: false,
  },
  {
    id: '3',
    sender: {
      name: 'Dr. Michael Chen',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    },
    content: 'Are you available for a consult on a patient case this afternoon?',
    timestamp: '2023-12-01T14:45:00Z',
    unread: true,
  },
  {
    id: '4',
    sender: {
      name: 'Admin',
      image: '',
    },
    content: 'Important: Staff meeting tomorrow at 9 AM in the conference room.',
    timestamp: '2023-12-02T08:00:00Z',
    unread: false,
  },
  {
    id: '5',
    sender: {
      name: 'Pharmacy',
      image: '',
    },
    content: 'Medication order for Emily Johnson has been processed.',
    timestamp: '2023-12-02T10:30:00Z',
    unread: false,
  },
];

type MessageListProps = {
  onSelectMessage: (id: string) => void;
  selectedMessageId: string | null;
};

export const MessageList = ({ onSelectMessage, selectedMessageId }: MessageListProps) => {
  const { language } = useTranslation();
  
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { 
      addSuffix: true,
      locale: language === 'pt' ? ptBR : undefined
    });
  };
  
  return (
    <div className="space-y-1">
      {mockMessages.map((message) => (
        <div
          key={message.id}
          onClick={() => onSelectMessage(message.id)}
          className={cn(
            "p-3 rounded-md cursor-pointer transition-colors",
            selectedMessageId === message.id 
              ? "bg-primary/10" 
              : "hover:bg-muted",
            message.unread && "border-l-2 border-primary"
          )}
        >
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={message.sender.image} alt={message.sender.name} />
              <AvatarFallback>{message.sender.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className={cn(
                  "font-medium truncate",
                  message.unread && "font-semibold"
                )}>
                  {message.sender.name}
                </h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatMessageDate(message.timestamp)}
                </span>
              </div>
              
              <p className={cn(
                "text-sm line-clamp-2 text-muted-foreground",
                message.unread && "text-foreground"
              )}>
                {message.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
