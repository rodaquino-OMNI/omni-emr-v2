
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/hooks/useTranslation';

interface NotificationFiltersProps {
  currentFilter: string;
  onFilterChange: (value: string) => void;
}

const NotificationFilters = ({ currentFilter, onFilterChange }: NotificationFiltersProps) => {
  const { language } = useTranslation();
  
  return (
    <Tabs defaultValue={currentFilter} onValueChange={onFilterChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-md">
        <TabsTrigger value="all">
          {language === 'pt' ? 'Todas' : 'All'}
        </TabsTrigger>
        <TabsTrigger value="unread">
          {language === 'pt' ? 'Não lidas' : 'Unread'}
        </TabsTrigger>
        <TabsTrigger value="important">
          {language === 'pt' ? 'Importantes' : 'Important'}
        </TabsTrigger>
        <TabsTrigger value="archived">
          {language === 'pt' ? 'Arquivadas' : 'Archived'}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NotificationFilters;
