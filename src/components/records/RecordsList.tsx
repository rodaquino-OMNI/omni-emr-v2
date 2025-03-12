
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import RecordCard, { MedicalRecord } from './RecordCard';
import { ChevronRight } from 'lucide-react';

type RecordsListProps = {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  patientId?: string;
};

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

const RecordsList = ({ className, limit, showViewAll = false, patientId }: RecordsListProps) => {
  // Filter records by patientId if provided
  const filteredRecords = patientId 
    ? sampleRecords.filter(record => record.patientId === patientId)
    : sampleRecords;
  
  const records = limit ? filteredRecords.slice(0, limit) : filteredRecords;
  
  return (
    <div className={cn("space-y-3", className)}>
      {records.length > 0 ? (
        <>
          {records.map(record => (
            <RecordCard key={record.id} record={record} />
          ))}
          
          {showViewAll && (
            <Link to="/records" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline py-2">
              View all records
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No records found.
        </div>
      )}
    </div>
  );
};

export default RecordsList;
