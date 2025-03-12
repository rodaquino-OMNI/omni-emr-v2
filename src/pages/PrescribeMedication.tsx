
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { useTranslation } from '../hooks/useTranslation';
import { ArrowLeft, Save, Pill, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PrescribeMedicationPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [medicationData, setMedicationData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    instructions: '',
    sideEffects: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMedicationData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would typically make an API call to save the prescription
    console.log('Prescribing medication:', medicationData);
    
    toast({
      title: "Medication prescribed",
      description: `${medicationData.name} has been prescribed successfully.`,
    });
    
    // Navigate back to the patient's profile
    if (patientId) {
      navigate(`/patients/${patientId}`);
    } else {
      navigate('/medications');
    }
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="mb-6">
              <Button 
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
              <h1 className="text-2xl font-semibold">{t('prescribeMedication')}</h1>
            </div>
            
            <div className="glass-card p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t('medicationName')} *
                    </label>
                    <input
                      id="name"
                      name="name"
                      className="w-full h-10 px-3 rounded-md border border-border bg-background"
                      required
                      value={medicationData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="dosage" className="text-sm font-medium">
                      {t('dosage')} *
                    </label>
                    <input
                      id="dosage"
                      name="dosage"
                      className="w-full h-10 px-3 rounded-md border border-border bg-background"
                      required
                      value={medicationData.dosage}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="frequency" className="text-sm font-medium">
                      {t('frequency')} *
                    </label>
                    <select
                      id="frequency"
                      name="frequency"
                      className="w-full h-10 px-3 rounded-md border border-border bg-background"
                      required
                      value={medicationData.frequency}
                      onChange={handleChange}
                    >
                      <option value="">Select Frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="Every morning">Every morning</option>
                      <option value="Every evening">Every evening</option>
                      <option value="Every 4 hours">Every 4 hours</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                      {t('startDate')} *
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="w-full h-10 px-3 rounded-md border border-border bg-background"
                      required
                      value={medicationData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                      {t('endDate')}
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="w-full h-10 px-3 rounded-md border border-border bg-background"
                      value={medicationData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="instructions" className="text-sm font-medium">
                      Instructions *
                    </label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background"
                      required
                      value={medicationData.instructions}
                      onChange={handleChange}
                      placeholder="E.g., Take with food, Avoid alcohol, etc."
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="sideEffects" className="text-sm font-medium">
                      Potential Side Effects
                    </label>
                    <textarea
                      id="sideEffects"
                      name="sideEffects"
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background"
                      value={medicationData.sideEffects}
                      onChange={handleChange}
                      placeholder="List potential side effects to monitor"
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-medium text-yellow-700">Important Notice</h4>
                  </div>
                  <p className="text-sm text-yellow-600">
                    Please verify all medication details before saving. Check for potential drug interactions and allergies.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit">
                    <Pill className="mr-2 h-4 w-4" />
                    {t('prescribeMedication')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescribeMedicationPage;
