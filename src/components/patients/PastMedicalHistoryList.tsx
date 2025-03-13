
import React from 'react';
import { FileText, Calendar, User } from 'lucide-react';

type PastMedicalHistoryListProps = {
  patientId: string;
};

type HistoryEntry = {
  id: string;
  date: string;
  provider: string;
  title: string;
  sections: string[];
};

const PastMedicalHistoryList = ({ patientId }: PastMedicalHistoryListProps) => {
  // Mock data - in a real application, this would be fetched from an API
  const historyEntries: HistoryEntry[] = [
    {
      id: '1',
      date: '2023-11-15T14:30:00',
      provider: 'Dr. Sarah Chen',
      title: 'Annual Check-up Update',
      sections: ['Past Medical History', 'Allergies', 'Social History']
    },
    {
      id: '2',
      date: '2023-06-22T10:15:00',
      provider: 'Dr. Michael Johnson',
      title: 'Follow-up Visit Update',
      sections: ['Chief Complaint', 'Present Illness', 'Review of Systems']
    },
    {
      id: '3',
      date: '2022-09-08T09:45:00',
      provider: 'Nurse David Brown',
      title: 'Initial Assessment',
      sections: ['Family History', 'Social History', 'Past Medical History']
    }
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-4">
      {historyEntries.length > 0 ? (
        historyEntries.map((entry) => (
          <div key={entry.id} className="p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{entry.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(entry.date)}
                  </div>
                  <div className="hidden sm:block">•</div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {entry.provider}
                  </div>
                </div>
                
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Sections updated: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.sections.map((section, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No historical updates found for this patient.
        </div>
      )}
    </div>
  );
};

export default PastMedicalHistoryList;
