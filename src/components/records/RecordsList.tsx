
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import RecordCard from './RecordCard';
import { FileText, Calendar, ClipboardList } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

type RecordsListProps = {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  patientId?: string;
  searchTerm?: string;
  typeFilter?: string;
};

// Sample records data
const sampleRecords = [
  {
    id: '1',
    title: 'Complete Blood Count',
    type: 'lab',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    provider: 'Dr. Sarah Chen',
    patientId: '1'
  },
  {
    id: '2',
    title: 'Chest X-Ray',
    type: 'imaging',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    provider: 'Radiology Dept',
    patientId: '1'
  },
  {
    id: '3',
    title: 'Annual Physical Examination',
    type: 'visit',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
    provider: 'Dr. Michael Johnson',
    patientId: '2'
  },
  {
    id: '4',
    title: 'Lipid Panel',
    type: 'lab',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
    provider: 'Lab Services',
    patientId: '3'
  },
  {
    id: '5',
    title: 'EKG Results',
    type: 'procedure',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), // 3 weeks ago
    provider: 'Cardiology Dept',
    patientId: '2'
  },
  {
    id: '6',
    title: 'MRI Brain',
    type: 'imaging',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    provider: 'Imaging Center',
    patientId: '4'
  },
  {
    id: '7',
    title: 'Discharge Summary',
    type: 'discharge',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
    provider: 'Dr. Emily Jackson',
    patientId: '1'
  }
];

const RecordsList = ({
  className,
  limit,
  showViewAll = false,
  patientId,
  searchTerm = '',
  typeFilter = 'all'
}: RecordsListProps) => {
  const { language } = useTranslation();
  
  // Filter records by patientId, searchTerm, and typeFilter
  let filteredRecords = sampleRecords;
  
  if (patientId) {
    filteredRecords = filteredRecords.filter(record => record.patientId === patientId);
  }
  
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filteredRecords = filteredRecords.filter(record => 
      record.title.toLowerCase().includes(search) || 
      record.provider.toLowerCase().includes(search)
    );
  }
  
  if (typeFilter && typeFilter !== 'all') {
    filteredRecords = filteredRecords.filter(record => record.type === typeFilter);
  }
  
  // Sort by date (newest first)
  filteredRecords = filteredRecords.sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );
  
  const records = limit ? filteredRecords.slice(0, limit) : filteredRecords;
  
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>;
      case 'imaging':
        return <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-purple-600" />
        </div>;
      case 'visit':
        return <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-green-600" />
        </div>;
      case 'procedure':
        return <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>;
      case 'discharge':
        return <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-pink-600" />
        </div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-gray-600" />
        </div>;
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {records.length > 0 ? (
        <>
          {records.map((record) => (
            <div key={record.id} className="p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                {getRecordIcon(record.type)}
                <div className="flex-1">
                  <Link to={`/records/${record.id}`}>
                    <h3 className="font-medium hover:text-primary transition-colors">{record.title}</h3>
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                    <div>{formatDate(record.date)}</div>
                    <div className="hidden sm:block">•</div>
                    <div>{record.provider}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {showViewAll && (
            <Link to="/records" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline py-2">
              {language === 'pt' ? 'Ver todos os registros' : 'View all records'}
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {language === 'pt' ? 'Nenhum registro médico encontrado.' : 'No medical records found.'}
        </div>
      )}
    </div>
  );
};

export default RecordsList;
