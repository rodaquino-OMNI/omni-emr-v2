
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileText, FileImage, Stethoscope, Activity, ClipboardCheck } from 'lucide-react';
import { MedicalRecord } from '@/types/medicalRecordTypes';

type RecordCardProps = {
  record: MedicalRecord;
  className?: string;
};

const RecordCard = ({ record, className }: RecordCardProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get icon based on record type
  const getTypeIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'lab':
        return <FileText className="h-5 w-5 text-medical-blue" />;
      case 'imaging':
        return <FileImage className="h-5 w-5 text-medical-yellow" />;
      case 'procedure':
        return <Activity className="h-5 w-5 text-medical-red" />;
      case 'visit':
        return <Stethoscope className="h-5 w-5 text-medical-green" />;
      case 'discharge':
        return <ClipboardCheck className="h-5 w-5 text-medical-gray" />;
      default:
        return <FileText className="h-5 w-5" />;
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

  return (
    <Link to={`/records/${record.id}`}>
      <div className={cn("glass-card p-4 cursor-pointer hover:shadow-md transition-shadow", className)}>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-medical-blue-light/20 flex items-center justify-center">
            {getTypeIcon(record.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{record.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatDate(record.date)}</span>
              <span>•</span>
              <span>{record.provider}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={cn("text-xs px-2 py-1 rounded-full capitalize", getStatusStyle(record.status))}>
              {record.status}
            </span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{record.type}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecordCard;
