
import React from 'react';
import { Shield } from 'lucide-react';

interface SystemCodeHeaderProps {
  system: string;
  code?: string;
}

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

const SystemCodeHeader = ({ system }: SystemCodeHeaderProps) => {
  const codeKey = system as keyof typeof snomedCodeMap;
  const snomedCode = snomedCodeMap[codeKey];
  
  return (
    <div className="flex justify-between items-center">
      <label className="block text-sm font-medium mb-1 capitalize">{system}</label>
      {snomedCode && (
        <span className="text-xs text-muted-foreground">
          SNOMED-CT: {snomedCode}
        </span>
      )}
    </div>
  );
};

export default SystemCodeHeader;
