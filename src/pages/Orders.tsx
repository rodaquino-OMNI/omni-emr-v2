
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order, OrderType, OrderStatus, OrderPriority } from '@/types/orders';
import { useAuth } from '@/context/AuthContext';

// This is a placeholder component for a real Orders page
const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      patientId: 'p1',
      doctorId: user?.id || 'unknown',
      providerId: 'prov1',
      providerName: 'Dr. Johnson',
      orderType: 'medication',
      type: 'medication', // For backward compatibility
      priority: 'routine',
      status: 'pending',
      orderDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: 'Take with food',
      details: {
        medicationName: 'Acetaminophen',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        route: 'Oral',
        instructions: 'Take with food'
      }
    },
    {
      id: '2',
      patientId: 'p2',
      doctorId: user?.id || 'unknown',
      providerId: 'prov2',
      providerName: 'Lab Corp',
      orderType: 'laboratory',
      type: 'laboratory', // For backward compatibility
      priority: 'routine',
      status: 'completed',
      orderDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      details: {
        tests: ['CBC', 'Metabolic Panel'],
        frequency: 'Once',
        clinicalReason: 'Annual check-up'
      }
    },
    {
      id: '3',
      patientId: 'p3',
      doctorId: user?.id || 'unknown',
      providerId: 'prov3',
      providerName: 'Imaging Center',
      orderType: 'radiology',
      type: 'radiology', // For backward compatibility
      priority: 'urgent',
      status: 'approved',
      orderDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      details: {
        examType: 'X-Ray',
        bodyPart: 'Chest',
        contrast: false,
        clinicalReason: 'Suspected pneumonia'
      }
    },
    {
      id: '4',
      patientId: 'p4',
      doctorId: user?.id || 'unknown',
      providerId: 'prov4',
      providerName: 'Dr. Specialist',
      orderType: 'consultation',
      type: 'consultation', // For backward compatibility
      priority: 'routine',
      status: 'pending',
      orderDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      details: {
        specialtyType: 'Cardiology',
        reason: 'Cardiac evaluation',
        urgency: 'Non-urgent'
      }
    }
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button>New Order</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map(order => (
          <Card key={order.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between">
                <div>{order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)} Order</div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div><strong>Provider:</strong> {order.providerName}</div>
                <div><strong>Priority:</strong> {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</div>
                <div><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</div>
                {order.notes && <div><strong>Notes:</strong> {order.notes}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
