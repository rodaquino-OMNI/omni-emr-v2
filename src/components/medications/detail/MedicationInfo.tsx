
import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Medication } from '../MedicationCard';
import { Separator } from '@/components/ui/separator';

interface MedicationInfoProps {
  medication: Medication;
  formatDate: (dateString?: string) => string;
}

const MedicationInfo: React.FC<MedicationInfoProps> = ({ 
  medication, 
  formatDate 
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Medication Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-3">Schedule Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(medication.startDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {medication.endDate ? formatDate(medication.endDate) : 'Ongoing'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Frequency</p>
                  <p className="text-sm text-muted-foreground">
                    {medication.frequency}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Dosage Information</h3>
            <p className="text-sm text-muted-foreground">{medication.dosage}</p>
            
            {/* Optional instructions would go here */}
            <p className="text-sm text-muted-foreground mt-2">
              Take with water, preferably with food.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Last Updated</h3>
            <p className="text-sm text-muted-foreground">2 days ago by {medication.prescribedBy}</p>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">Potential Interactions</h3>
                <p className="text-sm text-amber-700 dark:text-amber-500">
                  May interact with other blood pressure medications. Monitor blood pressure regularly.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground">
              Patient reported mild headaches during the first week. Symptoms resolved after continued use.
            </p>
          </div>
        </div>
      </div>
      
      <Separator className="my-8" />
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Medication History</h2>
        
        <div className="space-y-3">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">Prescription Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(medication.startDate)}</p>
              </div>
              <p className="text-xs text-muted-foreground">by {medication.prescribedBy}</p>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">Dosage Adjusted</p>
                <p className="text-sm text-muted-foreground">November 1, 2023</p>
              </div>
              <p className="text-xs text-muted-foreground">by Dr. Michael Chen</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Dosage adjusted from 5mg to 10mg based on patient response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationInfo;
