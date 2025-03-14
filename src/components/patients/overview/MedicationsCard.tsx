
import React from 'react';
import { Pill, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '../PatientCard';
import { usePatientPrescriptions } from '../hooks/usePatientPrescriptions';
import { canPerformMedicationAction } from '@/utils/permissions/medicationManagement';
import { useAuth } from '@/context/AuthContext';

type MedicationsCardProps = {
  patient: Patient;
  prescriptions?: any[];
};

const MedicationsCard = ({ patient, prescriptions: initialPrescriptions }: MedicationsCardProps) => {
  const { user } = useAuth();
  const { prescriptions, loading } = usePatientPrescriptions(patient.id);
  
  // Use provided prescriptions or fetched ones
  const displayPrescriptions = initialPrescriptions || prescriptions;
  
  // Check if user can prescribe medications
  const canPrescribe = user ? canPerformMedicationAction(user, 'prescribe') : false;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            Medications
          </CardTitle>
          <div className="flex items-center gap-2">
            {canPrescribe && (
              <Link 
                to={`/prescribe?patientId=${patient.id}`} 
                className="text-xs text-primary hover:underline"
              >
                Prescribe
              </Link>
            )}
            <Link 
              to={`/medications?patientId=${patient.id}`} 
              className="text-xs text-primary hover:underline"
            >
              View All
            </Link>
          </div>
        </div>
        <CardDescription>Current medications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Loading medications...
            </div>
          ) : displayPrescriptions && displayPrescriptions.length > 0 ? (
            displayPrescriptions.slice(0, 3).map((prescription, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                  <Pill className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{prescription.name}</div>
                  <div className="text-xs text-muted-foreground">{prescription.dosage}</div>
                  {prescription.nextDose && (
                    <div className="text-xs text-blue-600 mt-1">Next dose: {prescription.nextDose}</div>
                  )}
                </div>
                {prescription.status === 'on-hold' && (
                  <div className="px-2 py-1 text-xs bg-amber-50 text-amber-800 rounded-full">
                    On Hold
                  </div>
                )}
                {prescription.status === 'active' && prescription.priority === 'high' && (
                  <div className="px-2 py-1 text-xs bg-red-50 text-red-800 rounded-full">
                    High Priority
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No active medications
            </div>
          )}
          
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800 text-xs mt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Allergies:</span>
            </div>
            <div className="mt-1">Penicillin, Sulfa drugs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationsCard;
