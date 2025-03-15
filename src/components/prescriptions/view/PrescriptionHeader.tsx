
import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, Edit, Trash2, Calendar, User, Info, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Prescription } from '@/services/prescriptions';
import ParticipantInfo from './ParticipantInfo';
import { Badge } from '@/components/ui/badge';

type PrescriptionHeaderProps = {
  prescription: Prescription;
  formatDate: (dateString: string) => string;
};

const PrescriptionHeader = ({ prescription, formatDate }: PrescriptionHeaderProps) => {
  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="glass-card overflow-hidden border border-border">
      <div className="bg-gradient-to-r from-medical-purple/10 via-medical-blue/5 to-transparent p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Prescription #{prescription.id}</h1>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <div className="flex items-center gap-1 mr-3">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(prescription.date)}</span>
              </div>
              
              <Badge className={`${getStatusStyle(prescription.status)}`}>
                {prescription.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="flex items-center text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button size="sm" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-medical-blue/10 flex items-center justify-center">
                <User className="h-4 w-4 text-medical-blue" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Patient</h3>
                <p className="font-medium">{prescription.patientName}</p>
                <p className="text-sm text-muted-foreground">ID: {prescription.patientId}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-medical-green/10 flex items-center justify-center">
                <FileCheck className="h-4 w-4 text-medical-green" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Prescriber</h3>
                <p className="font-medium">{prescription.doctorName}</p>
                <p className="text-sm text-muted-foreground">License #: {prescription.doctorId}</p>
              </div>
            </div>
          </div>
        </div>
        
        {prescription.notes && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-medical-yellow/10 flex items-center justify-center">
                <Info className="h-4 w-4 text-medical-yellow" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <div className="bg-background/50 p-4 rounded-md border border-border">
                  <p className="text-sm">{prescription.notes}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionHeader;
