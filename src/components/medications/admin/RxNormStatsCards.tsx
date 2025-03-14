
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/useTranslation';
import { DatabaseStats } from './useRxNormStats';

interface RxNormStatsCardsProps {
  stats: DatabaseStats;
  formatDate: (date: Date | null) => string;
}

const RxNormStatsCards: React.FC<RxNormStatsCardsProps> = ({ stats, formatDate }) => {
  const { language } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {language === 'pt' ? 'Medicamentos' : 'Medications'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMedications.toLocaleString()}</div>
          <Progress className="h-1 mt-2" value={Math.min(stats.totalMedications / 100, 100)} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {language === 'pt' ? 'Mapeamentos ANVISA' : 'ANVISA Mappings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMappings.toLocaleString()}</div>
          <Progress 
            className="h-1 mt-2" 
            value={Math.min((stats.totalMappings / stats.totalMedications) * 100, 100)} 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {language === 'pt' ? 'Cache' : 'Cache'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCacheEntries.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {language === 'pt' ? 'Última sincronização:' : 'Last sync:'}
            {' '}{formatDate(stats.lastSyncDate)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RxNormStatsCards;
