
// Medical history mock data type definitions

export type Condition = {
  condition: string;
  diagnosedYear: number;
  status: string;
};

export type Allergy = {
  allergen: string;
  reaction: string;
  severity: string;
};

export type FamilyMember = {
  relation: string;
  condition: string;
  age: number;
};

export type MedicalHistoryData = {
  chiefComplaint: string;
  presentIllness: string;
  pastConditions: Condition[];
  familyHistory: FamilyMember[];
  smoking: string;
  smokingDetails: string;
  alcohol: string;
  alcoholDetails: string;
  occupation: string;
  exercise: string;
  diet: string;
  allergies: Allergy[];
  reviewOfSystems: Record<string, string>;
};

// Mock data - in a real application, this would be fetched from an API
export const getMedicalHistory = (patientId: string): MedicalHistoryData => {
  return {
    // Chief complaint and present illness
    chiefComplaint: "Chest pain and shortness of breath",
    presentIllness: "Patient reports intermittent chest pain for the past 3 days, worse with exertion",
    
    // Past medical history
    pastConditions: [
      { condition: "Hypertension", diagnosedYear: 2015, status: "Active" },
      { condition: "Type 2 Diabetes", diagnosedYear: 2018, status: "Active" },
      { condition: "Appendectomy", diagnosedYear: 2010, status: "Resolved" }
    ],
    
    // Family history
    familyHistory: [
      { relation: "Father", condition: "Coronary Artery Disease", age: 65 },
      { relation: "Mother", condition: "Breast Cancer", age: 70 },
      { relation: "Brother", condition: "Hypertension", age: 55 }
    ],
    
    // Social history
    smoking: "Former", // Current, Former, Never
    smokingDetails: "Quit in 2019, previously 1 pack/day for 15 years",
    alcohol: "Occasional", // None, Occasional, Moderate, Heavy
    alcoholDetails: "1-2 drinks on weekends",
    occupation: "Teacher",
    exercise: "Moderate", // None, Light, Moderate, Heavy
    diet: "Regular", // Regular, Vegetarian, Vegan, Gluten-free, etc.
    
    // Allergies
    allergies: [
      { allergen: "Penicillin", reaction: "Rash", severity: "Moderate" },
      { allergen: "Shellfish", reaction: "Anaphylaxis", severity: "Severe" }
    ],
    
    // Review of systems
    reviewOfSystems: {
      constitutional: "No fever, fatigue, or weight changes",
      respiratory: "Shortness of breath with exertion, no cough",
      cardiovascular: "Chest pain, no palpitations or edema",
      gastrointestinal: "No nausea, vomiting, or abdominal pain",
      musculoskeletal: "No joint pain or swelling",
      neurological: "No headaches, dizziness, or numbness",
      psychiatric: "No depression or anxiety"
    }
  };
};
