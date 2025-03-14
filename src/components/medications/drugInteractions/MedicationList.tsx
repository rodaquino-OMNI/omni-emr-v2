
import React from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Medication {
  rxcui: string;
  name: string;
}

interface MedicationListProps {
  medications: Medication[];
  onRemoveMedication: (rxcui: string) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({ medications, onRemoveMedication }) => {
  if (medications.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/30 rounded-md">
        <p className="text-muted-foreground">Add medications to check for interactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Selected Medications</h3>
      <ul className="grid gap-2">
        {medications.map((med) => (
          <li 
            key={med.rxcui} 
            className="flex items-center justify-between p-2 rounded-md border bg-background"
          >
            <span>{med.name}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveMedication(med.rxcui)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationList;
