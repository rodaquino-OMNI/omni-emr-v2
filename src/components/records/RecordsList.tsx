
import React from 'react';
import { MedicalRecord } from '@/types/medicalRecordTypes';

export interface RecordsListProps {
  records: MedicalRecord[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<MedicalRecord>) => Promise<void>;
}

const RecordsList: React.FC<RecordsListProps> = ({ records, isLoading, onDelete, onUpdate }) => {
  if (isLoading) {
    return <div>Loading records...</div>;
  }

  if (records.length === 0) {
    return <div>No records found</div>;
  }

  return (
    <div className="space-y-4">
      {records.map(record => (
        <div key={record.id} className="border p-4 rounded-md">
          <h3 className="font-bold">{record.title}</h3>
          <div className="flex justify-between text-sm text-gray-500">
            <div>Type: {record.type}</div>
            <div>Date: {new Date(record.date).toLocaleDateString()}</div>
            <div>Status: {record.status}</div>
          </div>
          <div className="mt-2">{record.content || record.notes}</div>
          <div className="mt-2 flex justify-end space-x-2">
            <button 
              className="text-blue-500 hover:underline"
              onClick={() => onUpdate(record.id, { status: 'completed' })}
            >
              Complete
            </button>
            <button 
              className="text-red-500 hover:underline"
              onClick={() => onDelete(record.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordsList;
