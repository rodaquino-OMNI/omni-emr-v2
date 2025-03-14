
import React from 'react';
import { PatientAllergy } from '@/hooks/useMedicationSafety';
import { AlertTriangle } from 'lucide-react';

interface AllergyListItemProps {
  allergy: PatientAllergy;
}

export function AllergyListItem({ allergy }: AllergyListItemProps) {
  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'moderate':
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'mild':
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between items-start">
        <div className="font-medium">{allergy.allergen}</div>
        {allergy.severity && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(allergy.severity)}`}>
            {allergy.severity}
          </div>
        )}
      </div>
      {allergy.reaction && (
        <div className="mt-1 text-sm text-muted-foreground flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {allergy.reaction}
        </div>
      )}
    </div>
  );
}
