
import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VitalsChart from '@/components/ui/VitalsChart';
import { Patient } from '../PatientCard';

type VitalSignsCardProps = {
  patient: Patient;
};

const VitalSignsCard = ({ patient }: VitalSignsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Vital Signs
          </CardTitle>
          <Link to={`/vitals?patientId=${patient.id}`} className="text-sm text-primary flex items-center hover:underline">
            View History
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <CardDescription>Last recorded 2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Blood Pressure</div>
              <div className="text-lg font-semibold mt-1">120/80 mmHg</div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Heart Rate</div>
              <div className="text-lg font-semibold mt-1">78 bpm</div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Temperature</div>
              <div className="text-lg font-semibold mt-1">36.7 °C</div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Oxygen Saturation</div>
              <div className="text-lg font-semibold mt-1">98%</div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
          </div>
          
          <div className="h-44 mt-2">
            <VitalsChart patientId={patient.id} type="heartRate" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignsCard;
