
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

type MedicalHistoryFormProps = {
  patientId: string;
  editMode: boolean;
};

const MedicalHistoryForm = ({ patientId, editMode }: MedicalHistoryFormProps) => {
  // Mock data - in a real application, this would be fetched from an API
  const medicalHistory = {
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

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["chief-complaint", "past-medical", "allergies"]}>
        {/* Chief Complaint & Present Illness */}
        <AccordionItem value="chief-complaint">
          <AccordionTrigger className="text-base font-medium">Chief Complaint & Present Illness</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Chief Complaint</label>
                <Input 
                  defaultValue={medicalHistory.chiefComplaint} 
                  readOnly={!editMode} 
                  className={!editMode ? "bg-muted" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">History of Present Illness</label>
                <Textarea 
                  defaultValue={medicalHistory.presentIllness} 
                  readOnly={!editMode}
                  className={!editMode ? "bg-muted" : ""}
                  rows={3}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Past Medical History */}
        <AccordionItem value="past-medical">
          <AccordionTrigger className="text-base font-medium">Past Medical History</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {medicalHistory.pastConditions.map((condition, index) => (
                <div key={index} className="flex flex-wrap gap-2 items-center">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium mb-1">Condition</label>
                    <Input 
                      defaultValue={condition.condition} 
                      readOnly={!editMode}
                      className={!editMode ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <Input 
                      defaultValue={condition.diagnosedYear} 
                      readOnly={!editMode}
                      className={!editMode ? "bg-muted" : ""}
                      type="number"
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-sm font-medium mb-1">Status</label>
                    {editMode ? (
                      <Select defaultValue={condition.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        defaultValue={condition.status} 
                        readOnly 
                        className="bg-muted"
                      />
                    )}
                  </div>
                  {editMode && (
                    <button className="text-red-500 hover:text-red-700 mt-6">
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {editMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 mt-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Condition
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Allergies */}
        <AccordionItem value="allergies">
          <AccordionTrigger className="text-base font-medium">Allergies</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {medicalHistory.allergies.map((allergy, index) => (
                <div key={index} className="flex flex-wrap gap-2 items-center">
                  <div className="w-full sm:w-1/3">
                    <label className="block text-sm font-medium mb-1">Allergen</label>
                    <Input 
                      defaultValue={allergy.allergen} 
                      readOnly={!editMode}
                      className={!editMode ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label className="block text-sm font-medium mb-1">Reaction</label>
                    <Input 
                      defaultValue={allergy.reaction} 
                      readOnly={!editMode}
                      className={!editMode ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label className="block text-sm font-medium mb-1">Severity</label>
                    {editMode ? (
                      <Select defaultValue={allergy.severity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mild">Mild</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        defaultValue={allergy.severity} 
                        readOnly 
                        className="bg-muted"
                      />
                    )}
                  </div>
                  {editMode && (
                    <button className="text-red-500 hover:text-red-700 mt-6">
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {editMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 mt-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Allergy
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Social History */}
        <AccordionItem value="social-history">
          <AccordionTrigger className="text-base font-medium">Social History</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Smoking Status</label>
                {editMode ? (
                  <Select defaultValue={medicalHistory.smoking}>
                    <SelectTrigger>
                      <SelectValue placeholder="Smoking Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Never">Never</SelectItem>
                      <SelectItem value="Former">Former</SelectItem>
                      <SelectItem value="Current">Current</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    defaultValue={medicalHistory.smoking} 
                    readOnly 
                    className="bg-muted"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Smoking Details</label>
                <Input 
                  defaultValue={medicalHistory.smokingDetails} 
                  readOnly={!editMode}
                  className={!editMode ? "bg-muted" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alcohol Use</label>
                {editMode ? (
                  <Select defaultValue={medicalHistory.alcohol}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alcohol Use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Occasional">Occasional</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    defaultValue={medicalHistory.alcohol} 
                    readOnly 
                    className="bg-muted"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alcohol Details</label>
                <Input 
                  defaultValue={medicalHistory.alcoholDetails} 
                  readOnly={!editMode}
                  className={!editMode ? "bg-muted" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Occupation</label>
                <Input 
                  defaultValue={medicalHistory.occupation} 
                  readOnly={!editMode}
                  className={!editMode ? "bg-muted" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Exercise</label>
                {editMode ? (
                  <Select defaultValue={medicalHistory.exercise}>
                    <SelectTrigger>
                      <SelectValue placeholder="Exercise Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    defaultValue={medicalHistory.exercise} 
                    readOnly 
                    className="bg-muted"
                  />
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Family History */}
        <AccordionItem value="family-history">
          <AccordionTrigger className="text-base font-medium">Family History</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {medicalHistory.familyHistory.map((family, index) => (
                <div key={index} className="flex flex-wrap gap-2 items-center">
                  <div className="w-full sm:w-1/3">
                    <label className="block text-sm font-medium mb-1">Relation</label>
                    <Input 
                      defaultValue={family.relation} 
                      readOnly={!editMode}
                      className={!editMode ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium mb-1">Condition</label>
                    <Input 
                      defaultValue={family.condition} 
                      readOnly={!editMode}
                      className={!editMode ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="w-16">
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <Input 
                      defaultValue={family.age} 
                      readOnly={!editMode}
                      className={!editMode ? "bg-muted" : ""}
                      type="number"
                    />
                  </div>
                  {editMode && (
                    <button className="text-red-500 hover:text-red-700 mt-6">
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {editMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 mt-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Family History
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Review of Systems */}
        <AccordionItem value="review-systems">
          <AccordionTrigger className="text-base font-medium">Review of Systems</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {Object.entries(medicalHistory.reviewOfSystems).map(([system, findings], index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1 capitalize">{system}</label>
                  <Textarea 
                    defaultValue={findings} 
                    readOnly={!editMode}
                    className={!editMode ? "bg-muted" : ""}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MedicalHistoryForm;
