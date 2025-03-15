
import React from 'react';
import { X, Pill, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Medication {
  rxcui: string;
  name: string;
  hasInteraction?: boolean; // New prop to indicate if this medication has interactions
}

interface MedicationListProps {
  medications: Medication[];
  onRemoveMedication: (rxcui: string) => void;
  interactionFound?: boolean; // Indicates if any interactions were found
}

const MedicationList: React.FC<MedicationListProps> = ({ 
  medications, 
  onRemoveMedication,
  interactionFound = false
}) => {
  if (medications.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/30 rounded-md">
        <Pill className="h-6 w-6 mx-auto mb-2 text-muted-foreground/70" />
        <p className="text-muted-foreground">Add medications to check for interactions</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Search for medications using the field above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center gap-2">
          Selected Medications
          <span className="text-xs font-normal text-muted-foreground">
            ({medications.length})
          </span>
        </h3>
        
        {medications.length >= 2 && (
          <div className="flex items-center">
            {interactionFound ? (
              <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                <span>Interactions found</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                <Check className="h-3.5 w-3.5 mr-1" />
                <span>No interactions</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <ul className="grid gap-2">
        {medications.map((med) => (
          <li 
            key={med.rxcui} 
            className={`flex items-center justify-between p-3 rounded-md border ${
              med.hasInteraction 
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' 
                : 'bg-background'
            }`}
          >
            <div className="flex items-center gap-2">
              <Pill className={`h-4 w-4 ${
                med.hasInteraction 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-primary/70'
              }`} />
              <span className="font-medium text-sm">{med.name}</span>
              
              {med.hasInteraction && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">This medication has potential interactions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveMedication(med.rxcui)}
              className="h-6 w-6 rounded-full hover:bg-muted"
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
