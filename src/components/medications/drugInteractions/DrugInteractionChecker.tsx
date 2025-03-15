
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, Search, AlertTriangle, Pill, Shield } from "lucide-react";
import { checkDrugInteractions, formatInteractionsForDisplay } from '@/services/rxnorm/rxnormInteractions';
import DrugInteractionSearch from './DrugInteractionSearch';
import MedicationList from './MedicationList';
import InteractionResults from './InteractionResults';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Interaction {
  description: string;
  severity: string;
  source?: string;
  drugs: string[];
}

const DrugInteractionChecker: React.FC = () => {
  const [medications, setMedications] = useState<Array<{ rxcui: string; name: string; hasInteraction?: boolean }>>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interactionSummary, setInteractionSummary] = useState<{
    total: number;
    severe: number;
    moderate: number;
    minor: number;
  }>({ total: 0, severe: 0, moderate: 0, minor: 0 });

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
    setHasCheckedOnce(false);
    setError(null);
  }, []);

  // Remove a medication from the list
  const handleRemoveMedication = useCallback((rxcui: string) => {
    setMedications(prev => prev.filter(med => med.rxcui !== rxcui));
    
    // Reset interactions when medications change
    setInteractions([]);
    setHasCheckedOnce(false);
    setError(null);
  }, []);

  // Update medication interactions flags
  useEffect(() => {
    if (interactions.length > 0) {
      // Create a set of medication RxCUIs that have interactions
      const medsWithInteractions = new Set<string>();
      
      // For each interaction, add the involved medications to the set
      interactions.forEach(interaction => {
        // Map drug names back to RxCUIs
        medications.forEach(med => {
          if (interaction.drugs.includes(med.name)) {
            medsWithInteractions.add(med.rxcui);
          }
        });
      });
      
      // Update medications with interaction flags
      setMedications(prevMeds => 
        prevMeds.map(med => ({
          ...med,
          hasInteraction: medsWithInteractions.has(med.rxcui)
        }))
      );
      
      // Update interaction summary
      const summary = {
        total: interactions.length,
        severe: interactions.filter(i => 
          i.severity.toLowerCase() === 'high' || 
          i.severity.toLowerCase() === 'severe'
        ).length,
        moderate: interactions.filter(i => 
          i.severity.toLowerCase() === 'medium' || 
          i.severity.toLowerCase() === 'moderate'
        ).length,
        minor: interactions.filter(i => 
          i.severity.toLowerCase() === 'low' || 
          i.severity.toLowerCase() === 'minor'
        ).length
      };
      
      setInteractionSummary(summary);
    }
  }, [interactions, medications]);

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
      setHasCheckedOnce(true);
    } catch (error) {
      console.error("Error checking drug interactions:", error);
      setError("Failed to check drug interactions. Please try again.");
    } finally {
      setIsChecking(false);
    }
  }, [medications]);

  return (
    <Card className="shadow-md border-medical-purple/20">
      <CardHeader className="bg-gradient-to-r from-medical-purple/5 to-medical-blue/5 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-medical-purple" />
          <CardTitle>Drug Interaction Checker</CardTitle>
        </div>
        <CardDescription>
          Search for medications and check for potential interactions between them
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Safety Information Alert */}
        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <ShieldAlert className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Clinical Decision Support</AlertTitle>
          <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
            This tool checks for potential drug interactions using the NIH Drug Interaction API.
            Always consult with a healthcare provider before making medication decisions.
          </AlertDescription>
        </Alert>
        
        {/* Medication Search */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            Search Medications
          </h3>
          <DrugInteractionSearch onAddMedication={handleAddMedication} />
        </div>
        
        {/* Selected Medications List */}
        <MedicationList 
          medications={medications} 
          onRemoveMedication={handleRemoveMedication}
          interactionFound={interactions.length > 0}
        />
        
        {/* Check Interactions Button */}
        {medications.length >= 2 && (
          <div className="flex justify-center pt-2">
            <Button 
              onClick={handleCheckInteractions} 
              disabled={isChecking}
              className="gap-2 bg-medical-purple hover:bg-medical-purple/90"
            >
              {isChecking ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Pill className="h-4 w-4" />
              )}
              {isChecking ? "Checking..." : hasCheckedOnce ? "Check Again" : "Check Interactions"}
            </Button>
          </div>
        )}
        
        {/* Interaction Results */}
        {(interactions.length > 0 || isChecking || error || hasCheckedOnce) && (
          <div className="mt-4 pt-4 border-t">
            {/* Interaction Summary - only shown when interactions exist */}
            {interactions.length > 0 && (
              <div className="mb-4 flex items-center gap-2 text-sm">
                <AlertTriangle className={`h-4 w-4 ${
                  interactionSummary.severe > 0 ? 'text-red-600' : 
                  interactionSummary.moderate > 0 ? 'text-amber-600' : 
                  'text-blue-600'
                }`} />
                <span className="font-medium">
                  {interactionSummary.total} Potential {interactionSummary.total === 1 ? 'Interaction' : 'Interactions'} Detected
                </span>
              </div>
            )}
            
            <InteractionResults 
              interactions={interactions}
              isLoading={isChecking}
              error={error}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrugInteractionChecker;
