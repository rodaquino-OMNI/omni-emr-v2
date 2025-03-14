
import React from 'react';
import DrugInteractionChecker from './drugInteractions/DrugInteractionChecker';

// Export the main component for backward compatibility
export { DrugInteractionChecker };

// Main component that combines all medication-related features
const MedicationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Medication Management</h1>
      <DrugInteractionChecker />
    </div>
  );
};

export default MedicationsPage;
