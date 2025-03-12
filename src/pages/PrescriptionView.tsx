
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { getPrescriptionById } from '../services/prescriptionService';
import PrescriptionItemCard from '../components/prescriptions/PrescriptionItemCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Edit, Trash2, Calendar, User, UserRound } from 'lucide-react';

const PrescriptionViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        if (id) {
          const data = await getPrescriptionById(id);
          if (data) {
            setPrescription(data);
          } else {
            setError('Prescription not found');
          }
        }
      } catch (err) {
        console.error('Error fetching prescription:', err);
        setError('Failed to load prescription');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescription();
  }, [id]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
            <div className="max-w-6xl mx-auto w-full">
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-muted-foreground">Loading prescription...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (error || !prescription) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
            <div className="max-w-6xl mx-auto w-full">
              <div className="mb-6">
                <Link to="/prescriptions" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to prescriptions</span>
                </Link>
              </div>
              
              <div className="glass-card p-6">
                <div className="text-center py-8">
                  <h2 className="text-xl font-medium text-destructive mb-2">{error || 'Prescription not found'}</h2>
                  <p className="text-muted-foreground mb-4">The requested prescription could not be loaded.</p>
                  <Link to="/prescriptions">
                    <Button>Back to Prescriptions</Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Link to="/prescriptions" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to prescriptions</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="flex items-center text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button size="sm" className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Prescription Header */}
              <div className="glass-card p-6">
                <div className="flex flex-wrap justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold mb-2">Prescription #{prescription.id}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(prescription.date)}</span>
                      
                      <span className={`ml-4 px-3 py-1 rounded-full text-xs uppercase font-medium ${
                        prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                        prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 border-t border-border pt-6">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Patient Information
                    </h3>
                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="text-sm mb-1">
                        <span className="font-medium">Name:</span> {prescription.patientName}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">ID:</span> {prescription.patientId}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      Prescriber Information
                    </h3>
                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="text-sm mb-1">
                        <span className="font-medium">Name:</span> {prescription.doctorName}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">ID:</span> {prescription.doctorId}
                      </div>
                    </div>
                  </div>
                </div>
                
                {prescription.notes && (
                  <div className="mt-6 border-t border-border pt-6">
                    <h3 className="font-medium mb-2">Notes</h3>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm">{prescription.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Prescription Items */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium mb-4">Prescription Items</h2>
                
                {prescription.items.length > 0 ? (
                  <div className="space-y-4">
                    {prescription.items.map((item: any) => (
                      <PrescriptionItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No items in this prescription
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescriptionViewPage;
