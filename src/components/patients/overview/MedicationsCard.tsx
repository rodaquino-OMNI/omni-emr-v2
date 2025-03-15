
import React from 'react';
import { Pill, AlertTriangle, ExternalLink, FileText, Database, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '../PatientCard';
import { usePatientPrescriptions } from '../hooks/usePatientPrescriptions';
import { canPerformMedicationAction } from '@/utils/permissions/medicationManagement';
import { useAuth } from '@/context/AuthContext';
import { extractTextFromCodeableConcept } from '@/utils/fhir/fhirExtractors';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MedicationsCardProps = {
  patient: Patient;
  prescriptions?: any[];
};

const MedicationsCard = ({ patient, prescriptions: initialPrescriptions }: MedicationsCardProps) => {
  const { user } = useAuth();
  const { prescriptions, loading, dataStats } = usePatientPrescriptions(patient.id);
  
  // Use provided prescriptions or fetched ones
  const displayPrescriptions = initialPrescriptions || prescriptions;
  
  // Check if user can prescribe medications
  const canPrescribe = user ? canPerformMedicationAction(user, 'prescribe') : false;
  
  // Extract medication name appropriately based on whether it's FHIR format or not
  const getMedicationName = (medication: any): string => {
    if (medication.medication_codeable_concept) {
      // FHIR format
      return extractTextFromCodeableConcept(medication.medication_codeable_concept, 'Unknown Medication');
    }
    // Legacy format - name is directly on the object
    return medication.name || 'Unknown Medication';
  };
  
  // Extract medication dosage from either format
  const getMedicationDosage = (medication: any): string => {
    if (medication.dosage_instruction && medication.dosage_instruction.length > 0) {
      // FHIR format
      const dosageInst = medication.dosage_instruction[0];
      if (dosageInst.doseAndRate && dosageInst.doseAndRate.length > 0) {
        const doseQuantity = dosageInst.doseAndRate[0].doseQuantity;
        if (doseQuantity) {
          return `${doseQuantity.value || ''} ${doseQuantity.unit || ''}`.trim();
        }
      }
      return dosageInst.text || '';
    }
    // Legacy format
    return medication.dosage || '';
  };
  
  // Extract medication status from either format
  const getStatus = (medication: any): string => {
    return medication.status || 'unknown';
  };
  
  // Determine if a medication is using FHIR format
  const isFhirFormat = (medication: any): boolean => {
    return !!medication.medication_codeable_concept || medication.dataSource === 'fhir';
  };
  
  return (
    <Card className="border border-border overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Pill className="h-5 w-5 text-medical-blue" />
            <div className="flex items-center gap-2">
              Medications
              
              {dataStats?.hasDualSources && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-xs flex items-center gap-1 px-2">
                        <ArrowLeftRight className="h-3 w-3 text-blue-600" />
                        <span>Dual Format</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-2 max-w-xs">
                        <p className="font-medium">Enhanced Data Processing</p>
                        <p className="text-sm">This view combines medications from both FHIR and legacy formats with automatic normalization.</p>
                        {dataStats && (
                          <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 text-blue-500" />
                              <span>FHIR: {dataStats.fhirCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Database className="h-3 w-3 text-green-500" />
                              <span>Legacy: {dataStats.legacyCount}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            {canPrescribe && (
              <Button 
                asChild
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
              >
                <Link to={`/prescribe/${patient.id}`}>
                  Prescribe
                </Link>
              </Button>
            )}
            <Button 
              asChild
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
            >
              <Link to={`/medications?patientId=${patient.id}`}>
                <span>View All</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
        <CardDescription>Current medications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 pt-2">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Loading medications...
            </div>
          ) : displayPrescriptions && displayPrescriptions.length > 0 ? (
            displayPrescriptions.slice(0, 3).map((prescription, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-border">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 shrink-0">
                  <Pill className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate flex items-center gap-2">
                    {getMedicationName(prescription)}
                    
                    {/* Data source indicator */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {isFhirFormat(prescription) ? (
                            <Badge variant="outline" className="h-4 text-[10px] px-1 bg-blue-50 text-blue-600 border-blue-200">
                              <FileText className="h-2 w-2 mr-0.5" />
                              FHIR
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="h-4 text-[10px] px-1 bg-green-50 text-green-600 border-green-200">
                              <Database className="h-2 w-2 mr-0.5" />
                              Legacy
                            </Badge>
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="text-xs">
                          {isFhirFormat(prescription) 
                            ? "Using FHIR standard format" 
                            : "Using legacy data format"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xs text-muted-foreground">{getMedicationDosage(prescription)}</div>
                  {prescription.nextDose && (
                    <div className="text-xs text-blue-600 mt-1">Next dose: {prescription.nextDose}</div>
                  )}
                </div>
                <div className="shrink-0">
                  {getStatus(prescription) === 'on-hold' && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                      On Hold
                    </Badge>
                  )}
                  {getStatus(prescription) === 'active' && prescription.priority === 'high' && (
                    <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                      High Priority
                    </Badge>
                  )}
                </div>
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
