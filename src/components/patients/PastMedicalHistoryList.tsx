
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMedicalHistory } from './medical-history/hooks/useMedicalHistory';
import HistoryEntryCard from './medical-history/components/HistoryEntryCard';
import LoadingHistoryState from './medical-history/components/LoadingHistoryState';
import EmptyHistoryState from './medical-history/components/EmptyHistoryState';

type PastMedicalHistoryListProps = {
  patientId: string;
};

const PastMedicalHistoryList = ({ patientId }: PastMedicalHistoryListProps) => {
  const { user } = useAuth();
  const { historyEntries, loading } = useMedicalHistory(patientId, user?.id);
  
  if (loading) {
    return <LoadingHistoryState />;
  }

  return (
    <div className="space-y-4">
      {historyEntries.length > 0 ? (
        historyEntries.map((entry) => (
          <HistoryEntryCard 
            key={entry.id} 
            entry={{
              id: entry.id,
              date: entry.createdAt.toISOString(),
              provider: entry.createdBy.name,
              title: entry.title,
              sections: entry.details?.changes || [],
              notes: entry.details?.notes,
              status: 'completed',
              version: '1.0',
              resource_type: entry.type || 'ClinicalDocument'
            }} 
          />
        ))
      ) : (
        <EmptyHistoryState />
      )}
    </div>
  );
};

export default PastMedicalHistoryList;
