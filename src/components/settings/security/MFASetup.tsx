
import React from 'react';

interface MFASetupProps {
  onClose: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ onClose }) => {
  return (
    <div className="bg-background p-6 rounded-lg border shadow-md">
      <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication Setup</h2>
      <p className="mb-4">This is a placeholder for MFA setup functionality.</p>
      <button 
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default MFASetup;
