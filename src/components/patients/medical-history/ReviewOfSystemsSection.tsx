
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Shield } from 'lucide-react';

type ReviewOfSystemsProps = {
  reviewOfSystems: Record<string, string>;
  editMode: boolean;
  onUpdateSystem?: (system: string, value: string) => void;
};

// FHIR SNOMED-CT code map for review of systems
const snomedCodeMap = {
  constitutional: "118430007",    // Constitutional symptom (finding)
  respiratory: "267036007",       // Respiratory symptom (finding)
  cardiovascular: "267038008",    // Cardiovascular symptom (finding)
  gastrointestinal: "267031002", // Gastrointestinal symptom (finding)
  musculoskeletal: "267016001",  // Musculoskeletal symptom (finding)
  neurological: "118230007",     // Neurological symptom (finding)
  psychiatric: "116680003"       // Psychiatric symptom (finding)
};

const findingsOptions = {
  constitutional: ["No fever", "No fatigue", "No weight changes", "Fever", "Fatigue", "Recent weight loss", "Recent weight gain"],
  respiratory: ["No cough", "No shortness of breath", "Cough", "Shortness of breath", "Wheezing", "Hemoptysis"],
  cardiovascular: ["No chest pain", "No palpitations", "No edema", "Chest pain", "Palpitations", "Edema", "Orthopnea"],
  gastrointestinal: ["No nausea", "No vomiting", "No abdominal pain", "Nausea", "Vomiting", "Abdominal pain", "Diarrhea", "Constipation"],
  musculoskeletal: ["No joint pain", "No swelling", "Joint pain", "Swelling", "Stiffness", "Limited range of motion"],
  neurological: ["No headaches", "No dizziness", "No numbness", "Headaches", "Dizziness", "Numbness", "Tingling", "Weakness"],
  psychiatric: ["No depression", "No anxiety", "Depression", "Anxiety", "Sleep disturbance", "Mood changes"]
};

const ReviewOfSystemsSection = ({ 
  reviewOfSystems, 
  editMode,
  onUpdateSystem 
}: ReviewOfSystemsProps) => {
  const [selectedFindings, setSelectedFindings] = useState<Record<string, string[]>>({});

  // Initialize selected findings based on current values
  useEffect(() => {
    const initialSelectedFindings: Record<string, string[]> = {};
    
    Object.entries(reviewOfSystems).forEach(([system, findings]) => {
      // Parse the comma-separated findings string into an array
      if (findings && findings.trim() !== '') {
        initialSelectedFindings[system] = findings.split(', ').map(finding => finding.trim());
      } else {
        initialSelectedFindings[system] = [];
      }
    });
    
    setSelectedFindings(initialSelectedFindings);
  }, [reviewOfSystems]);

  const handleFindingChange = (system: string, value: string) => {
    if (onUpdateSystem) {
      onUpdateSystem(system, value);
    }
  };

  const handleFindingSelection = (system: string, finding: string) => {
    const currentFindings = selectedFindings[system] || [];
    let newFindings;
    
    if (currentFindings.includes(finding)) {
      newFindings = currentFindings.filter(f => f !== finding);
    } else {
      newFindings = [...currentFindings, finding];
    }
    
    const updatedFindings = {
      ...selectedFindings,
      [system]: newFindings
    };
    
    setSelectedFindings(updatedFindings);
    
    if (onUpdateSystem) {
      onUpdateSystem(system, newFindings.join(", "));
    }
  };

  return (
    <AccordionItem value="review-systems">
      <AccordionTrigger className="text-base font-medium">Review of Systems</AccordionTrigger>
      <AccordionContent>
        <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mb-4 w-fit">
          <Shield className="h-3 w-3" />
          FHIR Observation
        </div>
        
        <div className="space-y-4 pt-2">
          {Object.entries(reviewOfSystems).map(([system, findings], index) => (
            <div key={index} className="border p-3 rounded-md">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium mb-1 capitalize">{system}</label>
                {snomedCodeMap[system as keyof typeof snomedCodeMap] && (
                  <span className="text-xs text-muted-foreground">
                    SNOMED-CT: {snomedCodeMap[system as keyof typeof snomedCodeMap]}
                  </span>
                )}
              </div>
              
              {editMode ? (
                <div className="space-y-2">
                  <Textarea 
                    value={findings} 
                    onChange={(e) => handleFindingChange(system, e.target.value)}
                    className="mb-2"
                    rows={2}
                  />
                  
                  {system in findingsOptions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {findingsOptions[system as keyof typeof findingsOptions].map((finding, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`text-xs px-2 py-1 rounded-full border ${
                            selectedFindings[system]?.includes(finding)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background hover:bg-muted'
                          }`}
                          onClick={() => handleFindingSelection(system, finding)}
                        >
                          {finding}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Textarea 
                  defaultValue={findings} 
                  readOnly
                  className="bg-muted"
                  rows={2}
                />
              )}
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ReviewOfSystemsSection;
