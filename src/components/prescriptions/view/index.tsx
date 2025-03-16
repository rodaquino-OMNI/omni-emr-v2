
import React from 'react';
import { FileX, Pill, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { Prescription, PrescriptionItem } from '../index';

interface PrescriptionHeaderProps {
  prescription: Prescription;
  formatDate: (date: string) => string;
}

export const PrescriptionHeader: React.FC<PrescriptionHeaderProps> = ({ 
  prescription, 
  formatDate 
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Prescription #{prescription.id.slice(0, 8)}</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
              {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(prescription.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Doctor: {prescription.doctorName}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Patient</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
              <span>{prescription.patientName}</span>
              <span className="hidden sm:inline">•</span>
              <span>ID: {prescription.patientId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PrescriptionItemsProps {
  prescription: Prescription;
}

export const PrescriptionItems: React.FC<PrescriptionItemsProps> = ({ prescription }) => {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Pill className="h-5 w-5 text-primary" />
        Prescribed Medications
      </h2>
      
      <div className="space-y-4">
        {prescription.items.map((item, index) => (
          <div key={item.id} className="p-4 bg-muted rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.dosage}, {item.frequency}, {item.duration}
                </p>
              </div>
              
              <div className="mt-2 sm:mt-0">
                <div className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    item.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Last refill: 15 days ago</span>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Refills remaining: 2</span>
              </div>
            </div>
            
            {index < prescription.items.length - 1 && (
              <div className="border-b border-border my-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface LoadingStateProps {
  error: string | null;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ error }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileX className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          {error}
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
    </div>
  );
};
