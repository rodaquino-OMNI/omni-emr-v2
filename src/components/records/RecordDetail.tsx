
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, FileImage, Stethoscope, Activity, ClipboardCheck } from 'lucide-react';
import { MedicalRecord } from '@/types/medicalRecordTypes';
import { recordService } from '@/services/recordService';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

type RecordDetailProps = {
  recordId?: string;
};

const RecordDetail = ({ recordId }: RecordDetailProps) => {
  const { t, language } = useTranslation();
  const params = useParams();
  const id = recordId || params.id;
  
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await recordService.getRecordById(id);
        setRecord(data);
      } catch (error) {
        console.error('Error fetching record:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecord();
  }, [id]);
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', options);
  };
  
  // Get icon based on record type
  const getTypeIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'lab':
        return <FileText className="h-6 w-6 text-medical-blue" />;
      case 'imaging':
        return <FileImage className="h-6 w-6 text-medical-yellow" />;
      case 'procedure':
        return <Activity className="h-6 w-6 text-medical-red" />;
      case 'visit':
        return <Stethoscope className="h-6 w-6 text-medical-green" />;
      case 'discharge':
        return <ClipboardCheck className="h-6 w-6 text-medical-gray" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };
  
  // Get status style
  const getStatusStyle = (status: MedicalRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="ml-auto">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium text-muted-foreground">
          {language === 'pt' ? 'Registro não encontrado' : 'Record not found'}
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-medical-blue-light/20 flex items-center justify-center">
            {getTypeIcon(record.type)}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">{record.title}</h2>
            <div className="text-sm text-muted-foreground">
              {formatDate(record.date)}
            </div>
          </div>
          
          <div className="ml-auto">
            <span className={cn("px-3 py-1 rounded-full capitalize", getStatusStyle(record.status))}>
              {record.status}
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {language === 'pt' ? 'Tipo de Registro' : 'Record Type'}
              </h3>
              <p className="capitalize">{record.type}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {language === 'pt' ? 'Profissional' : 'Provider'}
              </h3>
              <p>{record.provider}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {language === 'pt' ? 'ID do Paciente' : 'Patient ID'}
              </h3>
              <p>{record.patientId}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {language === 'pt' ? 'Conteúdo' : 'Content'}
              </h3>
              {record.content ? (
                <p className="whitespace-pre-line">{record.content}</p>
              ) : (
                <p className="text-muted-foreground">
                  {language === 'pt' ? 'Sem conteúdo detalhado disponível.' : 'No detailed content available.'}
                </p>
              )}
            </div>
            
            {record.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {language === 'pt' ? 'Observações' : 'Notes'}
                </h3>
                <p className="whitespace-pre-line">{record.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
