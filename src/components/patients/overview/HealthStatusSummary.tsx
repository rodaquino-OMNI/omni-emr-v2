
import React from 'react';
import { Info } from 'lucide-react';
import { Patient } from '../PatientCard';

type HealthStatusSummaryProps = {
  patient: Patient;
};

const HealthStatusSummary = ({ patient }: HealthStatusSummaryProps) => {
  return (
    <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h2 className="text-lg font-semibold mb-3">Health Status Summary</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">AI-Generated Summary</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {patient.gender === 'Male' ? 'Male' : 'Female'} patient, {patient.age} years old, with a diagnosis of {patient.diagnosis}. 
              Current status is {patient.status}. Patient was admitted for management of symptoms related to {patient.diagnosis}. 
              Treatment has been initiated and patient is responding as expected. Vital signs are stable.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="text-xs text-muted-foreground">Risk Score</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <span className="text-amber-600">Medium</span>
              <span className="text-xs text-muted-foreground">↓ Decreasing</span>
            </div>
          </div>
          
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="text-xs text-muted-foreground">Functional Status</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <span>Partially Independent</span>
            </div>
          </div>
          
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="text-xs text-muted-foreground">Pain Level</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <span>3/10</span>
              <span className="text-xs text-green-600">↓ Improving</span>
            </div>
          </div>
          
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="text-xs text-muted-foreground">Treatment Phase</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <span>Active Treatment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthStatusSummary;
