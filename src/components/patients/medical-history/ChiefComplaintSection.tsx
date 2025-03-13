
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

type ChiefComplaintProps = {
  chiefComplaint: string;
  presentIllness: string;
  editMode: boolean;
};

const ChiefComplaintSection = ({ 
  chiefComplaint, 
  presentIllness, 
  editMode 
}: ChiefComplaintProps) => {
  return (
    <AccordionItem value="chief-complaint">
      <AccordionTrigger className="text-base font-medium">Chief Complaint & Present Illness</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Chief Complaint</label>
            <Input 
              defaultValue={chiefComplaint} 
              readOnly={!editMode} 
              className={!editMode ? "bg-muted" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">History of Present Illness</label>
            <Textarea 
              defaultValue={presentIllness} 
              readOnly={!editMode}
              className={!editMode ? "bg-muted" : ""}
              rows={3}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ChiefComplaintSection;
