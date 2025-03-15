
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Check, X, AlertCircle, Clock, PlusCircle, 
  Syringe, Pill, Activity, Droplets, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TimelineView from './TimelineView';
import PatientSafetyHeader from './PatientSafetyHeader';
import MedicationScanner from './MedicationScanner';
import IVCalculator from './IVCalculator';

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
  medicationType?: 'regular' | 'antibiotic' | 'analgesic' | 'critical' | 'prn';
  isIV?: boolean;
  ivRate?: number;
  ivDuration?: number;
}

interface PatientData {
  id: string;
  name: string;
  allergies: string[];
  roomNumber: string;
  mrn: string;
}

interface MedicationAdministrationRecordProps {
  patientId: string;
}

const MedicationAdministrationRecord = ({ patientId }: MedicationAdministrationRecordProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const canAdministerMedications = permissions.checkMedicationPermission('administer');
  
  // State for medication administration
  const [administrationRecords, setAdministrationRecords] = useState<AdministrationRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AdministrationRecord | null>(null);
  const [showMissedDialog, setShowMissedDialog] = useState(false);
  const [missedReason, setMissedReason] = useState('');
  const [showIVCalculator, setShowIVCalculator] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedPatientId, setScannedPatientId] = useState('');
  const [scannedMedicationCode, setScannedMedicationCode] = useState('');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  
  // Fetch patient data and medication records
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For now, we'll use mock data
    const mockPatient: PatientData = {
      id: patientId,
      name: "John Doe",
      allergies: ["Penicillin", "Sulfa drugs", "Latex"],
      roomNumber: "101",
      mrn: "MRN001"
    };
    
    const mockMedications: AdministrationRecord[] = [
      {
        id: '1',
        medicationName: 'Acetaminophen',
        dosage: '500mg',
        route: 'PO',
        scheduledTime: '08:00',
        status: 'administered',
        administeredBy: 'Nurse Johnson',
        administeredAt: '08:15',
        notes: 'Patient reported pain level 6/10 before administration',
        medicationType: 'analgesic'
      },
      {
        id: '2',
        medicationName: 'Lisinopril',
        dosage: '10mg',
        route: 'PO',
        scheduledTime: '09:00',
        status: 'scheduled',
        medicationType: 'regular'
      },
      {
        id: '3',
        medicationName: 'Insulin Regular',
        dosage: '5 units',
        route: 'SubQ',
        scheduledTime: '11:30',
        status: 'scheduled',
        medicationType: 'critical'
      },
      {
        id: '4',
        medicationName: 'Furosemide',
        dosage: '20mg',
        route: 'IV',
        scheduledTime: '06:00',
        status: 'held',
        administeredBy: 'Dr. Smith',
        notes: 'Held due to low blood pressure',
        medicationType: 'regular',
        isIV: true,
        ivRate: 20,
        ivDuration: 30
      },
      {
        id: '5',
        medicationName: 'Ceftriaxone',
        dosage: '1g',
        route: 'IV',
        scheduledTime: '10:00',
        status: 'scheduled',
        medicationType: 'antibiotic',
        isIV: true,
        ivRate: 100,
        ivDuration: 60
      },
      {
        id: '6',
        medicationName: 'Morphine',
        dosage: '2mg',
        route: 'IV',
        scheduledTime: '14:00',
        status: 'scheduled',
        medicationType: 'prn',
        isIV: true,
        ivRate: 10,
        ivDuration: 5
      }
    ];
    
    setPatientData(mockPatient);
    setAdministrationRecords(mockMedications);
  }, [patientId]);
  
  // Function to handle medication administration
  const handleAdminister = (recordId: string) => {
    if (!canAdministerMedications) {
      toast.error(t('permissionDenied'), {
        description: t('cannotAdministerMedications')
      });
      return;
    }
    
    const record = administrationRecords.find(r => r.id === recordId);
    if (!record) return;
    
    setSelectedRecord(record);
    setShowScanner(true);
  };
  
  // Verify scanned data and complete administration
  const handleVerify = () => {
    if (!selectedRecord) return;
    
    // In a real app, we would verify the scanned patient ID against the patient ID
    // and the scanned medication code against the medication
    // For demo purposes, we'll just check if both values are non-empty
    if (scannedPatientId && scannedMedicationCode) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      completeAdministration(selectedRecord.id, timeString);
      setShowScanner(false);
      resetScannerState();
    } else {
      toast.error(t('verificationFailed'), {
        description: t('scanBothPatientAndMedication')
      });
    }
  };
  
  const resetScannerState = () => {
    setSelectedRecord(null);
    setScannedPatientId('');
    setScannedMedicationCode('');
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
  
  // Function to mark medication as missed
  const handleMissed = (recordId: string) => {
    if (!canAdministerMedications) {
      toast.error(t('permissionDenied'), {
        description: t('cannotAdministerMedications')
      });
      return;
    }
    
    const record = administrationRecords.find(r => r.id === recordId);
    if (!record) return;
    
    setSelectedRecord(record);
    setShowMissedDialog(true);
  };
  
  // Function to confirm missed medication
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
    
    toast.info(t('medicationMissed'), {
      description: t('missedDoseDocumented')
    });
    
    setShowMissedDialog(false);
    setSelectedRecord(null);
    setMissedReason('');
  };
  
  // Function to open IV calculator
  const handleIVCalculator = (recordId: string) => {
    const record = administrationRecords.find(r => r.id === recordId);
    if (!record) return;
    
    setSelectedRecord(record);
    setShowIVCalculator(true);
  };
  
  // Function to update IV rate
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
    
    toast.success(t('ivRateUpdated'), {
      description: t('ivCalculationComplete')
    });
    
    setShowIVCalculator(false);
    setSelectedRecord(null);
  };
  
  // Get status badge color
  const getStatusBadge = (status: AdministrationRecord['status']) => {
    switch (status) {
      case 'administered':
        return <Badge variant="success" className="flex items-center gap-1">
          <Check className="w-3 h-3" />
          {t('administered')}
        </Badge>;
      case 'missed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <X className="w-3 h-3" />
          {t('missed')}
        </Badge>;
      case 'held':
        return <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {t('held')}
        </Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t('scheduled')}
        </Badge>;
    }
  };
  
  // Get medication type icon
  const getMedicationTypeIcon = (type: string) => {
    switch (type) {
      case 'antibiotic':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          {t('antibiotic')}
        </Badge>;
      case 'analgesic':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Pill className="w-3 h-3" />
          {t('analgesic')}
        </Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {t('critical')}
        </Badge>;
      case 'prn':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t('prn')}
        </Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
          <Pill className="w-3 h-3" />
          {t('regular')}
        </Badge>;
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
    <>
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
          {patientData && (
            <PatientSafetyHeader 
              patient={patientData}
              className="mb-4"
            />
          )}
          
          <div className="mb-6">
            <TimelineView 
              medications={administrationRecords} 
              onAdminister={handleAdminister}
              onHold={handleHold}
              onMissed={handleMissed}
              onCalculateIV={handleIVCalculator}
              canAdminister={canAdministerMedications}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">{t('medications')}</th>
                  <th className="py-2 text-left">{t('type')}</th>
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
                    <td className="py-3">
                      <div className="flex items-center">
                        {record.medicationName}
                        
                        {patientData?.allergies.some(allergy => 
                          record.medicationName.toLowerCase().includes(allergy.toLowerCase())
                        ) && (
                          <Popover>
                            <PopoverTrigger>
                              <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-red-50 border-red-200">
                              <div className="font-semibold text-red-700">{t('allergyWarning')}</div>
                              <div className="text-red-600 mt-1">
                                {t('patientHasAllergy', { medication: record.medicationName })}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </td>
                    <td className="py-3">{getMedicationTypeIcon(record.medicationType || 'regular')}</td>
                    <td className="py-3">{record.dosage}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        {record.route}
                        {record.isIV && (
                          <Popover>
                            <PopoverTrigger>
                              <Info className="h-4 w-4 ml-2 text-blue-500" />
                            </PopoverTrigger>
                            <PopoverContent className="w-60">
                              <div className="font-semibold">{t('ivDetails')}</div>
                              <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
                                <div>{t('rate')}:</div>
                                <div>{record.ivRate} mL/hr</div>
                                <div>{t('duration')}:</div>
                                <div>{record.ivDuration} min</div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </td>
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
                          <Button variant="outline" size="sm" onClick={() => handleMissed(record.id)}>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {t('missed')}
                          </Button>
                          {record.isIV && (
                            <Button variant="outline" size="sm" onClick={() => handleIVCalculator(record.id)}>
                              <Droplets className="h-3 w-3 mr-1" />
                              {t('ivRate')}
                            </Button>
                          )}
                        </div>
                      )}
                      {(record.status === 'administered' || record.status === 'held' || record.status === 'missed') && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              {t('details')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="font-medium">{t('administrationDetails')}</div>
                            <div className="mt-2 space-y-1 text-sm">
                              {record.administeredBy && (
                                <div>
                                  <span className="font-semibold">{t('by')}:</span> {record.administeredBy}
                                </div>
                              )}
                              {record.administeredAt && (
                                <div>
                                  <span className="font-semibold">{t('at')}:</span> {record.administeredAt}
                                </div>
                              )}
                              {record.notes && (
                                <div>
                                  <span className="font-semibold">{t('notes')}:</span> {record.notes}
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
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
      
      {/* Missed medication dialog */}
      <Dialog open={showMissedDialog} onOpenChange={setShowMissedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('documentMissedDose')}</DialogTitle>
            <DialogDescription>
              {selectedRecord?.medicationName} {selectedRecord?.dosage}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="missed-reason">{t('reasonMissed')}</Label>
              <Textarea
                id="missed-reason"
                value={missedReason}
                onChange={(e) => setMissedReason(e.target.value)}
                placeholder={t('enterReasonMissed')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMissedDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={confirmMissed} disabled={!missedReason}>
              {t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Scanning verification dialog */}
      <MedicationScanner 
        open={showScanner}
        onClose={() => setShowScanner(false)}
        patient={patientData}
        medication={selectedRecord}
        onPatientScan={setScannedPatientId}
        onMedicationScan={setScannedMedicationCode}
        onVerify={handleVerify}
        patientScanned={!!scannedPatientId}
        medicationScanned={!!scannedMedicationCode}
      />
      
      {/* IV Calculator dialog */}
      <IVCalculator 
        open={showIVCalculator}
        onClose={() => setShowIVCalculator(false)}
        medication={selectedRecord}
        initialRate={selectedRecord?.ivRate}
        initialDuration={selectedRecord?.ivDuration}
        onSave={handleUpdateIVRate}
      />
    </>
  );
};

export default MedicationAdministrationRecord;
