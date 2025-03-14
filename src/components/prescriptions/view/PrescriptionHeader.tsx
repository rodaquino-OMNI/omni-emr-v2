import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Prescription } from '@/services/prescriptions';
import ParticipantInfo from './ParticipantInfo';

type PrescriptionHeaderProps = {
  prescription: Prescription;
  formatDate: (dateString: string) => string;
};

const PrescriptionHeader = ({ prescription, formatDate }: PrescriptionHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/prescriptions" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to prescriptions</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
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
      
      <div className="glass-card p-6">
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Prescription #{prescription.id}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(prescription.date)}</span>
              
              <span className={`ml-4 px-3 py-1 rounded-full text-xs uppercase font-medium ${
                prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {prescription.status}
              </span>
            </div>
          </div>
        </div>
        
        <ParticipantInfo prescription={prescription} />
        
        {prescription.notes && (
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="font-medium mb-2">Notes</h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">{prescription.notes}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PrescriptionHeader;
