import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export interface LaboratoryOrderDetails {
  tests: string[];
  specimenType?: string;
  collectionInstructions?: string;
  fastingRequired?: boolean;
  clinicalReason?: string;
  priority?: string;
  additionalInstructions?: string;
}

export interface LaboratoryOrderFormProps {
  initialData?: Partial<LaboratoryOrderDetails>;
  onChange: (data: LaboratoryOrderDetails) => void;
  errors?: Record<string, string>;
}

const LaboratoryOrderForm: React.FC<LaboratoryOrderFormProps> = ({
  initialData,
  onChange,
  errors = {}
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<LaboratoryOrderDetails>({
    tests: initialData?.tests || [],
    specimenType: initialData?.specimenType || 'blood',
    collectionInstructions: initialData?.collectionInstructions || '',
    fastingRequired: initialData?.fastingRequired || false,
    clinicalReason: initialData?.clinicalReason || '',
    priority: initialData?.priority || 'routine',
    additionalInstructions: initialData?.additionalInstructions || ''
  });

  const [newTest, setNewTest] = useState('');

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddTest = () => {
    if (newTest.trim()) {
      setFormData(prev => ({
        ...prev,
        tests: [...prev.tests, newTest.trim()]
      }));
      setNewTest('');
    }
  };

  const handleRemoveTest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }));
  };

  const specimenTypes = [
    { value: 'blood', label: t('blood', 'Blood') },
    { value: 'urine', label: t('urine', 'Urine') },
    { value: 'stool', label: t('stool', 'Stool') },
    { value: 'csf', label: t('csf', 'Cerebrospinal Fluid') },
    { value: 'sputum', label: t('sputum', 'Sputum') },
    { value: 'swab', label: t('swab', 'Swab') },
    { value: 'tissue', label: t('tissue', 'Tissue') },
    { value: 'other', label: t('other', 'Other') }
  ];

  const priorities = [
    { value: 'routine', label: t('routine', 'Routine') },
    { value: 'urgent', label: t('urgent', 'Urgent') },
    { value: 'stat', label: t('stat', 'STAT') }
  ];

  const commonTests = [
    { value: 'cbc', label: t('cbc', 'Complete Blood Count (CBC)') },
    { value: 'bmp', label: t('bmp', 'Basic Metabolic Panel (BMP)') },
    { value: 'cmp', label: t('cmp', 'Comprehensive Metabolic Panel (CMP)') },
    { value: 'lipid', label: t('lipid', 'Lipid Panel') },
    { value: 'thyroid', label: t('thyroid', 'Thyroid Panel') },
    { value: 'hba1c', label: t('hba1c', 'Hemoglobin A1C') },
    { value: 'urinalysis', label: t('urinalysis', 'Urinalysis') },
    { value: 'culture', label: t('culture', 'Culture & Sensitivity') }
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              {t('tests', 'Tests')} <span className="text-red-500">*</span>
            </Label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tests.map((test, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-muted px-3 py-1 rounded-md"
                >
                  <span className="mr-2">{test}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => handleRemoveTest(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newTest}
                onChange={(e) => setNewTest(e.target.value)}
                placeholder={t('enterTestName', 'Enter test name')}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTest}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                {t('add', 'Add')}
              </Button>
            </div>
            
            {errors.tests && (
              <p className="text-red-500 text-sm">{errors.tests}</p>
            )}
            
            <div className="mt-2">
              <Label className="text-sm text-muted-foreground mb-1 block">
                {t('commonTests', 'Common Tests')}
              </Label>
              <div className="flex flex-wrap gap-2">
                {commonTests.map((test) => (
                  <Button
                    key={test.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!formData.tests.includes(test.label)) {
                        setFormData(prev => ({
                          ...prev,
                          tests: [...prev.tests, test.label]
                        }));
                      }
                    }}
                  >
                    {test.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specimenType">
                {t('specimenType', 'Specimen Type')}
              </Label>
              <Select
                value={formData.specimenType}
                onValueChange={(value) => handleSelectChange('specimenType', value)}
              >
                <SelectTrigger id="specimenType">
                  <SelectValue placeholder={t('selectSpecimenType', 'Select specimen type')} />
                </SelectTrigger>
                <SelectContent>
                  {specimenTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">
                {t('priority', 'Priority')}
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder={t('selectPriority', 'Select priority')} />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collectionInstructions">
              {t('collectionInstructions', 'Collection Instructions')}
            </Label>
            <Textarea
              id="collectionInstructions"
              name="collectionInstructions"
              value={formData.collectionInstructions}
              onChange={handleInputChange}
              placeholder={t('enterCollectionInstructions', 'Enter specimen collection instructions')}
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="fastingRequired"
              checked={formData.fastingRequired}
              onCheckedChange={(checked) => 
                handleCheckboxChange('fastingRequired', checked === true)
              }
            />
            <Label htmlFor="fastingRequired" className="cursor-pointer">
              {t('fastingRequired', 'Fasting Required')}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicalReason">
              {t('clinicalReason', 'Clinical Reason')}
            </Label>
            <Textarea
              id="clinicalReason"
              name="clinicalReason"
              value={formData.clinicalReason}
              onChange={handleInputChange}
              placeholder={t('enterClinicalReason', 'Enter clinical reason for tests')}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInstructions">
              {t('additionalInstructions', 'Additional Instructions')}
            </Label>
            <Textarea
              id="additionalInstructions"
              name="additionalInstructions"
              value={formData.additionalInstructions}
              onChange={handleInputChange}
              placeholder={t('enterAdditionalInstructions', 'Enter any additional instructions')}
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaboratoryOrderForm;