
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientCareTasksTabProps } from './index';

const PatientCareTasksTab: React.FC<PatientCareTasksTabProps> = ({ patientId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Care Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Care tasks for this patient will be displayed here.</p>
          <div className="mt-4">
            <ul className="space-y-2">
              <li className="p-3 bg-muted rounded-md">
                <div className="font-medium">Daily vitals check</div>
                <div className="text-sm text-muted-foreground">Every 6 hours</div>
              </li>
              <li className="p-3 bg-muted rounded-md">
                <div className="font-medium">Medication administration</div>
                <div className="text-sm text-muted-foreground">As prescribed</div>
              </li>
              <li className="p-3 bg-muted rounded-md">
                <div className="font-medium">Wound dressing change</div>
                <div className="text-sm text-muted-foreground">Daily</div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientCareTasksTab;
