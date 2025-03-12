import React from 'react';
import { useParams } from 'react-router-dom';
import { FileText, FileImage, Stethoscope, Activity, ClipboardCheck } from 'lucide-react';
import { MedicalRecord } from './RecordCard';

// Sample records data
const sampleRecords: MedicalRecord[] = [
  {
    id: "1",
    patientId: "1",
    title: "Complete Blood Count",
    type: "lab",
    date: "2023-11-15",
    provider: "Dr. Sarah Chen",
    status: "completed"
  },
  {
    id: "2",
    patientId: "1",
    title: "Chest X-Ray",
    type: "imaging",
    date: "2023-11-14",
    provider: "Dr. Michael Rodriguez",
    status: "completed"
  },
  {
    id: "3",
    patientId: "2",
    title: "Initial Assessment",
    type: "visit",
    date: "2023-11-10",
    provider: "Dr. James Wilson",
    status: "completed"
  },
  {
    id: "4",
    patientId: "3",
    title: "Cardiac Stress Test",
    type: "procedure",
    date: "2023-11-08",
    provider: "Dr. Emily Johnson",
    status: "pending"
  },
  {
    id: "5",
    patientId: "4",
    title: "MRI - Lower Back",
    type: "imaging",
    date: "2023-11-05",
    provider: "Dr. Robert Smith",
    status: "completed"
  },
  {
    id: "6",
    patientId: "5",
    title: "Post-Surgery Follow-up",
    type: "visit",
    date: "2023-11-02",
    provider: "Dr. Lisa Thompson",
    status: "completed"
  },
  {
    id: "7",
    patientId: "6",
    title: "Discharge Summary",
    type: "discharge",
    date: "2023-10-28",
    provider: "Dr. David Brown",
    status: "completed"
  }
];

type RecordDetailProps = {
  recordId?: string;
};

const RecordDetail = ({ recordId }: RecordDetailProps) => {
  const params = useParams();
  const id = recordId || params.id;
  
  const record = sampleRecords.find(r => r.id === id);
  
  if (!record) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium text-muted-foreground">Record not found</h2>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Record Type</h3>
              <p className="capitalize">{record.type}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Provider</h3>
              <p>{record.provider}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Patient ID</h3>
              <p>{record.patientId}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Content</h3>
              <p className="text-muted-foreground">
                {record.type === 'lab' && 'Laboratory test results and analysis.'}
                {record.type === 'imaging' && 'Imaging study with radiologist interpretation.'}
                {record.type === 'procedure' && 'Procedure notes and outcomes.'}
                {record.type === 'visit' && 'Clinical visit documentation.'}
                {record.type === 'discharge' && 'Discharge summary and follow-up plan.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
