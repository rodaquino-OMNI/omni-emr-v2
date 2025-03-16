
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import RecordCard from './RecordCard';
import { FileText, Calendar, ClipboardList, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { recordService } from '@/services/recordService';
import { MedicalRecord, RecordFilters } from '@/types/medicalRecordTypes';
import { Skeleton } from '@/components/ui/skeleton';

type RecordsListProps = {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  patientId?: string;
  filters?: RecordFilters;
};

const RecordsList = ({
  className,
  limit,
  showViewAll = false,
  patientId,
  filters
}: RecordsListProps) => {
  const { language } = useTranslation();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        let fetchedRecords: MedicalRecord[];
        
        if (patientId) {
          fetchedRecords = await recordService.getPatientRecords(patientId);
        } else {
          fetchedRecords = await recordService.getAllRecords(filters);
        }
        
        setRecords(fetchedRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecords();
  }, [patientId, filters]);
  
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
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const limitedRecords = limit ? records.slice(0, limit) : records;

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(limit || 3)].map((_, i) => (
          <div key={i} className="p-4 border border-border rounded-md">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {limitedRecords.length > 0 ? (
        <>
          {limitedRecords.map((record) => (
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
          
          {showViewAll && records.length > limit! && (
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
