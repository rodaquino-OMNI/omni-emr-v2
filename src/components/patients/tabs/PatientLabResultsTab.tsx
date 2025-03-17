
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientTabProps } from '@/types/patient';

const PatientLabResultsTab: React.FC<PatientTabProps> = ({ patientId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Laboratory results for this patient will be displayed here.</p>
          <div className="mt-4">
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Test</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Result</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference Range</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2">Hemoglobin</td>
                    <td className="px-4 py-2">14.2 g/dL</td>
                    <td className="px-4 py-2">12.0-16.0 g/dL</td>
                    <td className="px-4 py-2">2023-06-20</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">White Blood Cell Count</td>
                    <td className="px-4 py-2">8.3 x10^9/L</td>
                    <td className="px-4 py-2">4.5-11.0 x10^9/L</td>
                    <td className="px-4 py-2">2023-06-20</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Platelet Count</td>
                    <td className="px-4 py-2">245 x10^9/L</td>
                    <td className="px-4 py-2">150-450 x10^9/L</td>
                    <td className="px-4 py-2">2023-06-20</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Glucose</td>
                    <td className="px-4 py-2">105 mg/dL</td>
                    <td className="px-4 py-2">70-99 mg/dL</td>
                    <td className="px-4 py-2">2023-06-20</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientLabResultsTab;
