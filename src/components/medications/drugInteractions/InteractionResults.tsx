
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import InteractionSeverityBadge from './InteractionSeverityBadge';

interface Interaction {
  description: string;
  severity: string;
  source?: string;
  drugs: string[];
}

interface InteractionResultsProps {
  interactions: Interaction[];
  isLoading: boolean;
  error: string | null;
}

const InteractionResults: React.FC<InteractionResultsProps> = ({ 
  interactions, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Checking for interactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        {error}
      </Alert>
    );
  }

  if (interactions.length === 0) {
    return (
      <Alert className="mt-4">
        No interactions found between the selected medications.
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Interactions Found</h3>
      <Accordion type="single" collapsible className="w-full">
        {interactions.map((interaction, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <InteractionSeverityBadge severity={interaction.severity} />
                <span className="text-sm">
                  {interaction.drugs.join(' + ')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-sm space-y-2 pt-2">
                <p>{interaction.description}</p>
                {interaction.source && (
                  <p className="text-xs text-muted-foreground">
                    Source: {interaction.source}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default InteractionResults;
