
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ClipboardList, Calendar, ChevronRight } from 'lucide-react';
import { extractTextFromCodeableConcept, extractPatientName } from '@/utils/fhir/fhirExtractors';

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
        return 'bg-green-100 text-green-800';
      case 'completed':
      case 'on-hold':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'stopped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Link to appropriate detail view based on format
  const detailLink = isFhirFormat
    ? `/medications/fhir/${prescription.id}`
    : `/prescriptions/${prescription.id}`;

  return (
    <Link to={detailLink}>
      <div className={cn("glass-card p-4 cursor-pointer hover:shadow-md transition-shadow", className)}>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-medical-purple/10 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-medical-purple" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">
                {isFhirFormat ? medicationName : `Prescription for ${patientName}`}
              </h3>
              <span className={cn("text-xs px-2 py-1 rounded-full capitalize", getStatusStyle(status))}>
                {status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(prescriptionDate)}</span>
              </div>
              <div>
                By: {providerName || 'Unknown Provider'}
              </div>
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {!isFhirFormat && prescription.items && prescription.items.length > 0 && (
          <div className="mt-3 border-t pt-2">
            <p className="text-xs text-muted-foreground">
              {prescription.items.length} item{prescription.items.length !== 1 ? 's' : ''}: 
              {prescription.items.map((item: any) => item.name).join(', ')}
            </p>
          </div>
        )}
        
        {isFhirFormat && prescription.dosage_instruction && prescription.dosage_instruction.length > 0 && (
          <div className="mt-3 border-t pt-2">
            <p className="text-xs text-muted-foreground">
              Dosage: {prescription.dosage_instruction[0]?.text || 'No specific instructions'}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PrescriptionCard;
