
import React, { useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, UserCheck, FileCheck, Clipboard, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface AdmissionDischargeWorkflowProps {
  patientId: string;
  patientName: string;
}

const AdmissionDischargeWorkflow = ({ patientId, patientName }: AdmissionDischargeWorkflowProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const [activeTab, setActiveTab] = useState<'admission' | 'inpatient' | 'discharge'>('admission');
  
  // Check if user can perform the specific actions
  const canAdmitPatients = permissions.hasPermission('perform_admission_assessment') || 
                           permissions.hasPermission('create_admission_orders');
  const canDischargePatients = permissions.hasPermission('determine_discharge_readiness') || 
                              permissions.hasPermission('create_discharge_orders');
  const isPhysician = user?.role === 'doctor';
  const isNurse = user?.role === 'nurse';
  
  // Mock functions for workflow actions
  const handleAdmissionOrder = () => {
    toast.success(t('admissionOrderCreated'), {
      description: t('admissionOrderForPatient', { name: patientName })
    });
  };
  
  const handleAdmissionAssessment = () => {
    toast.success(t('admissionAssessmentStarted'), {
      description: t('nursingAssessmentStarted')
    });
  };
  
  const handleMedicationReconciliation = () => {
    toast.success(t('medicationReconciliationStarted'), {
      description: t('reviewingPatientMedications')
    });
  };
  
  const handleDischargeOrder = () => {
    toast.success(t('dischargeOrderCreated'), {
      description: t('patientMarkedForDischarge', { name: patientName })
    });
  };
  
  const handleDischargeSummary = () => {
    toast.success(t('dischargeSummaryStarted'), {
      description: t('completingDischargeSummary')
    });
  };
  
  const handleDischargeInstructions = () => {
    toast.success(t('dischargeInstructionsCreated'), {
      description: t('patientEducationMaterialsCreated')
    });
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="admission">{t('admission')}</TabsTrigger>
          <TabsTrigger value="inpatient">{t('inpatientCare')}</TabsTrigger>
          <TabsTrigger value="discharge">{t('discharge')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="admission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admissionProcess')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPhysician && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{t('physicianActions')}</h3>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleAdmissionOrder}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <FilePlus className="mr-2 h-4 w-4" />
                      {t('createAdmissionOrders')}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('admissionOrdersDescription')}
                    </p>
                  </div>
                </div>
              )}
              
              {isNurse && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{t('nursingActions')}</h3>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleAdmissionAssessment}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      {t('performAdmissionAssessment')}
                    </Button>
                    <Button 
                      onClick={handleMedicationReconciliation}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Clipboard className="mr-2 h-4 w-4" />
                      {t('performMedicationReconciliation')}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('nursingAdmissionDescription')}
                    </p>
                  </div>
                </div>
              )}
              
              {!canAdmitPatients && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    {t('noAdmissionPermissions')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inpatient" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('inpatientCareManagement')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t('ongoingCare')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('inpatientCareDescription')}
                </p>
                <div className="mt-4 grid gap-2">
                  <Button variant="outline">
                    {t('viewClinicalDocumentation')}
                  </Button>
                  <Button variant="outline">
                    {t('viewVitalSigns')}
                  </Button>
                  <Button variant="outline">
                    {t('viewMedicationAdministration')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discharge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dischargeProcess')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPhysician && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{t('physicianDischargeActions')}</h3>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleDischargeOrder}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <FileCheck className="mr-2 h-4 w-4" />
                      {t('createDischargeOrders')}
                    </Button>
                    <Button 
                      onClick={handleDischargeSummary}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <FilePlus className="mr-2 h-4 w-4" />
                      {t('completeDischargeSummary')}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('dischargeOrdersDescription')}
                    </p>
                  </div>
                </div>
              )}
              
              {isNurse && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{t('nursingDischargeActions')}</h3>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleDischargeInstructions}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      {t('createDischargeInstructions')}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('nursingDischargeDescription')}
                    </p>
                  </div>
                </div>
              )}
              
              {!canDischargePatients && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    {t('noDischargePermissions')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdmissionDischargeWorkflow;
