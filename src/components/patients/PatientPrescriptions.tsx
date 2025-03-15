
import React from 'react';
import { Link } from 'react-router-dom';
import { PrescriptionsList } from '../prescriptions';
import { ClipboardList, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

type PatientPrescriptionsProps = {
  patientId: string;
  prescriptions: any[];
  loading: boolean;
};

const PatientPrescriptions = ({ patientId, prescriptions, loading }: PatientPrescriptionsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="glass-card p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-medical-purple/10 flex items-center justify-center">
            <ClipboardList className="h-4 w-4 text-medical-purple" />
          </div>
          <h2 className="text-xl font-medium">{t('prescriptions')}</h2>
        </div>
        
        <Link to={`/prescribe/${patientId}`}>
          <Button size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            {t('newPrescription')}
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">{t('loadingPrescriptions')}...</p>
        </div>
      ) : (
        <PrescriptionsList 
          prescriptions={prescriptions}
          patientId={patientId}
          showAddNew={false}
        />
      )}
    </div>
  );
};

export default PatientPrescriptions;
