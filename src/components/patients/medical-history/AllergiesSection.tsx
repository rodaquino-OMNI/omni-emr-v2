
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

type Allergy = {
  allergen: string;
  reaction: string;
  severity: string;
};

type AllergiesSectionProps = {
  allergies: Allergy[];
  editMode: boolean;
};

const AllergiesSection = ({ 
  allergies, 
  editMode 
}: AllergiesSectionProps) => {
  return (
    <AccordionItem value="allergies">
      <AccordionTrigger className="text-base font-medium">Allergies</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          {allergies.map((allergy, index) => (
            <div key={index} className="flex flex-wrap gap-2 items-center">
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium mb-1">Allergen</label>
                <Input 
                  defaultValue={allergy.allergen} 
                  readOnly={!editMode}
                  className={!editMode ? "bg-muted" : ""}
                />
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium mb-1">Reaction</label>
                <Input 
                  defaultValue={allergy.reaction} 
                  readOnly={!editMode}
                  className={!editMode ? "bg-muted" : ""}
                />
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-sm font-medium mb-1">Severity</label>
                {editMode ? (
                  <Select defaultValue={allergy.severity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    defaultValue={allergy.severity} 
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
              Add Allergy
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default AllergiesSection;
