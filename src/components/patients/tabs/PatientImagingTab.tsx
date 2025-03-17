
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientTabProps } from '@/types/patient';

const PatientImagingTab: React.FC<PatientTabProps> = ({ patientId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Imaging Studies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Imaging studies for this patient will be displayed here.</p>
          <div className="mt-4">
            <ul className="space-y-3">
              <li className="p-3 bg-muted rounded-md">
                <div className="font-medium">Chest X-Ray</div>
                <div className="text-sm text-muted-foreground">Date: 2023-06-15</div>
                <div className="text-sm mt-1">No acute findings</div>
              </li>
              <li className="p-3 bg-muted rounded-md">
                <div className="font-medium">Abdominal Ultrasound</div>
                <div className="text-sm text-muted-foreground">Date: 2023-05-22</div>
                <div className="text-sm mt-1">Normal study</div>
              </li>
              <li className="p-3 bg-muted rounded-md">
                <div className="font-medium">MRI Brain</div>
                <div className="text-sm text-muted-foreground">Date: 2023-04-10</div>
                <div className="text-sm mt-1">No significant abnormalities</div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientImagingTab;
