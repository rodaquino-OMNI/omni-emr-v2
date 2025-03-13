
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ReviewOfSystemsProps = {
  reviewOfSystems: Record<string, string>;
  editMode: boolean;
  onUpdateSystem?: (system: string, value: string) => void;
};

const bodySystems = [
  "constitutional",
  "respiratory",
  "cardiovascular",
  "gastrointestinal",
  "musculoskeletal",
  "neurological",
  "psychiatric"
];

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
        <div className="space-y-4 pt-2">
          {Object.entries(reviewOfSystems).map(([system, findings], index) => (
            <div key={index} className="border p-3 rounded-md">
              <label className="block text-sm font-medium mb-1 capitalize">{system}</label>
              
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
