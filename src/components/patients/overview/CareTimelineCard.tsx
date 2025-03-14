
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '../PatientCard';

type CareTimelineCardProps = {
  patient: Patient;
};

const CareTimelineCard = ({ patient }: CareTimelineCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          Care Timeline
        </CardTitle>
        <CardDescription>Patient's care journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-indigo-200 pl-6 py-2 space-y-6">
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-indigo-600"></div>
            <div className="bg-indigo-50 p-3 rounded-md">
              <div className="text-sm font-medium">Hospital Admission</div>
              <div className="text-xs text-muted-foreground">7 days ago</div>
              <div className="text-xs mt-2">
                Initial presentation with symptoms of {patient.diagnosis}. Admitted for evaluation and treatment.
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-blue-600"></div>
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm font-medium">Treatment Initiated</div>
              <div className="text-xs text-muted-foreground">6 days ago</div>
              <div className="text-xs mt-2">
                Started on medication regimen. Initial response monitored.
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-green-600"></div>
            <div className="bg-green-50 p-3 rounded-md">
              <div className="text-sm font-medium">Condition Improving</div>
              <div className="text-xs text-muted-foreground">3 days ago</div>
              <div className="text-xs mt-2">
                Showing signs of improvement. Medication adjusted.
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-purple-600"></div>
            <div className="bg-purple-50 p-3 rounded-md">
              <div className="text-sm font-medium">Current Phase</div>
              <div className="text-xs text-muted-foreground">Today</div>
              <div className="text-xs mt-2">
                Continued treatment with monitoring. Preparing for discharge planning.
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-gray-300"></div>
            <div className="border border-dashed border-gray-300 p-3 rounded-md">
              <div className="text-sm font-medium text-muted-foreground">Planned Discharge</div>
              <div className="text-xs text-muted-foreground">In 3 days (estimated)</div>
              <div className="text-xs mt-2 text-muted-foreground">
                Expected discharge with follow-up care plan.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareTimelineCard;
