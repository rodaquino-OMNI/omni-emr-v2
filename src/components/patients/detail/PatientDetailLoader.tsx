
import React from 'react';

const PatientDetailLoader = () => {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <span className="ml-2">Loading patient data...</span>
    </div>
  );
};

export default PatientDetailLoader;
