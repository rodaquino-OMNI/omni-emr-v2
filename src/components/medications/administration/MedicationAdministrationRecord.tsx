
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Clock, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AdministrationRecord {
  id: string;
  medicationName: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  status: 'scheduled' | 'administered' | 'missed' | 'held';
  administeredBy?: string;
  administeredAt?: string;
  notes?: string;
}

interface MedicationAdministrationRecordProps {
  patientId: string;
}

const MedicationAdministrationRecord = ({ patientId }: MedicationAdministrationRecordProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const canAdministerMedications = permissions.checkMedicationPermission('administer');
  
  // Mock medication administration records
  const [administrationRecords, setAdministrationRecords] = useState<AdministrationRecord[]>([
    {
      id: '1',
      medicationName: 'Acetaminophen',
      dosage: '500mg',
      route: 'PO',
      scheduledTime: '08:00',
      status: 'administered',
      administeredBy: 'Nurse Johnson',
      administeredAt: '08:15',
      notes: 'Patient reported pain level 6/10 before administration'
    },
    {
      id: '2',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      route: 'PO',
      scheduledTime: '09:00',
      status: 'scheduled'
    },
    {
      id: '3',
      medicationName: 'Insulin Regular',
      dosage: '5 units',
      route: 'SubQ',
      scheduledTime: '11:30',
      status: 'scheduled'
    },
    {
      id: '4',
      medicationName: 'Furosemide',
      dosage: '20mg',
      route: 'IV',
      scheduledTime: '06:00',
      status: 'held',
      administeredBy: 'Dr. Smith',
      notes: 'Held due to low blood pressure'
    }
  ]);
  
  // Function to handle medication administration
  const handleAdminister = (recordId: string) => {
    if (!canAdministerMedications) {
      toast.error(t('permissionDenied'), {
        description: t('cannotAdministerMedications')
      });
      return;
    }
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setAdministrationRecords(records =>
      records.map(record => {
        if (record.id === recordId) {
          return {
            ...record,
            status: 'administered',
            administeredBy: user?.name || 'Current User',
            administeredAt: timeString
          };
        }
        return record;
      })
    );
    
    toast.success(t('medicationAdministered'), {
      description: t('medicationAdministrationRecorded')
    });
  };
  
  // Function to handle medication being held
  const handleHold = (recordId: string) => {
    if (!canAdministerMedications) {
      toast.error(t('permissionDenied'), {
        description: t('cannotAdministerMedications')
      });
      return;
    }
    
    // We would normally open a dialog to capture the reason
    const reason = 'Clinical decision';
    
    setAdministrationRecords(records =>
      records.map(record => {
        if (record.id === recordId) {
          return {
            ...record,
            status: 'held',
            administeredBy: user?.name || 'Current User',
            notes: `Held due to: ${reason}`
          };
        }
        return record;
      })
    );
    
    toast.success(t('medicationHeld'), {
      description: t('medicationMarkedAsHeld')
    });
  };
  
  // Get status badge color
  const getStatusBadge = (status: AdministrationRecord['status']) => {
    switch (status) {
      case 'administered':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          {t('administered')}
        </span>;
      case 'missed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" />
          {t('missed')}
        </span>;
      case 'held':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          {t('held')}
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          {t('scheduled')}
        </span>;
    }
  };
  
  // Record a new administration
  const handleAddAdministration = () => {
    // In a real app, this would open a form to add details
    toast.info(t('featureNotImplemented'), {
      description: t('medicationAdministrationFormWouldOpen')
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('medicationAdministrationRecord')}</CardTitle>
        {canAdministerMedications && (
          <Button size="sm" onClick={handleAddAdministration}>
            <PlusCircle className="h-4 w-4 mr-1" />
            {t('recordAdministration')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">{t('medication')}</th>
                <th className="py-2 text-left">{t('dosage')}</th>
                <th className="py-2 text-left">{t('route')}</th>
                <th className="py-2 text-left">{t('scheduledTime')}</th>
                <th className="py-2 text-left">{t('status')}</th>
                <th className="py-2 text-left">{t('administeredBy')}</th>
                <th className="py-2 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {administrationRecords.map((record) => (
                <tr key={record.id} className="border-b">
                  <td className="py-3">{record.medicationName}</td>
                  <td className="py-3">{record.dosage}</td>
                  <td className="py-3">{record.route}</td>
                  <td className="py-3">{record.scheduledTime}</td>
                  <td className="py-3">{getStatusBadge(record.status)}</td>
                  <td className="py-3">{record.administeredBy || '-'}</td>
                  <td className="py-3">
                    {record.status === 'scheduled' && canAdministerMedications && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleAdminister(record.id)}>
                          <Check className="h-3 w-3 mr-1" />
                          {t('administer')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleHold(record.id)}>
                          <X className="h-3 w-3 mr-1" />
                          {t('hold')}
                        </Button>
                      </div>
                    )}
                    {(record.status === 'administered' || record.status === 'held' || record.status === 'missed') && (
                      <Button variant="outline" size="sm">
                        {t('details')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!canAdministerMedications && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              {t('viewOnlyMedicationAdministration')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationAdministrationRecord;
