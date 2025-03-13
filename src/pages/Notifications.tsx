
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import NotificationsList from '../components/notifications/NotificationsList';
import NotificationFilters from '../components/notifications/NotificationFilters';

const Notifications = () => {
  const { language } = useTranslation();
  const [filter, setFilter] = useState<string>('all');
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-6">
              {language === 'pt' ? 'Notificações' : 'Notifications'}
            </h1>
            
            <div className="glass-card">
              <div className="p-4 border-b">
                <NotificationFilters currentFilter={filter} onFilterChange={setFilter} />
              </div>
              <div className="p-4">
                <NotificationsList filter={filter} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
