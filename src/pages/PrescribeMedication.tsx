import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { PrescriptionItem, createPrescription } from '../services/prescriptionService';
import { ArrowLeft, Save, Pill, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for the form
type PrescriptionFormState = {
  patientId: string;
  patientName: string;
  notes: string;
  items: PrescriptionItem[];
};

// Type for the item being currently edited
type CurrentItem = Omit<PrescriptionItem, 'id' | 'status'> & { index?: number };

const PrescribeMedicationPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if user has permission to prescribe
  const canPrescribe = user?.role === 'doctor' || user?.role === 'admin' || 
                      (user?.permissions && user.permissions.includes('prescribe_medications'));
  
  // State for the prescription form
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionFormState>({
    patientId: patientId || '',
    patientName: '',
    notes: '',
    items: []
  });
  
  // State for the currently edited item
  const [currentItem, setCurrentItem] = useState<CurrentItem>({
    name: '',
    type: 'medication',
    details: '',
    dosage: '',
    frequency: '',
    duration: '',
    startDate: '',
    endDate: '',
    instructions: ''
  });
  
  // State for the active tab
  const [activeTab, setActiveTab] = useState<string>('medication');
  
  // Load patient data if patientId is provided
  useEffect(() => {
    if (patientId) {
      // In a real app, you would fetch patient data here
      // For now, just set a mock patient name
      setPrescriptionData(prev => ({
        ...prev,
        patientId,
        patientName: `Patient ${patientId}`
      }));
    }
  }, [patientId]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentItem(prev => ({
      ...prev,
      type: value as PrescriptionItem['type'],
      // Reset fields that are not relevant to the new type
      dosage: value === 'medication' ? prev.dosage : '',
      frequency: ['medication', 'procedure'].includes(value) ? prev.frequency : '',
      duration: ['medication', 'procedure'].includes(value) ? prev.duration : ''
    }));
  };
  
  // Handle changes to prescription data
  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrescriptionData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle changes to the current item
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };
  
  // Add the current item to the prescription
  const handleAddItem = () => {
    // Validate required fields
    if (!currentItem.name) {
      toast.success("Item name is required", { description: "Please enter a name for the item." });
      return;
    }
    
    const newItem: PrescriptionItem = {
      id: currentItem.index !== undefined ? prescriptionData.items[currentItem.index].id : crypto.randomUUID(),
      name: currentItem.name,
      type: currentItem.type,
      details: currentItem.details || undefined,
      dosage: currentItem.dosage || undefined,
      frequency: currentItem.frequency || undefined,
      duration: currentItem.duration || undefined,
      startDate: currentItem.startDate || undefined,
      endDate: currentItem.endDate || undefined,
      instructions: currentItem.instructions || undefined,
      status: 'pending'
    };
    
    if (currentItem.index !== undefined) {
      // Update existing item
      const updatedItems = [...prescriptionData.items];
      updatedItems[currentItem.index] = newItem;
      setPrescriptionData(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Add new item
      setPrescriptionData(prev => ({ 
        ...prev, 
        items: [...prev.items, newItem] 
      }));
    }
    
    // Reset current item
    setCurrentItem({
      name: '',
      type: activeTab as PrescriptionItem['type'],
      details: '',
      dosage: '',
      frequency: '',
      duration: '',
      startDate: '',
      endDate: '',
      instructions: ''
    });
    
    toast.success(`${currentItem.name} added to prescription`, { description: "The item has been successfully added to the prescription." });
  };
  
  // Edit an existing item
  const handleEditItem = (index: number) => {
    const item = prescriptionData.items[index];
    setActiveTab(item.type);
    setCurrentItem({
      name: item.name,
      type: item.type,
      details: item.details || '',
      dosage: item.dosage || '',
      frequency: item.frequency || '',
      duration: item.duration || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      instructions: item.instructions || '',
      index
    });
  };
  
  // Remove an item from the prescription
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...prescriptionData.items];
    updatedItems.splice(index, 1);
    setPrescriptionData(prev => ({ ...prev, items: updatedItems }));
    
    toast.success("Item removed", { description: "The item has been removed from the prescription." });
  };
  
  // Submit the prescription
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPrescribe) {
      toast.error("Permission Denied", { description: "You don't have permission to prescribe medications." });
      return;
    }
    
    if (prescriptionData.items.length === 0) {
      toast.error("No Items", { description: "Please add at least one item to the prescription." });
      return;
    }
    
    try {
      // Create the prescription
      await createPrescription({
        patientId: prescriptionData.patientId,
        patientName: prescriptionData.patientName,
        doctorId: user?.id || '',
        doctorName: user?.name || '',
        date: new Date().toISOString(),
        items: prescriptionData.items,
        status: 'active',
        notes: prescriptionData.notes
      }, user!);
      
      toast.success("Prescription created successfully", { description: "The prescription has been successfully created." });
      
      // Navigate back
      if (patientId) {
        navigate(`/patients/${patientId}`);
      } else {
        navigate('/prescriptions');
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error("Failed to create prescription", { description: "Failed to create the prescription." });
    }
  };
  
  // If user doesn't have permission, redirect or show message
  if (!canPrescribe) {
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
                <h1 className="text-2xl font-semibold">No Permission</h1>
              </div>
              
              <div className="glass-card p-6">
                <div className="text-center p-4">
                  <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Permission Denied</h2>
                  <p className="text-muted-foreground mb-4">
                    You don't have permission to prescribe medications.
                  </p>
                  <Button onClick={() => navigate(-1)}>
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
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
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Patient Information */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-medium mb-4">Patient Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="patientId" className="text-sm font-medium">
                        Patient ID *
                      </label>
                      <input
                        id="patientId"
                        name="patientId"
                        className="w-full h-10 px-3 rounded-md border border-border bg-background"
                        required
                        value={prescriptionData.patientId}
                        onChange={handlePrescriptionChange}
                        readOnly={!!patientId}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="patientName" className="text-sm font-medium">
                        Patient Name *
                      </label>
                      <input
                        id="patientName"
                        name="patientName"
                        className="w-full h-10 px-3 rounded-md border border-border bg-background"
                        required
                        value={prescriptionData.patientName}
                        onChange={handlePrescriptionChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Prescription Items */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-medium mb-4">Prescription Items</h2>
                  
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="medication">Medication</TabsTrigger>
                      <TabsTrigger value="procedure">Procedure</TabsTrigger>
                      <TabsTrigger value="lab_test">Lab Test</TabsTrigger>
                      <TabsTrigger value="imaging">Imaging</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="medication">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Medication Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            required
                            value={currentItem.name}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="dosage" className="text-sm font-medium">
                            Dosage *
                          </label>
                          <input
                            id="dosage"
                            name="dosage"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            required
                            value={currentItem.dosage}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="frequency" className="text-sm font-medium">
                            Frequency *
                          </label>
                          <select
                            id="frequency"
                            name="frequency"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            required
                            value={currentItem.frequency}
                            onChange={handleItemChange}
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
                          <label htmlFor="duration" className="text-sm font-medium">
                            Duration
                          </label>
                          <input
                            id="duration"
                            name="duration"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            value={currentItem.duration}
                            onChange={handleItemChange}
                            placeholder="e.g., 10 days, 2 weeks"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="startDate" className="text-sm font-medium">
                            Start Date *
                          </label>
                          <input
                            id="startDate"
                            name="startDate"
                            type="date"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            required
                            value={currentItem.startDate}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="endDate" className="text-sm font-medium">
                            End Date
                          </label>
                          <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            value={currentItem.endDate}
                            onChange={handleItemChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <label htmlFor="instructions" className="text-sm font-medium">
                          Instructions *
                        </label>
                        <textarea
                          id="instructions"
                          name="instructions"
                          rows={3}
                          className="w-full px-3 py-2 rounded-md border border-border bg-background"
                          required
                          value={currentItem.instructions}
                          onChange={handleItemChange}
                          placeholder="E.g., Take with food, Avoid alcohol, etc."
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="procedure">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Procedure Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            required
                            value={currentItem.name}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="details" className="text-sm font-medium">
                            Details
                          </label>
                          <input
                            id="details"
                            name="details"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            value={currentItem.details}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="frequency" className="text-sm font-medium">
                            Frequency
                          </label>
                          <input
                            id="frequency"
                            name="frequency"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            value={currentItem.frequency}
                            onChange={handleItemChange}
                            placeholder="e.g., Once weekly, Daily, etc."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="duration" className="text-sm font-medium">
                            Duration
                          </label>
                          <input
                            id="duration"
                            name="duration"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            value={currentItem.duration}
                            onChange={handleItemChange}
                            placeholder="e.g., 4 weeks, 2 months"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="startDate" className="text-sm font-medium">
                            Start Date
                          </label>
                          <input
                            id="startDate"
                            name="startDate"
                            type="date"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            value={currentItem.startDate}
                            onChange={handleItemChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <label htmlFor="instructions" className="text-sm font-medium">
                          Instructions *
                        </label>
                        <textarea
                          id="instructions"
                          name="instructions"
                          rows={3}
                          className="w-full px-3 py-2 rounded-md border border-border bg-background"
                          required
                          value={currentItem.instructions}
                          onChange={handleItemChange}
                          placeholder="Special instructions for the procedure"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="lab_test">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Lab Test Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            required
                            value={currentItem.name}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="details" className="text-sm font-medium">
                            Details
                          </label>
                          <input
                            id="details"
                            name="details"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            value={currentItem.details}
                            onChange={handleItemChange}
                            placeholder="Any specific details for this test"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <label htmlFor="instructions" className="text-sm font-medium">
                          Instructions
                        </label>
                        <textarea
                          id="instructions"
                          name="instructions"
                          rows={3}
                          className="w-full px-3 py-2 rounded-md border border-border bg-background"
                          value={currentItem.instructions}
                          onChange={handleItemChange}
                          placeholder="E.g., Fasting required, No water for 12 hours, etc."
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="imaging">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Imaging Study Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            required
                            value={currentItem.name}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="details" className="text-sm font-medium">
                            Details
                          </label>
                          <input
                            id="details"
                            name="details"
                            className="w-full h-10 px-3 rounded-md border border-border bg-background"
                            value={currentItem.details}
                            onChange={handleItemChange}
                            placeholder="E.g., With contrast, Specific views, etc."
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <label htmlFor="instructions" className="text-sm font-medium">
                          Instructions
                        </label>
                        <textarea
                          id="instructions"
                          name="instructions"
                          rows={3}
                          className="w-full px-3 py-2 rounded-md border border-border bg-background"
                          value={currentItem.instructions}
                          onChange={handleItemChange}
                          placeholder="Special instructions for the imaging study"
                        />
                      </div>
                    </TabsContent>
                    
                    <div className="flex justify-end mt-2">
                      <Button 
                        type="button" 
                        onClick={handleAddItem}
                        className="flex items-center"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {currentItem.index !== undefined ? 'Update Item' : 'Add Item'}
                      </Button>
                    </div>
                  </Tabs>
                  
                  {/* List of Added Items */}
                  {prescriptionData.items.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">Added Items</h3>
                      <div className="space-y-3">
                        {prescriptionData.items.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground capitalize">{item.type}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="p-1 hover:bg-accent rounded-md"
                                onClick={() => handleEditItem(index)}
                              >
                                <Pill className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                className="p-1 hover:bg-accent rounded-md text-destructive"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Notes */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-medium mb-4">Additional Notes</h2>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background"
                      value={prescriptionData.notes}
                      onChange={handlePrescriptionChange}
                      placeholder="Any additional notes or comments"
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-medium text-yellow-700">Important Notice</h4>
                  </div>
                  <p className="text-sm text-yellow-600">
                    Please verify all prescription details before saving. Check for potential drug interactions and allergies.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Prescription
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescribeMedicationPage;
