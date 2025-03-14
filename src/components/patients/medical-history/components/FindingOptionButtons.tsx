
import React from 'react';

interface FindingOptionButtonsProps {
  system: string;
  selectedFindings: string[];
  options: string[];
  onSelect: (system: string, finding: string) => void;
}

const FindingOptionButtons = ({ 
  system, 
  selectedFindings, 
  options, 
  onSelect 
}: FindingOptionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((finding, idx) => (
        <button
          key={idx}
          type="button"
          className={`text-xs px-2 py-1 rounded-full border ${
            selectedFindings?.includes(finding)
              ? 'bg-primary text-primary-foreground'
              : 'bg-background hover:bg-muted'
          }`}
          onClick={() => onSelect(system, finding)}
        >
          {finding}
        </button>
      ))}
    </div>
  );
};

export default FindingOptionButtons;
