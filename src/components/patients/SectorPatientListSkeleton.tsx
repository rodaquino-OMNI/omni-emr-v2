
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface SectorPatientListSkeletonProps {
  count?: number;
}

const SectorPatientListSkeleton = ({ count = 5 }: SectorPatientListSkeletonProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      <div className="divide-y divide-border">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="py-4 flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-9 w-10 rounded-md" />
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-9 w-24" />
        <div className="flex space-x-1">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
};

export default SectorPatientListSkeleton;
