
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { checkDrugInteractions, formatInteractionsForDisplay } from '@/services/rxnorm/rxnormInteractions';
import DrugInteractionSearch from './DrugInteractionSearch';
import MedicationList from './MedicationList';
import InteractionResults from './InteractionResults';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Interaction {
  description: string;
  severity: string;
  source?: string;
  drugs: string[];
}

const DrugInteractionChecker: React.FC = () => {
  const [medications, setMedications] = useState<Array<{ rxcui: string; name: string }>>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a medication to the list
  const handleAddMedication = useCallback((medication: { rxcui: string; name: string }) => {
    setMedications(prev => {
      // Check if medication already exists in the list
      if (prev.some(med => med.rxcui === medication.rxcui)) {
        return prev;
      }
      return [...prev, medication];
    });
    
    // Reset interactions when medications change
    setInteractions([]);
    setError(null);
  }, []);

  // Remove a medication from the list
  const handleRemoveMedication = useCallback((rxcui: string) => {
    setMedications(prev => prev.filter(med => med.rxcui !== rxcui));
    
    // Reset interactions when medications change
    setInteractions([]);
    setError(null);
  }, []);

  // Check for interactions between medications
  const handleCheckInteractions = useCallback(async () => {
    if (medications.length < 2) {
      setError("You need at least two medications to check for interactions.");
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const rxcuis = medications.map(med => med.rxcui);
      const medicationNames = medications.reduce((nameMap: Record<string, string>, med) => {
        nameMap[med.rxcui] = med.name;
        return nameMap;
      }, {});

      const results = await checkDrugInteractions(rxcuis);
      
      // Format the interactions for display
      const formattedInteractions = formatInteractionsForDisplay(results, medicationNames);
      setInteractions(formattedInteractions);
    } catch (error) {
      console.error("Error checking drug interactions:", error);
      setError("Failed to check drug interactions. Please try again.");
    } finally {
      setIsChecking(false);
    }
  }, [medications]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drug Interaction Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Medication Search */}
        <DrugInteractionSearch onAddMedication={handleAddMedication} />
        
        {/* Selected Medications List */}
        <MedicationList 
          medications={medications} 
          onRemoveMedication={handleRemoveMedication} 
        />
        
        {/* Check Interactions Button */}
        {medications.length >= 2 && (
          <div className="flex justify-center">
            <Button 
              onClick={handleCheckInteractions} 
              disabled={isChecking}
              className="gap-2"
            >
              {isChecking && <RefreshCw className="h-4 w-4 animate-spin" />}
              Check Interactions
            </Button>
          </div>
        )}
        
        {/* Interaction Results */}
        {(interactions.length > 0 || isChecking || error) && (
          <InteractionResults 
            interactions={interactions}
            isLoading={isChecking}
            error={error}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DrugInteractionChecker;
