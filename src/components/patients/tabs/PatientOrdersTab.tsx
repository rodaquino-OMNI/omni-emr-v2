
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientTabProps } from '@/types/patient';
import { Badge } from '@/components/ui/badge';

const PatientOrdersTab: React.FC<PatientTabProps> = ({ patientId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Orders for this patient will be displayed here.</p>
          <div className="mt-4">
            <ul className="space-y-3">
              <li className="p-3 border rounded-md">
                <div className="flex justify-between">
                  <div className="font-medium">Complete Blood Count</div>
                  <Badge variant="outline">Lab</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">Ordered: 2023-06-20</div>
                <div className="text-sm text-muted-foreground">Status: Completed</div>
                <div className="text-sm mt-1">Routine, morning draw</div>
              </li>
              <li className="p-3 border rounded-md">
                <div className="flex justify-between">
                  <div className="font-medium">Chest X-Ray, 2 Views</div>
                  <Badge variant="outline">Imaging</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">Ordered: 2023-06-19</div>
                <div className="text-sm text-muted-foreground">Status: Pending</div>
                <div className="text-sm mt-1">Evaluate for pneumonia</div>
              </li>
              <li className="p-3 border rounded-md">
                <div className="flex justify-between">
                  <div className="font-medium">Cardiology Consultation</div>
                  <Badge variant="outline">Consult</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">Ordered: 2023-06-18</div>
                <div className="text-sm text-muted-foreground">Status: Scheduled</div>
                <div className="text-sm mt-1">Evaluate for heart murmur</div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientOrdersTab;
