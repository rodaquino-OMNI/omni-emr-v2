
import React from 'react';
import { AlertCircle } from 'lucide-react';

const SpecialInstructions = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <h4 className="font-medium text-yellow-700">Special Instructions</h4>
      </div>
      <p className="text-sm text-yellow-600">
        Take with food. Avoid alcohol while taking this medication.
      </p>
    </div>
  );
};

export default SpecialInstructions;
