// Update the import line only, fix the missing RxNormMedicationSelector export
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Check, Clock, FileText, Pill, Shield, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import RxNormMedicationSelector from '@/components/medications/RxNormMedicationSelector';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CurrentItem {
  id: string;
  name: string;
  rxnormCode: string;
  anvisaCode: string | null;
  portugueseName: string | null;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: string;
  endDate: string;
  instructions: string;
  reason: string;
  route: string; // Add this missing property
}

const PrescribeMedication = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user } = useAuth();

  const [currentItem, setCurrentItem] = useState<CurrentItem>({
    id: '',
    name: '',
    rxnormCode: '',
    anvisaCode: null,
    portugueseName: null,
    dosage: '',
    frequency: '',
    duration: '',
    startDate: '',
    endDate: '',
    instructions: '',
    reason: '',
    route: ''
  });

  const [items, setItems] = useState<CurrentItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('oral');
  const [sliderValue, setSliderValue] = useState([50]);
  const [isSaving, setIsSaving] = useState(false);

  const routes = [
    { value: 'oral', label: t('oral') },
    { value: 'iv', label: t('iv') },
    { value: 'im', label: t('im') },
    { value: 'subcutaneous', label: t('subcutaneous') },
    { value: 'topical', label: t('topical') },
    { value: 'rectal', label: t('rectal') },
    { value: 'vaginal', label: t('vaginal') },
    { value: 'inhaled', label: t('inhaled') },
    { value: 'ophthalmic', label: t('ophthalmic') },
    { value: 'otic', label: t('otic') },
    { value: 'nasal', label: t('nasal') },
  ];

  const handleMedicationSelect = (medication: {
    name: string;
    rxnormCode: string;
    anvisaCode: string | null;
    details: any;
    ndcs?: any[];
    portugueseName?: string | null;
  }) => {
    setCurrentItem(prev => ({
      ...prev,
      name: medication.name,
      rxnormCode: medication.rxnormCode,
      anvisaCode: medication.anvisaCode,
      portugueseName: medication.portugueseName
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.dosage || !currentItem.frequency || !currentItem.duration) {
      toast.error(t('fillAllFields'));
      return;
    }

    setItems(prevItems => [...prevItems, currentItem]);
    setCurrentItem({
      id: '',
      name: '',
      rxnormCode: '',
      anvisaCode: null,
      portugueseName: null,
      dosage: '',
      frequency: '',
      duration: '',
      startDate: '',
      endDate: '',
      instructions: '',
      reason: '',
      route: ''
    });
    setIsEditing(false);
  };

  const handleEditItem = (index: number) => {
    const itemToEdit = items[index];
    setCurrentItem(itemToEdit);
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
    setIsEditing(true);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleSavePrescription = async () => {
    setIsSaving(true);
    try {
      // Simulate saving to a database
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(t('prescriptionSaved'));
      navigate(`/patient/${patientId}`);
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error(t('prescriptionSaveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={handleCancel} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('backToPatient')}
      </Button>

      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>{t('prescribeMedication')}</CardTitle>
          <CardDescription>{t('createPrescriptionForPatient')}</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <Tabs defaultValue="medication" className="w-full">
            <TabsList>
              <TabsTrigger value="medication">{t('medication')}</TabsTrigger>
              <TabsTrigger value="details">{t('details')}</TabsTrigger>
              <TabsTrigger value="notes">{t('notes')}</TabsTrigger>
            </TabsList>

            <TabsContent value="medication" className="space-y-4">
              <RxNormMedicationSelector onMedicationSelect={handleMedicationSelect} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">{t('dosage')}</Label>
                  <Input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={currentItem.dosage}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">{t('frequency')}</Label>
                  <Input
                    type="text"
                    id="frequency"
                    name="frequency"
                    value={currentItem.frequency}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">{t('duration')}</Label>
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    value={currentItem.duration}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="route">{t('route')}</Label>
                  <Select value={selectedRoute} onValueChange={(value) => {
                    setSelectedRoute(value);
                    setCurrentItem(prev => ({ ...prev, route: value }));
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('selectRoute')} />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.value} value={route.value}>
                          {route.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">{t('startDate')}</Label>
                  <Input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={currentItem.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">{t('endDate')}</Label>
                  <Input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={currentItem.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">{t('instructions')}</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={currentItem.instructions}
                  onChange={handleInputChange}
                  placeholder={t('additionalInstructions')}
                />
              </div>

              <div>
                <Label htmlFor="reason">{t('reasonForPrescription')}</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={currentItem.reason}
                  onChange={handleInputChange}
                  placeholder={t('enterReason')}
                />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div>
                <Label htmlFor="notes">{t('prescriptionNotes')}</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('enterNotes')}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('medicationItems')}</h3>
            <Button onClick={handleAddItem} disabled={isSaving}>
              {isEditing ? t('updateItem') : t('addItem')}
            </Button>
          </div>

          {items.length === 0 ? (
            <Alert>
              <AlertTitle>{t('noMedicationsAdded')}</AlertTitle>
              <AlertDescription>{t('addMedicationsToPrescription')}</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {items.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                      {item.dosage} - {item.frequency} - {item.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditItem(index)}>
                      {t('edit')}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(index)}>
                      {t('remove')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <Label>{t('approval')}</Label>
            <div className="flex items-center space-x-2">
              <Switch id="approval" checked={isApproved} onCheckedChange={setIsApproved} />
              <span>{isApproved ? t('approved') : t('notApproved')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('completionStatus')}</Label>
            <RadioGroup defaultValue={isComplete ? 'complete' : 'incomplete'}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complete" id="complete" onClick={() => setIsComplete(true)} />
                <Label htmlFor="complete">{t('complete')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="incomplete" id="incomplete" onClick={() => setIsComplete(false)} />
                <Label htmlFor="incomplete">{t('incomplete')}</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t('dosageSlider')}</Label>
            <Slider
              defaultValue={sliderValue}
              max={100}
              step={1}
              onValueChange={setSliderValue}
            />
            <p>
              {t('selectedDosage')}: {sliderValue[0]}%
            </p>
          </div>
        </CardContent>

        <div className="flex justify-end space-x-2 p-4">
          <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSavePrescription} disabled={isSaving}>
            {isSaving ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                {t('saving')}...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t('savePrescription')}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PrescribeMedication;
