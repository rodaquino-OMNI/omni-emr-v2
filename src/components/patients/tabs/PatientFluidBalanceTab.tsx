
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientTabProps } from '@/types/patient';

const PatientFluidBalanceTab: React.FC<PatientTabProps> = ({ patientId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Fluid Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Fluid intake and output for this patient will be displayed here.</p>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Total Intake (24h)</h3>
              <div className="text-2xl font-bold">2,400 ml</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Oral: 1,800 ml<br />
                IV: 600 ml
              </div>
            </div>
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Total Output (24h)</h3>
              <div className="text-2xl font-bold">2,100 ml</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Urine: 1,900 ml<br />
                Other: 200 ml
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientFluidBalanceTab;
