
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AppointmentListLoading = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <div key={index} className="p-4 space-y-3 border rounded-md">
          <div className="flex items-center justify-between">
            <Skeleton className="w-1/3 h-5" />
            <Skeleton className="w-24 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-8 rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
};

export default AppointmentListLoading;
