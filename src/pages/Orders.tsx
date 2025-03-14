
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { Pill, Microscope, ImageIcon, Stethoscope, UserPlus, Plus, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import OrderCreator from '@/components/orders/OrderCreator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order, OrderType } from '@/types/orders';

// Sample orders data for demonstration
const sampleOrders: Order[] = [
  {
    id: '1',
    patientId: '101',
    providerId: '201',
    providerName: 'Dr. Sarah Chen',
    type: 'medication',
    status: 'pending',
    createdAt: new Date('2023-11-15T08:30:00'),
    updatedAt: new Date('2023-11-15T08:30:00'),
    details: {
      medicationName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      route: 'Oral',
      duration: '7 days',
      instructions: 'Take with food'
    },
    priority: 'routine',
    notes: 'For bacterial infection'
  },
  {
    id: '2',
    patientId: '102',
    providerId: '201',
    providerName: 'Dr. Sarah Chen',
    type: 'laboratory',
    status: 'completed',
    createdAt: new Date('2023-11-10T14:15:00'),
    updatedAt: new Date('2023-11-10T14:15:00'),
    details: {
      tests: ['Complete Blood Count', 'Basic Metabolic Panel'],
      frequency: 'Once',
      clinicalReason: 'Annual checkup'
    },
    priority: 'routine'
  },
  {
    id: '3',
    patientId: '103',
    providerId: '202',
    providerName: 'Dr. Michael Rodriguez',
    type: 'radiology',
    status: 'approved',
    createdAt: new Date('2023-11-14T10:45:00'),
    updatedAt: new Date('2023-11-14T10:45:00'),
    details: {
      examType: 'x-ray',
      bodyPart: 'chest',
      contrast: false,
      clinicalReason: 'Suspected pneumonia'
    },
    priority: 'urgent'
  },
  {
    id: '4',
    patientId: '104',
    providerId: '203',
    providerName: 'Dr. Emily Johnson',
    type: 'consultation',
    status: 'pending',
    createdAt: new Date('2023-11-16T09:00:00'),
    updatedAt: new Date('2023-11-16T09:00:00'),
    details: {
      specialtyType: 'cardiology',
      reason: 'Evaluate heart murmur',
      urgency: 'routine'
    },
    priority: 'routine'
  }
];

const OrdersPage = () => {
  const { language } = useTranslation();
  const { user } = useAuth();
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof order.details === 'object' && 
        Object.values(order.details).some(
          value => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setShowNewOrderDialog(false);
  };

  const getOrderTypeIcon = (type: OrderType) => {
    switch (type) {
      case 'medication': return <Pill className="h-4 w-4" />;
      case 'laboratory': return <Microscope className="h-4 w-4" />;
      case 'radiology': return <ImageIcon className="h-4 w-4" />;
      case 'procedure': return <Stethoscope className="h-4 w-4" />;
      case 'consultation': return <UserPlus className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'routine': return 'bg-gray-100 text-gray-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'stat': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">
                {language === 'pt' ? 'Pedidos e Prescrições' : 'Orders & Prescriptions'}
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={language === 'pt' ? "Buscar pedidos..." : "Search orders..."}
                    className="w-full h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder={language === 'pt' ? "Status" : "Status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'pt' ? 'Todos os Status' : 'All Statuses'}</SelectItem>
                    <SelectItem value="draft">{language === 'pt' ? 'Rascunho' : 'Draft'}</SelectItem>
                    <SelectItem value="pending">{language === 'pt' ? 'Pendente' : 'Pending'}</SelectItem>
                    <SelectItem value="approved">{language === 'pt' ? 'Aprovado' : 'Approved'}</SelectItem>
                    <SelectItem value="completed">{language === 'pt' ? 'Concluído' : 'Completed'}</SelectItem>
                    <SelectItem value="cancelled">{language === 'pt' ? 'Cancelado' : 'Cancelled'}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder={language === 'pt' ? "Tipo" : "Type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'pt' ? 'Todos os Tipos' : 'All Types'}</SelectItem>
                    <SelectItem value="medication">{language === 'pt' ? 'Medicamento' : 'Medication'}</SelectItem>
                    <SelectItem value="laboratory">{language === 'pt' ? 'Laboratório' : 'Laboratory'}</SelectItem>
                    <SelectItem value="radiology">{language === 'pt' ? 'Radiologia' : 'Radiology'}</SelectItem>
                    <SelectItem value="procedure">{language === 'pt' ? 'Procedimento' : 'Procedure'}</SelectItem>
                    <SelectItem value="consultation">{language === 'pt' ? 'Consulta' : 'Consultation'}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="h-9" onClick={() => setShowNewOrderDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'pt' ? 'Novo Pedido' : 'New Order'}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            {getOrderTypeIcon(order.type)}
                            <CardTitle className="text-lg">
                              {order.type === 'medication' ? order.details.medicationName :
                               order.type === 'laboratory' ? 'Laboratory Tests' :
                               order.type === 'radiology' ? `${order.details.examType} - ${order.details.bodyPart}` :
                               order.type === 'procedure' ? order.details.procedureName :
                               order.type === 'consultation' ? `${order.details.specialtyType} Consultation` : 
                               'Order'}
                            </CardTitle>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {language === 'pt' ? 'Paciente ID:' : 'Patient ID:'} {order.patientId} | {language === 'pt' ? 'Médico:' : 'Provider:'} {order.providerName}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        {order.type === 'medication' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div><span className="font-medium">Dosage:</span> {order.details.dosage}</div>
                            <div><span className="font-medium">Frequency:</span> {order.details.frequency}</div>
                            <div><span className="font-medium">Route:</span> {order.details.route}</div>
                          </div>
                        )}
                        {order.type === 'laboratory' && (
                          <div>
                            <span className="font-medium">Tests:</span> {Array.isArray(order.details.tests) ? order.details.tests.join(', ') : order.details.tests}
                          </div>
                        )}
                        {order.type === 'radiology' && (
                          <div>
                            <div><span className="font-medium">Reason:</span> {order.details.clinicalReason}</div>
                            {order.details.contrast && <div><span className="font-medium">With Contrast</span></div>}
                          </div>
                        )}
                        {order.type === 'consultation' && (
                          <div>
                            <span className="font-medium">Reason:</span> {order.details.reason}
                          </div>
                        )}
                        {order.notes && <div className="mt-2 italic">{order.notes}</div>}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-1 border-t flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {language === 'pt' ? 'Pedido #' : 'Order #'}{order.id}
                      </span>
                      <Button variant="outline" size="sm">
                        {language === 'pt' ? 'Ver Detalhes' : 'View Details'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">
                    {language === 'pt' ? 'Nenhum pedido encontrado.' : 'No orders found.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
        <DialogContent className="max-w-3xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              {language === 'pt' ? 'Criar Novo Pedido' : 'Create New Order'}
            </DialogTitle>
          </DialogHeader>
          <OrderCreator
            patientId={selectedPatientId || '101'} // Default patient ID for demo
            patientName="John Doe" // Default patient name for demo
            onOrderCreated={handleOrderCreated}
            onCancel={() => setShowNewOrderDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
