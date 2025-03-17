import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrescriptionDetails } from '@/hooks/prescriptions/usePrescriptionDetails';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useTranslation } from '@/hooks/useTranslation';

const PrescriptionView = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { prescription, loading, error } = usePrescriptionDetails(id);

  const adaptedPrescription = useMemo(() => {
    if (!prescription) return null;
  
    return {
      ...prescription,
      patientId: prescription.patient_id,
      doctorId: prescription.provider_id,
      date: prescription.created_at,
    };
  }, [prescription]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!adaptedPrescription) {
    return <ErrorMessage message={t('prescriptionNotFound')} />;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('prescriptionDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h4 className="text-sm font-medium">{t('patientId')}</h4>
              <p>{adaptedPrescription.patientId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t('doctorId')}</h4>
              <p>{adaptedPrescription.doctorId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t('date')}</h4>
              <p>{adaptedPrescription.date}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t('status')}</h4>
              <p>{adaptedPrescription.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionView;
