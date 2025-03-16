
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

const PatientDetailLoader = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Back button skeleton */}
            <div className="h-9 w-36 bg-muted rounded animate-pulse mb-6"></div>
            
            {/* Patient header skeleton */}
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-muted animate-pulse"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-72 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="ml-auto flex space-x-2">
                  <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Tabs skeleton */}
            <div className="mb-4">
              <div className="flex space-x-2 border-b">
                <div className="h-10 w-24 bg-muted rounded-t animate-pulse"></div>
                <div className="h-10 w-24 bg-muted rounded-t animate-pulse"></div>
                <div className="h-10 w-24 bg-muted rounded-t animate-pulse"></div>
                <div className="h-10 w-24 bg-muted rounded-t animate-pulse"></div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded animate-pulse"></div>
              <div className="h-64 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDetailLoader;
