
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  status: string;
  items: PrescriptionItem[];
}

interface PrescriptionsListProps {
  prescriptions: Prescription[];
  patientId?: string;
  showAddNew?: boolean;
}

const getStatusBadgeVariant = (status: string) => {
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

// Mock prescriptions for demonstration
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '101',
    patientName: 'John Doe',
    doctorId: '201',
    doctorName: 'Dr. Sarah Chen',
    date: '2023-11-15T08:30:00.000Z',
    status: 'active',
    items: [
      {
        id: '1001',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        status: 'active'
      },
      {
        id: '1002',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        status: 'active'
      }
    ]
  },
  {
    id: '2',
    patientId: '102',
    patientName: 'Jane Smith',
    doctorId: '201',
    doctorName: 'Dr. Sarah Chen',
    date: '2023-11-10T10:15:00.000Z',
    status: 'completed',
    items: [
      {
        id: '1003',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '10 days',
        status: 'completed'
      }
    ]
  },
  {
    id: '3',
    patientId: '103',
    patientName: 'Robert Johnson',
    doctorId: '202',
    doctorName: 'Dr. Michael Rodriguez',
    date: '2023-11-12T14:45:00.000Z',
    status: 'cancelled',
    items: [
      {
        id: '1004',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'As needed',
        duration: '7 days',
        status: 'cancelled'
      }
    ]
  }
];

export const PrescriptionsList: React.FC<PrescriptionsListProps> = ({ 
  prescriptions = mockPrescriptions, 
  patientId,
  showAddNew = true
}) => {
  // Filter by patient ID if provided
  const filteredPrescriptions = patientId 
    ? prescriptions.filter(p => p.patientId === patientId)
    : prescriptions;
  
  if (filteredPrescriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No prescriptions found.</p>
        {showAddNew && patientId && (
          <Link to={`/prescribe/${patientId}`}>
            <Button variant="outline" className="mt-4">Create New Prescription</Button>
          </Link>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredPrescriptions.map(prescription => (
        <Link
          key={prescription.id}
          to={`/prescriptions/${prescription.id}`}
          className="block p-4 rounded-lg border border-border hover:border-primary/20 transition-colors hover:bg-accent/30"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {patientId ? `Prescription #${prescription.id.slice(0, 8)}` : prescription.patientName}
                </h3>
                <Badge className={getStatusBadgeVariant(prescription.status)}>
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(prescription.date).toLocaleDateString()} ({formatDistanceToNow(new Date(prescription.date), { addSuffix: true })})
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{prescription.doctorName}</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground">{prescription.items.length} medications</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {prescription.items.slice(0, 2).map((item, index) => (
                <div key={item.id} className="mb-1 last:mb-0">
                  • {item.name}, {item.dosage}, {item.frequency}
                </div>
              ))}
              {prescription.items.length > 2 && (
                <div className="text-xs text-muted-foreground mt-1">
                  + {prescription.items.length - 2} more medications
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
