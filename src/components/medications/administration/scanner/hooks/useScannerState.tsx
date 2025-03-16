
import { useState } from 'react';

export function useScannerState() {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [manualPatientId, setManualPatientId] = useState('');
  const [manualMedicationCode, setManualMedicationCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  return {
    activeTab,
    setActiveTab,
    manualPatientId,
    setManualPatientId,
    manualMedicationCode,
    setManualMedicationCode,
    scanning,
    setScanning,
    error,
    setError
  };
}
