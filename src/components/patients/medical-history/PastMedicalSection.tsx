
import React from 'react';
import { Input } from '@/components/ui/input';
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
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

type Condition = {
  condition: string;
  diagnosedYear: number;
  status: string;
};

type PastMedicalSectionProps = {
  pastConditions: Condition[];
  editMode: boolean;
};

const PastMedicalSection = ({ 
  pastConditions, 
  editMode 
}: PastMedicalSectionProps) => {
  return (
    <AccordionItem value="past-medical">
      <AccordionTrigger className="text-base font-medium">Past Medical History</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          {pastConditions.map((condition, index) => (
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
  );
};

export default PastMedicalSection;
