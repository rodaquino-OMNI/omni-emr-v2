
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { usePrescriptionDetails } from '../hooks/prescriptions/usePrescriptionDetails';
import { 
  PrescriptionHeader, 
  PrescriptionItems, 
  LoadingState 
} from '../components/prescriptions/view';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrescriptionViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { prescription, loading, error, formatDate } = usePrescriptionDetails(id);
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="mb-6">
              <Link to="/prescriptions">
                <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Back to prescriptions
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <LoadingState error={null} />
            ) : error || !prescription ? (
              <LoadingState error={error || 'Prescription not found'} />
            ) : (
              <div className="space-y-6">
                <PrescriptionHeader 
                  prescription={prescription} 
                  formatDate={formatDate} 
                />
                
                <PrescriptionItems prescription={prescription} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescriptionViewPage;
