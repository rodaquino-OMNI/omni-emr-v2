
import React from 'react';

const LoadingHistoryState = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="h-6 w-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-muted-foreground">Loading history...</span>
    </div>
  );
};

export default LoadingHistoryState;
