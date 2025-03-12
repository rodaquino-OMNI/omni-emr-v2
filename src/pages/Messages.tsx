
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { MessageList } from '../components/messages/MessageList';
import { MessageView } from '../components/messages/MessageView';
import { useTranslation } from '../hooks/useTranslation';

const Messages = () => {
  const { language } = useTranslation();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-6">
              {language === 'pt' ? 'Mensagens' : 'Messages'}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border-r border-border pr-4">
                <MessageList 
                  onSelectMessage={(id) => setSelectedMessageId(id)} 
                  selectedMessageId={selectedMessageId}
                />
              </div>
              <div className="md:col-span-2">
                {selectedMessageId ? (
                  <MessageView messageId={selectedMessageId} />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {language === 'pt' ? 'Selecione uma mensagem para visualizar' : 'Select a message to view'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
