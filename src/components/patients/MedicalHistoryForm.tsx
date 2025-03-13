
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { getMedicalHistory } from './medical-history/MedicalHistoryData';
import ChiefComplaintSection from './medical-history/ChiefComplaintSection';
import PastMedicalSection from './medical-history/PastMedicalSection';
import AllergiesSection from './medical-history/AllergiesSection';
import SocialHistorySection from './medical-history/SocialHistorySection';
import FamilyHistorySection from './medical-history/FamilyHistorySection';
import ReviewOfSystemsSection from './medical-history/ReviewOfSystemsSection';

type MedicalHistoryFormProps = {
  patientId: string;
  editMode: boolean;
};

const MedicalHistoryForm = ({ patientId, editMode }: MedicalHistoryFormProps) => {
  // Get medical history data from our data service
  const medicalHistory = getMedicalHistory(patientId);

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["chief-complaint", "past-medical", "allergies"]}>
        {/* Chief Complaint & Present Illness */}
        <ChiefComplaintSection 
          chiefComplaint={medicalHistory.chiefComplaint}
          presentIllness={medicalHistory.presentIllness}
          editMode={editMode}
        />

        {/* Past Medical History */}
        <PastMedicalSection 
          pastConditions={medicalHistory.pastConditions}
          editMode={editMode}
        />

        {/* Allergies */}
        <AllergiesSection 
          allergies={medicalHistory.allergies}
          editMode={editMode}
        />

        {/* Social History */}
        <SocialHistorySection 
          smoking={medicalHistory.smoking}
          smokingDetails={medicalHistory.smokingDetails}
          alcohol={medicalHistory.alcohol}
          alcoholDetails={medicalHistory.alcoholDetails}
          occupation={medicalHistory.occupation}
          exercise={medicalHistory.exercise}
          editMode={editMode}
        />

        {/* Family History */}
        <FamilyHistorySection 
          familyHistory={medicalHistory.familyHistory}
          editMode={editMode}
        />

        {/* Review of Systems */}
        <ReviewOfSystemsSection 
          reviewOfSystems={medicalHistory.reviewOfSystems}
          editMode={editMode}
        />
      </Accordion>
    </div>
  );
};

export default MedicalHistoryForm;
