
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Shield } from 'lucide-react';
import SystemCodeHeader from './components/SystemCodeHeader';
import FindingOptionButtons from './components/FindingOptionButtons';
import { findingsOptions, useReviewOfSystems } from './hooks/useReviewOfSystems';

type ReviewOfSystemsProps = {
  reviewOfSystems: Record<string, string>;
  editMode: boolean;
  onUpdateSystem?: (system: string, value: string) => void;
};

const ReviewOfSystemsSection = ({ 
  reviewOfSystems, 
  editMode,
  onUpdateSystem 
}: ReviewOfSystemsProps) => {
  const {
    selectedFindings,
    handleFindingChange,
    handleFindingSelection
  } = useReviewOfSystems(reviewOfSystems, onUpdateSystem);

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
              <SystemCodeHeader system={system} />
              
              {editMode ? (
                <div className="space-y-2">
                  <Textarea 
                    value={findings} 
                    onChange={(e) => handleFindingChange(system, e.target.value)}
                    className="mb-2"
                    rows={2}
                  />
                  
                  {system in findingsOptions && (
                    <FindingOptionButtons
                      system={system}
                      selectedFindings={selectedFindings[system] || []}
                      options={findingsOptions[system as keyof typeof findingsOptions]}
                      onSelect={handleFindingSelection}
                    />
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
