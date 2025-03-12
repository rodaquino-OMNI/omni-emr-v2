
import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from "@/components/ui/use-toast";

type Message = {
  id: string;
  sender: {
    id: string;
    name: string;
    image?: string;
    role: string;
  };
  content: string;
  timestamp: string;
};

type MessageThread = {
  id: string;
  participants: {
    id: string;
    name: string;
    image?: string;
    role: string;
  }[];
  messages: Message[];
  subject: string;
};

// Mock data for message threads
const mockThreads: Record<string, MessageThread> = {
  '1': {
    id: '1',
    subject: 'Patient Lab Results',
    participants: [
      {
        id: 'user1',
        name: 'Dr. Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
        role: 'Doctor'
      },
      {
        id: 'current-user',
        name: 'You',
        image: '',
        role: 'Doctor'
      }
    ],
    messages: [
      {
        id: 'm1',
        sender: {
          id: 'user1',
          name: 'Dr. Sarah Johnson',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
          role: 'Doctor'
        },
        content: 'Hi, the lab results for John Smith came back. His blood glucose levels are above normal range. Can we discuss the treatment plan?',
        timestamp: '2023-12-01T09:30:00Z'
      }
    ]
  },
  '2': {
    id: '2',
    subject: 'Patient Assistance',
    participants: [
      {
        id: 'user2',
        name: 'Nurse Alex Thompson',
        image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
        role: 'Nurse'
      },
      {
        id: 'current-user',
        name: 'You',
        image: '',
        role: 'Doctor'
      }
    ],
    messages: [
      {
        id: 'm1',
        sender: {
          id: 'user2',
          name: 'Nurse Alex Thompson',
          image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
          role: 'Nurse'
        },
        content: 'Patient in room 302 needs assistance with medication. He\'s experiencing some discomfort with the current dosage.',
        timestamp: '2023-12-01T11:15:00Z'
      }
    ]
  },
  '3': {
    id: '3',
    subject: 'Consultation Request',
    participants: [
      {
        id: 'user3',
        name: 'Dr. Michael Chen',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        role: 'Doctor'
      },
      {
        id: 'current-user',
        name: 'You',
        image: '',
        role: 'Doctor'
      }
    ],
    messages: [
      {
        id: 'm1',
        sender: {
          id: 'user3',
          name: 'Dr. Michael Chen',
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          role: 'Doctor'
        },
        content: 'Are you available for a consult on a patient case this afternoon? I have a complex cardiac patient who might benefit from your expertise.',
        timestamp: '2023-12-01T14:45:00Z'
      }
    ]
  },
  '4': {
    id: '4',
    subject: 'Staff Meeting Reminder',
    participants: [
      {
        id: 'admin',
        name: 'Admin',
        role: 'Administrator'
      },
      {
        id: 'current-user',
        name: 'You',
        image: '',
        role: 'Doctor'
      }
    ],
    messages: [
      {
        id: 'm1',
        sender: {
          id: 'admin',
          name: 'Admin',
          image: '',
          role: 'Administrator'
        },
        content: 'Important: Staff meeting tomorrow at 9 AM in the conference room. We will be discussing the new patient management system implementation.',
        timestamp: '2023-12-02T08:00:00Z'
      }
    ]
  },
  '5': {
    id: '5',
    subject: 'Medication Order',
    participants: [
      {
        id: 'pharmacy',
        name: 'Pharmacy',
        role: 'Pharmacy'
      },
      {
        id: 'current-user',
        name: 'You',
        image: '',
        role: 'Doctor'
      }
    ],
    messages: [
      {
        id: 'm1',
        sender: {
          id: 'pharmacy',
          name: 'Pharmacy',
          image: '',
          role: 'Pharmacy'
        },
        content: 'Medication order for Emily Johnson has been processed. The medication will be delivered to the ward in the next hour.',
        timestamp: '2023-12-02T10:30:00Z'
      }
    ]
  }
};

type MessageViewProps = {
  messageId: string;
};

export const MessageView = ({ messageId }: MessageViewProps) => {
  const { language } = useTranslation();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  
  const thread = mockThreads[messageId];
  
  if (!thread) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        {language === 'pt' ? 'Mensagem não encontrada' : 'Message not found'}
      </div>
    );
  }
  
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { 
      addSuffix: true,
      locale: language === 'pt' ? ptBR : undefined
    });
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would be calling an API to send the message
    toast({
      title: language === 'pt' ? 'Mensagem enviada' : 'Message sent',
      description: language === 'pt' ? 'Sua resposta foi enviada com sucesso' : 'Your response has been sent successfully'
    });
    
    setNewMessage('');
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border pb-4 mb-4">
        <h2 className="text-xl font-medium">{thread.subject}</h2>
        <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
          {thread.participants
            .filter(p => p.id !== 'current-user')
            .map((participant, i) => (
              <span key={participant.id}>
                {i > 0 && ', '}
                {participant.name} ({participant.role})
              </span>
            ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {thread.messages.map((message) => (
          <div key={message.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={message.sender.image} alt={message.sender.name} />
              <AvatarFallback>{message.sender.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="font-medium">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {message.sender.role}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatMessageDate(message.timestamp)}
                </span>
              </div>
              
              <div className="text-sm">
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto border-t border-border pt-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={language === 'pt' ? 'Digite sua resposta...' : 'Type your reply...'}
            className="flex-1 resize-none"
            rows={3}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Enviar' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};
