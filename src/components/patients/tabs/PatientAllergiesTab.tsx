
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePatientAllergies } from '@/hooks/usePatientAllergies';
import { PatientTabProps } from '@/types/patient';
import { Flower, AlertCircle } from 'lucide-react';

interface PatientAllergiesTabProps extends PatientTabProps {
  compact?: boolean;
}

const PatientAllergiesTab: React.FC<PatientAllergiesTabProps> = ({ patientId, compact = false }) => {
  const { data: allergies, isLoading, error } = usePatientAllergies(patientId);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading allergies: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!allergies || allergies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <Flower className="h-4 w-4" />
            No allergies recorded for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className={compact ? "pb-2" : "pb-4"}>
        <CardTitle className={compact ? "text-base" : "text-lg"}>Allergies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allergies.map((allergy) => (
            <div key={allergy.id} className="border-b pb-2 last:border-0 last:pb-0">
              <div className="flex items-start gap-2">
                <div className={allergy.severity === 'Severe' ? "text-red-500" : allergy.severity === 'Moderate' ? "text-amber-500" : "text-blue-500"}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{allergy.allergen}</div>
                  <div className="text-sm text-muted-foreground">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      allergy.severity === 'Severe' ? "bg-red-100 text-red-700" : 
                      allergy.severity === 'Moderate' ? "bg-amber-100 text-amber-700" : 
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {allergy.severity}
                    </span>
                    {allergy.reaction && (
                      <span className="ml-2">Reaction: {allergy.reaction}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAllergiesTab;
