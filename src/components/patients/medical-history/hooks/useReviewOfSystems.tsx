
import { useState, useEffect } from 'react';

export const findingsOptions = {
  constitutional: ["No fever", "No fatigue", "No weight changes", "Fever", "Fatigue", "Recent weight loss", "Recent weight gain"],
  respiratory: ["No cough", "No shortness of breath", "Cough", "Shortness of breath", "Wheezing", "Hemoptysis"],
  cardiovascular: ["No chest pain", "No palpitations", "No edema", "Chest pain", "Palpitations", "Edema", "Orthopnea"],
  gastrointestinal: ["No nausea", "No vomiting", "No abdominal pain", "Nausea", "Vomiting", "Abdominal pain", "Diarrhea", "Constipation"],
  musculoskeletal: ["No joint pain", "No swelling", "Joint pain", "Swelling", "Stiffness", "Limited range of motion"],
  neurological: ["No headaches", "No dizziness", "No numbness", "Headaches", "Dizziness", "Numbness", "Tingling", "Weakness"],
  psychiatric: ["No depression", "No anxiety", "Depression", "Anxiety", "Sleep disturbance", "Mood changes"]
};

export const useReviewOfSystems = (
  initialSystems: Record<string, string>,
  onUpdateSystem?: (system: string, value: string) => void
) => {
  const [selectedFindings, setSelectedFindings] = useState<Record<string, string[]>>({});
  
  useEffect(() => {
    const initialSelectedFindings: Record<string, string[]> = {};
    
    Object.entries(initialSystems).forEach(([system, findings]) => {
      // Parse the comma-separated findings string into an array
      if (findings && findings.trim() !== '') {
        initialSelectedFindings[system] = findings.split(', ').map(finding => finding.trim());
      } else {
        initialSelectedFindings[system] = [];
      }
    });
    
    setSelectedFindings(initialSelectedFindings);
  }, [initialSystems]);
  
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
  
  return {
    selectedFindings,
    handleFindingChange,
    handleFindingSelection
  };
};
