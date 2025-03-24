import { supabase } from '@/integrations/supabase/client';
import { Order, OrderType, OrderStatus, OrderPriority } from '@/types/orders';
import { v4 as uuidv4 } from 'uuid';
import { isMockMode } from './mockService';

// Mock orders data for testing
const mockOrders: Order[] = [
  {
    id: '1',
    patientId: 'p1',
    doctorId: '1',
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
    doctorId: '1',
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
    doctorId: '1',
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
    doctorId: '1',
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
];

export interface CreateOrderParams {
  patientId: string;
  doctorId: string;
  orderType: OrderType;
  priority: OrderPriority;
  providerId?: string;
  providerName?: string;
  notes?: string;
  details: Record<string, any>;
}

export interface UpdateOrderParams {
  id: string;
  status?: OrderStatus;
  priority?: OrderPriority;
  providerId?: string;
  providerName?: string;
  notes?: string;
  details?: Record<string, any>;
}

export interface OrderFilter {
  patientId?: string;
  doctorId?: string;
  orderType?: OrderType;
  status?: OrderStatus;
  priority?: OrderPriority;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Create a new order
 */
export const createOrder = async (params: CreateOrderParams): Promise<Order> => {
  const { patientId, doctorId, orderType, priority, providerId, providerName, notes, details } = params;
  
  const newOrder: Omit<Order, 'id'> = {
    patientId,
    doctorId,
    orderType,
    type: orderType, // For backward compatibility
    priority,
    status: 'pending',
    orderDate: new Date().toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    providerId,
    providerName,
    notes,
    details
  };
  
  const { data, error } = await supabase
    .from('orders')
    .insert(newOrder)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    throw new Error(`Failed to create order: ${error.message}`);
  }
  
  return data as Order;
};

/**
 * Get an order by ID
 */
export const getOrderById = async (id: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching order:', error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
  
  return data as Order;
};

/**
 * Update an existing order
 */
export const updateOrder = async (params: UpdateOrderParams): Promise<Order> => {
  const { id, ...updateData } = params;
  
  const updates = {
    ...updateData,
    updatedAt: new Date()
  };
  
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order:', error);
    throw new Error(`Failed to update order: ${error.message}`);
  }
  
  return data as Order;
};

/**
 * Delete an order
 */
export const deleteOrder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting order:', error);
    throw new Error(`Failed to delete order: ${error.message}`);
  }
};

/**
 * Get orders with optional filtering
 */
export const getOrders = async (filter?: OrderFilter): Promise<Order[]> => {
  let query = supabase
    .from('orders')
    .select('*')
    .order('orderDate', { ascending: false });
  
  if (filter) {
    if (filter.patientId) {
      query = query.eq('patientId', filter.patientId);
    }
    
    if (filter.doctorId) {
      query = query.eq('doctorId', filter.doctorId);
    }
    
    if (filter.orderType) {
      query = query.eq('orderType', filter.orderType);
    }
    
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    
    if (filter.priority) {
      query = query.eq('priority', filter.priority);
    }
    
    if (filter.dateFrom) {
      query = query.gte('orderDate', filter.dateFrom);
    }
    
    if (filter.dateTo) {
      query = query.lte('orderDate', filter.dateTo);
    }
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
  
  return data as Order[];
};

/**
 * Get orders for a specific patient
 */
export const getPatientOrders = async (patientId: string): Promise<Order[]> => {
  return getOrders({ patientId });
};

/**
 * Get orders created by a specific doctor
 */
export const getDoctorOrders = async (doctorId: string): Promise<Order[]> => {
  return getOrders({ doctorId });
};

/**
 * Update order status
 */
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  return updateOrder({ id, status });
};

/**
 * Get orders by type
 */
export const getOrdersByType = async (orderType: OrderType): Promise<Order[]> => {
  return getOrders({ orderType });
};

/**
 * Get orders by status
 */
export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  return getOrders({ status });
};

/**
 * Get orders by priority
 */
export const getOrdersByPriority = async (priority: OrderPriority): Promise<Order[]> => {
  return getOrders({ priority });
};

/**
 * Get recent orders
 */
export const getRecentOrders = async (limit: number = 10): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('orderDate', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching recent orders:', error);
    throw new Error(`Failed to fetch recent orders: ${error.message}`);
  }
  
  return data as Order[];
};

// Export a default object with all functions
const orderService = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrders,
  getPatientOrders,
  getDoctorOrders,
  updateOrderStatus,
  getOrdersByType,
  getOrdersByStatus,
  getOrdersByPriority,
  getRecentOrders
};

export default orderService;