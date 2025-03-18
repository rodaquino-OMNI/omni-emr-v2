
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Filter, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import RecordsList from '@/components/records/RecordsList';
import { MedicalRecord, RecordType, RecordStatus } from '@/types/medicalRecords';
import { useRecords } from '@/hooks/useRecords';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { RoleBasedRoute } from '@/registry/RoleBasedRouter';
import AlertBanner from '@/components/ui/alert-banner';
import { AddRecordDialog } from '@/components/records/AddRecordDialog';
import { RecordTemplatesDialog } from '@/components/records/RecordTemplatesDialog';
import { WithRoleBasedAccess } from '@/components/auth/withRoleBasedAccess';

// Create placeholder data for demonstration
const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    title: 'Initial Assessment',
    type: 'progress_note',
    patientId: '123',
    date: '2023-06-15',
    provider: 'Dr. Smith',
    status: 'signed',
    content: 'Patient presented with fever and cough...',
    notes: 'Follow up in 2 weeks',
    media: [],
    templateId: ''
  },
  {
    id: '2',
    title: 'Follow Up Appointment',
    type: 'progress_note',
    patientId: '123',
    date: '2023-06-29',
    provider: 'Dr. Smith',
    status: 'signed',
    content: 'Patient's symptoms have improved...',
    notes: '',
    media: [],
    templateId: ''
  },
  {
    id: '3',
    title: 'Lab Results Review',
    type: 'lab_report',
    patientId: '123',
    date: '2023-06-16',
    provider: 'Dr. Lee',
    status: 'signed',
    content: 'Blood work shows elevated white blood cell count...',
    notes: 'Requires additional testing',
    media: ['lab_report_123.pdf'],
    templateId: ''
  },
  {
    id: '4',
    title: 'X-Ray Results',
    type: 'imaging',
    patientId: '123',
    date: '2023-06-17',
    provider: 'Dr. Johnson',
    status: 'signed',
    content: 'Chest X-ray shows mild lung opacity...',
    notes: '',
    media: ['xray_123.jpg'],
    templateId: ''
  },
  {
    id: '5',
    title: 'Medication Review',
    type: 'medication_review',
    patientId: '123',
    date: '2023-06-20',
    provider: 'Dr. Smith',
    status: 'draft',
    content: 'Current medications include...',
    notes: 'Consider adjusting dosage',
    media: [],
    templateId: ''
  },
];

const Records: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [showAddRecordDialog, setShowAddRecordDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const permissions = usePermissions(user);

  // Use the custom hook to fetch records from API
  const { records, loading, error, fetchRecords, createRecord, updateRecord } = useRecords();

  useEffect(() => {
    // In a real application, this would fetch data from an API
    // fetchRecords();
  }, []);

  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedRecord(record);
    // Navigate to the record detail page
    navigate(`/clinical-documentation/${record.id}/${record.patientId}`);
  };

  const handleAddRecord = () => {
    setShowAddRecordDialog(true);
  };

  const handleSaveRecord = (record: Partial<MedicalRecord>) => {
    // Call API to create record
    createRecord(record);
    setShowAddRecordDialog(false);
  };

  const handleCreateNewRecord = (record: Omit<MedicalRecord, 'id'>) => {
    // Call API to create record
    createRecord(record);
    setShowAddRecordDialog(false);
  };

  const handleUseTemplate = () => {
    setShowTemplatesDialog(true);
  };

  const handleSelectTemplate = (templateId: string) => {
    setShowTemplatesDialog(false);
    setShowAddRecordDialog(true);
    // Pre-fill the add record form with template data
    // This would be implemented in the AddRecordDialog component
  };

  const filteredRecords = mockMedicalRecords.filter(record => {
    // Apply filters
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = recordTypeFilter ? record.type === recordTypeFilter : true;
    const matchesStatus = statusFilter ? record.status === statusFilter : true;
    const matchesDate = dateRange?.from ? new Date(record.date) >= dateRange.from &&
                        (!dateRange.to || new Date(record.date) <= dateRange.to) : true;
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  return (
    <WithRoleBasedAccess
      requiredPermission="notes:view"
      requiredRoles={['doctor', 'nurse', 'specialist']}
    >
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('clinicalDocumentation', 'Clinical Documentation')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleUseTemplate}>
              {t('useTemplate', 'Use Template')}
            </Button>
            <Button onClick={handleAddRecord}>
              <Plus className="mr-2 h-4 w-4" /> {t('addNewRecord', 'Add New Record')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('medicalRecords', 'Medical Records')}</CardTitle>
            <CardDescription>{t('managePatientRecords', 'View and manage patient medical records')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('searchRecords', 'Search records...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <Select value={recordTypeFilter} onValueChange={setRecordTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder={t('recordType', 'Record Type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('all', 'All')}</SelectItem>
                      <SelectItem value="progress_note">{t('progressNote', 'Progress Note')}</SelectItem>
                      <SelectItem value="lab_report">{t('labReport', 'Lab Report')}</SelectItem>
                      <SelectItem value="imaging">{t('imaging', 'Imaging')}</SelectItem>
                      <SelectItem value="medication_review">{t('medicationReview', 'Medication Review')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder={t('status', 'Status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('all', 'All')}</SelectItem>
                      <SelectItem value="draft">{t('draft', 'Draft')}</SelectItem>
                      <SelectItem value="signed">{t('signed', 'Signed')}</SelectItem>
                      <SelectItem value="pending_cosign">{t('pendingCosign', 'Pending Cosign')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full md:w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
                          ) : (
                            format(dateRange.from, 'LLL dd, y')
                          )
                        ) : (
                          t('dateRange', 'Date Range')
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="p-2">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          initialFocus
                        />
                        <div className="flex justify-end mt-2 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setDateRange(undefined)}
                          >
                            {t('clear', 'Clear')}
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              // Apply date filter
                            }}
                          >
                            {t('apply', 'Apply')}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 md:w-[400px]">
                  <TabsTrigger value="all">{t('all', 'All')}</TabsTrigger>
                  <TabsTrigger value="progress_notes">{t('notes', 'Notes')}</TabsTrigger>
                  <TabsTrigger value="labs">{t('labs', 'Labs')}</TabsTrigger>
                  <TabsTrigger value="imaging">{t('imaging', 'Imaging')}</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <RecordsList 
                    records={filteredRecords} 
                    onRecordSelect={handleRecordSelect} 
                    loading={loading}
                  />
                </TabsContent>
                <TabsContent value="progress_notes">
                  <RecordsList 
                    records={filteredRecords.filter(r => r.type === 'progress_note')} 
                    onRecordSelect={handleRecordSelect}
                    loading={loading}
                  />
                </TabsContent>
                <TabsContent value="labs">
                  <RecordsList 
                    records={filteredRecords.filter(r => r.type === 'lab_report')} 
                    onRecordSelect={handleRecordSelect}
                    loading={loading}
                  />
                </TabsContent>
                <TabsContent value="imaging">
                  <RecordsList 
                    records={filteredRecords.filter(r => r.type === 'imaging')} 
                    onRecordSelect={handleRecordSelect}
                    loading={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AddRecordDialog 
          open={showAddRecordDialog} 
          onOpenChange={setShowAddRecordDialog}
          onSave={handleCreateNewRecord} 
        />
        <RecordTemplatesDialog
          open={showTemplatesDialog}
          onOpenChange={setShowTemplatesDialog}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </WithRoleBasedAccess>
  );
};

export default Records;
