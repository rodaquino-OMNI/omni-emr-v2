
import React from 'react';
import { FileText, Calendar, User, Shield } from 'lucide-react';

type HistoryEntry = {
  id: string;
  date: string;
  provider: string;
  title: string;
  sections?: string[];
  notes?: string;
  status: string;
  version: string;
  resource_type: string;
};

interface HistoryEntryCardProps {
  entry: HistoryEntry;
}

const HistoryEntryCard = ({ entry }: HistoryEntryCardProps) => {
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
    <div className="p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{entry.title}</h3>
            <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              <Shield className="h-3 w-3" />
              FHIR {entry.resource_type}
            </div>
          </div>
          
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
          
          {entry.notes && (
            <div className="mt-3 text-sm text-muted-foreground border-l-2 border-muted pl-3">
              {entry.notes}
            </div>
          )}
          
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Sections updated: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {entry.sections?.map((section, index) => (
                <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {section}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryEntryCard;
