
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  patient_id: string;
  order_type: string;
  order_name: string;
  status: string;
  priority: string;
  created_at: string;
  ordered_by: string;
  details?: string;
  notes?: string;
  due_date?: string;
}

const PatientOrdersTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setOrders(data || []);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [patientId]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading orders: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            No orders recorded for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Group orders by type
  const ordersByType = orders.reduce((acc: Record<string, Order[]>, order) => {
    acc[order.order_type] = acc[order.order_type] || [];
    acc[order.order_type].push(order);
    return acc;
  }, {});
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'stat': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'routine': return 'bg-blue-100 text-blue-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {Object.entries(ordersByType).map(([type, typeOrders]) => (
        <Card key={type}>
          <CardHeader className="pb-2">
            <CardTitle className="capitalize">{type.replace(/_/g, ' ')} Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typeOrders.map((order) => (
                <div key={order.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="font-medium">{order.order_name}</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  {order.details && (
                    <div className="text-sm mt-2">{order.details}</div>
                  )}
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    <div>Ordered: {new Date(order.created_at).toLocaleDateString()}</div>
                    {order.due_date && <div>Due: {new Date(order.due_date).toLocaleDateString()}</div>}
                  </div>
                  
                  {order.notes && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">Notes: </span>
                      {order.notes}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    Ordered by: {order.ordered_by}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientOrdersTab;
