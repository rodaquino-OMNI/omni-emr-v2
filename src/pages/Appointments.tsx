
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Appointments: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">This page is currently under development. Please check back later.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
