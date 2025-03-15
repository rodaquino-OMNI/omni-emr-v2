
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Info, AlertTriangle, ShieldCheck, Database } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center p-8 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="font-medium">Checking for interactions...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Querying medication databases and analyzing potential interactions
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Count interactions by severity
  const severityCounts = interactions.reduce((counts: Record<string, number>, interaction) => {
    const severity = interaction.severity.toLowerCase();
    counts[severity] = (counts[severity] || 0) + 1;
    return counts;
  }, {});

  // No interactions found
  if (interactions.length === 0) {
    return (
      <Alert className="mt-4 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
        <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle>No interactions detected</AlertTitle>
        <AlertDescription>
          No known interactions were found between the selected medications. 
          Always consult healthcare providers before making medication decisions.
        </AlertDescription>
      </Alert>
    );
  }

  // Interactions found - display summary and details
  return (
    <div className="space-y-4">
      {/* Summary section */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300">
              {interactions.length} Potential {interactions.length === 1 ? 'Interaction' : 'Interactions'} Found
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Review the details below for more information about each interaction.
            </p>
            
            {/* Severity distribution */}
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(severityCounts).map(([severity, count]) => (
                <div key={severity} className="flex items-center gap-1">
                  <InteractionSeverityBadge severity={severity} showTooltip={false} />
                  <span className="text-xs text-amber-700 dark:text-amber-400">
                    {count} {count === 1 ? 'interaction' : 'interactions'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data source information */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Database className="h-3.5 w-3.5" />
        <span>Powered by NIH Drug Interaction API</span>
      </div>

      {/* Detailed interactions */}
      <Accordion type="single" collapsible className="w-full">
        {interactions.map((interaction, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className={cn(
              "border rounded-md mb-2 overflow-hidden",
              interaction.severity.toLowerCase() === 'high' ? "border-red-200 dark:border-red-800" :
              interaction.severity.toLowerCase() === 'moderate' ? "border-amber-200 dark:border-amber-800" :
              "border-blue-200 dark:border-blue-800"
            )}
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/30">
              <div className="flex items-center gap-3 text-left">
                <InteractionSeverityBadge severity={interaction.severity} />
                <span className="font-medium">
                  {interaction.drugs.join(' + ')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-3">
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">Description</p>
                  <p className="text-muted-foreground">{interaction.description}</p>
                </div>
                
                {interaction.source && (
                  <div className="text-xs space-y-1">
                    <p className="font-medium text-foreground">Source</p>
                    <p className="text-muted-foreground">{interaction.source}</p>
                  </div>
                )}
                
                <div className="bg-muted/30 p-3 rounded-md text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-muted-foreground text-xs">
                      This information is from a medical database and should be reviewed with a healthcare professional.
                      Not all potential interactions may be listed.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Helper function for conditional class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default InteractionResults;
