
import React from 'react';
import { Input } from '@/components/ui/input';
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

type SocialHistoryProps = {
  smoking: string;
  smokingDetails: string;
  alcohol: string;
  alcoholDetails: string;
  occupation: string;
  exercise: string;
  editMode: boolean;
};

const SocialHistorySection = ({
  smoking,
  smokingDetails,
  alcohol,
  alcoholDetails,
  occupation,
  exercise,
  editMode
}: SocialHistoryProps) => {
  return (
    <AccordionItem value="social-history">
      <AccordionTrigger className="text-base font-medium">Social History</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Smoking Status</label>
            {editMode ? (
              <Select defaultValue={smoking}>
                <SelectTrigger>
                  <SelectValue placeholder="Smoking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Former">Former</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input 
                defaultValue={smoking} 
                readOnly 
                className="bg-muted"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Smoking Details</label>
            <Input 
              defaultValue={smokingDetails} 
              readOnly={!editMode}
              className={!editMode ? "bg-muted" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alcohol Use</label>
            {editMode ? (
              <Select defaultValue={alcohol}>
                <SelectTrigger>
                  <SelectValue placeholder="Alcohol Use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Occasional">Occasional</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input 
                defaultValue={alcohol} 
                readOnly 
                className="bg-muted"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alcohol Details</label>
            <Input 
              defaultValue={alcoholDetails} 
              readOnly={!editMode}
              className={!editMode ? "bg-muted" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Occupation</label>
            <Input 
              defaultValue={occupation} 
              readOnly={!editMode}
              className={!editMode ? "bg-muted" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Exercise</label>
            {editMode ? (
              <Select defaultValue={exercise}>
                <SelectTrigger>
                  <SelectValue placeholder="Exercise Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input 
                defaultValue={exercise} 
                readOnly 
                className="bg-muted"
              />
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SocialHistorySection;
