
import React, { useState } from 'react';
import PatientField from './form/PatientField';
import MedicationDetailsFields from './form/MedicationDetailsFields';
import MedicationDateFields from './form/MedicationDateFields';
import MedicationStatusField from './form/MedicationStatusField';
import MedicationTextareaField from './form/MedicationTextareaField';
import MedicationFormButtons from './form/MedicationFormButtons';
import { useMedicationForm } from './hooks/useMedicationForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useMedicationSafety } from '@/hooks/useMedicationSafety';
import { MedicationSafetyDialog } from './safety/MedicationSafetyDialog';
import { AllergiesReviewDialog } from './safety/AllergiesReviewDialog';
import { toast } from '@/hooks/use-toast';

interface NewMedicationFormProps {
  patientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMedicationForm = ({ patientId, onSuccess, onCancel }: NewMedicationFormProps) => {
  const { language, t } = useTranslation();
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [showAllergiesDialog, setShowAllergiesDialog] = useState(false);
  
  const {
    name,
    setName,
    dosage,
    setDosage,
    frequency,
    setFrequency,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    notes,
    setNotes,
    patient,
    setPatient,
    isSubmitting,
    handleSubmit: originalHandleSubmit
  } = useMedicationForm({ patientId, onSuccess });
  
  // Get the active patient ID (either from props or form state)
  const activePatientId = patientId || patient;
  
  // Initialize our safety hook
  const {
    allergies,
    isLoadingAllergies,
    isAllergyReviewed,
    patientWeight,
    weightLastUpdated,
    performSafetyCheck,
    markAllergiesReviewed,
    updatePatientWeight
  } = useMedicationSafety(activePatientId);
  
  // Intercept form submission to perform safety checks
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed with safety checks if we don't have a medication name or patient
    if (!name || !activePatientId) {
      originalHandleSubmit(e);
      return;
    }
    
    // Perform safety check
    const safetyCheck = performSafetyCheck(name);
    
    // If safety check passes, proceed with submission
    if (safetyCheck.hasPassed) {
      originalHandleSubmit(e);
    } else {
      // Show safety dialog for user to address issues
      setShowSafetyDialog(true);
    }
  };
  
  // Handle "Proceed Anyway" from safety dialog
  const handleProceedAnyway = () => {
    toast.warning(t('safetyOverridden'), {
      description: t('medicationOrderedDespiteWarnings')
    });
  };
  
  // Update the active form patient
  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!patientId && (
          <PatientField 
            value={patient}
            onChange={handlePatientChange}
          />
        )}

        <MedicationDetailsFields
          name={name}
          dosage={dosage}
          frequency={frequency}
          onNameChange={(e) => setName(e.target.value)}
          onDosageChange={(e) => setDosage(e.target.value)}
          onFrequencyChange={(e) => setFrequency(e.target.value)}
        />

        <MedicationDateFields
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <MedicationStatusField
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        <MedicationTextareaField
          id="notes"
          label={language === 'pt' ? 'Notas e Instruções' : 'Notes and Instructions'}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={language === 'pt' ? 'Instruções especiais ou notas' : 'Special instructions or notes'}
        />

        <MedicationFormButtons
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
      
      {/* Medication Safety Dialog */}
      {showSafetyDialog && (
        <MedicationSafetyDialog
          open={showSafetyDialog}
          onClose={() => setShowSafetyDialog(false)}
          safetyCheck={performSafetyCheck(name)}
          medicationName={name}
          onReviewAllergies={() => setShowAllergiesDialog(true)}
          onUpdateWeight={updatePatientWeight}
          onProceedAnyway={handleProceedAnyway}
          onCancel={onCancel}
        />
      )}
      
      {/* Allergies Review Dialog */}
      <AllergiesReviewDialog
        open={showAllergiesDialog}
        onClose={() => setShowAllergiesDialog(false)}
        allergies={allergies}
        isLoading={isLoadingAllergies}
        onConfirm={markAllergiesReviewed}
      />
    </>
  );
};

export default NewMedicationForm;
