
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

type ReviewOfSystemsProps = {
  reviewOfSystems: Record<string, string>;
  editMode: boolean;
};

const ReviewOfSystemsSection = ({ 
  reviewOfSystems, 
  editMode 
}: ReviewOfSystemsProps) => {
  return (
    <AccordionItem value="review-systems">
      <AccordionTrigger className="text-base font-medium">Review of Systems</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          {Object.entries(reviewOfSystems).map(([system, findings], index) => (
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
  );
};

export default ReviewOfSystemsSection;
