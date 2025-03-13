
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

type FamilyMember = {
  relation: string;
  condition: string;
  age: number;
};

type FamilyHistorySectionProps = {
  familyHistory: FamilyMember[];
  editMode: boolean;
};

const FamilyHistorySection = ({ 
  familyHistory, 
  editMode 
}: FamilyHistorySectionProps) => {
  return (
    <AccordionItem value="family-history">
      <AccordionTrigger className="text-base font-medium">Family History</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          {familyHistory.map((family, index) => (
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
  );
};

export default FamilyHistorySection;
