
import React from 'react';

export interface VitalSignsData {
  heartRate: number;
  respiratoryRate: number;
  bloodPressure: string;
  temperature: number;
  painLevel: number;
  oxygenSaturation: number;
}

export interface VitalSignsProps {
  vitals: VitalSignsData;
  patientId: string;
  canPerformTriage: boolean;
  onUpdateVitals: () => void;
}

const VitalSigns: React.FC<VitalSignsProps> = ({ 
  vitals, 
  patientId,
  canPerformTriage, 
  onUpdateVitals 
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Vital Signs</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Heart Rate</label>
          <div className="text-lg font-medium">{vitals.heartRate} bpm</div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Respiratory Rate</label>
          <div className="text-lg font-medium">{vitals.respiratoryRate} bpm</div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Blood Pressure</label>
          <div className="text-lg font-medium">{vitals.bloodPressure} mmHg</div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Temperature</label>
          <div className="text-lg font-medium">{vitals.temperature}°C</div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Pain Level</label>
          <div className="text-lg font-medium">{vitals.painLevel}/10</div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">O₂ Saturation</label>
          <div className="text-lg font-medium">{vitals.oxygenSaturation}%</div>
        </div>
      </div>
      
      {canPerformTriage && (
        <button 
          onClick={onUpdateVitals}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Vitals
        </button>
      )}
    </div>
  );
};

export default VitalSigns;
