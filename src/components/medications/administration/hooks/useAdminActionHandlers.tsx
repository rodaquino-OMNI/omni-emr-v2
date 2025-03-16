
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { AdministrationRecord } from '../record/types';

/**
 * Hook to manage medication administration actions
 */
export function useAdminActionHandlers(setAdministrationRecords: React.Dispatch<React.SetStateAction<AdministrationRecord[]>>) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedRecord, setSelectedRecord] = useState<AdministrationRecord | null>(null);
  const [showMissedDialog, setShowMissedDialog] = useState(false);
  const [missedReason, setMissedReason] = useState('');
  const [showIVCalculator, setShowIVCalculator] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  const handleAdminister = (recordId: string) => {
    const record = setAdministrationRecords(records => {
      const foundRecord = records.find(r => r.id === recordId);
      if (foundRecord) {
        setSelectedRecord(foundRecord);
        setShowScanner(true);
      }
      return records;
    });
  };

  const completeAdministration = (recordId: string, timeString: string) => {
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
    
    toast.success(t('medicationAdministered'));
  };
  
  const handleHold = (recordId: string) => {
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
    
    toast.success(t('medicationHeld'));
  };
  
  const handleMissed = (recordId: string) => {
    setAdministrationRecords(records => {
      const foundRecord = records.find(r => r.id === recordId);
      if (foundRecord) {
        setSelectedRecord(foundRecord);
        setShowMissedDialog(true);
      }
      return records;
    });
  };
  
  const confirmMissed = () => {
    if (!selectedRecord || !missedReason) return;
    
    setAdministrationRecords(records =>
      records.map(record => {
        if (record.id === selectedRecord.id) {
          return {
            ...record,
            status: 'missed',
            administeredBy: user?.name || 'Current User',
            notes: `Missed dose: ${missedReason}`
          };
        }
        return record;
      })
    );
    
    toast.info(t('medicationMissed'));
    
    setShowMissedDialog(false);
    setSelectedRecord(null);
    setMissedReason('');
  };
  
  const handleIVCalculator = (recordId: string) => {
    setAdministrationRecords(records => {
      const foundRecord = records.find(r => r.id === recordId);
      if (foundRecord) {
        setSelectedRecord(foundRecord);
        setShowIVCalculator(true);
      }
      return records;
    });
  };
  
  const handleUpdateIVRate = (rate: number, duration: number) => {
    if (!selectedRecord) return;
    
    setAdministrationRecords(records =>
      records.map(record => {
        if (record.id === selectedRecord.id) {
          return {
            ...record,
            ivRate: rate,
            ivDuration: duration
          };
        }
        return record;
      })
    );
    
    toast.success(t('ivRateUpdated'));
    
    setShowIVCalculator(false);
    setSelectedRecord(null);
  };
  
  const handleAddAdministration = () => {
    toast.info(t('featureNotImplemented'));
  };
  
  return {
    selectedRecord,
    showMissedDialog,
    missedReason,
    showIVCalculator,
    showScanner,
    setMissedReason,
    setShowMissedDialog,
    setShowIVCalculator,
    setShowScanner,
    setSelectedRecord,
    handleAdminister,
    handleHold,
    handleMissed,
    handleIVCalculator,
    handleUpdateIVRate,
    handleAddAdministration,
    confirmMissed,
    completeAdministration
  };
}
