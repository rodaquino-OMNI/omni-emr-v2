
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ClipboardList, Calendar, ChevronRight, User, Clock, Database, FileText } from 'lucide-react';
import { extractTextFromCodeableConcept, extractPatientName } from '@/utils/fhir/fhirExtractors';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type PrescriptionCardProps = {
  prescription: any;
  className?: string;
};

const PrescriptionCard = ({ prescription, className }: PrescriptionCardProps) => {
  // Format date (works with both FHIR and legacy data)
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Determine if we're working with FHIR medication request or legacy prescription
  const isFhirFormat = !!prescription.medication_codeable_concept;
  
  // Get patient name - might be coming from either format
  const patientName = isFhirFormat 
    ? prescription.patientName || 'Patient'
    : prescription.patientName;
  
  // Get status - exists in both formats
  const status = prescription.status || 'unknown';
  
  // Get medication name from either format
  const medicationName = isFhirFormat
    ? extractTextFromCodeableConcept(prescription.medication_codeable_concept, 'Unnamed medication')
    : prescription.name;
  
  // Get date from either format
  const prescriptionDate = isFhirFormat
    ? prescription.authored_on
    : prescription.date;
  
  // Get provider name from either format
  const providerName = isFhirFormat
    ? prescription.requesterName || 'Provider'
    : prescription.doctorName;
  
  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
      case 'on-hold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Link to appropriate detail view based on format
  const detailLink = isFhirFormat
    ? `/medications/fhir/${prescription.id}`
    : `/prescriptions/${prescription.id}`;

  return (
    <Link to={detailLink}>
      <div className={cn("glass-card p-4 hover:shadow-md transition-shadow border border-border/50 relative", className)}>
        <div className="absolute top-0 left-0 w-1 h-full rounded-l-md bg-gradient-to-b from-medical-purple to-medical-blue"></div>
        
        {/* Format indicator badge */}
        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className={cn(
                  "flex items-center gap-1 text-xs py-0.5",
                  isFhirFormat 
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300" 
                    : "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300"
                )}>
                  {isFhirFormat ? (
                    <>
                      <FileText className="h-3 w-3" />
                      <span>FHIR</span>
                    </>
                  ) : (
                    <>
                      <Database className="h-3 w-3" />
                      <span>Legacy</span>
                    </>
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {isFhirFormat 
                    ? "FHIR Medication Request Format" 
                    : "Legacy Prescription Format"}
                </p>
                <p className="text-xs mt-1">
                  {isFhirFormat
                    ? "Using standardized FHIR structure for interoperability"
                    : "Using original database structure for backwards compatibility"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-4 mt-1">
          <div className="h-10 w-10 rounded-full bg-medical-purple/10 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-medical-purple" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between pr-16">
              <h3 className="font-medium truncate">
                {isFhirFormat ? medicationName : `Prescription for ${patientName}`}
              </h3>
              <Badge className={cn("border", getStatusStyle(status))}>
                {status}
              </Badge>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(prescriptionDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{providerName || 'Unknown Provider'}</span>
              </div>
              {prescription.priority === 'high' && (
                <div className="text-medical-red font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  High Priority
                </div>
              )}
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {!isFhirFormat && prescription.items && prescription.items.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {prescription.items.length} item{prescription.items.length !== 1 ? 's' : ''}: 
              <span className="font-medium ml-1">
                {prescription.items.slice(0, 2).map((item: any) => item.name).join(', ')}
                {prescription.items.length > 2 ? '...' : ''}
              </span>
            </p>
          </div>
        )}
        
        {isFhirFormat && prescription.dosage_instruction && prescription.dosage_instruction.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Dosage:</span> {prescription.dosage_instruction[0]?.text || 'No specific instructions'}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PrescriptionCard;
