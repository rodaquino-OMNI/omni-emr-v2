
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { usePatientData } from '@/hooks/usePatientData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useTranslation();
  
  const { patient, isLoading } = usePatientData(id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [mrn, setMrn] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [status, setStatus] = useState('');
  
  // Initialize form fields when patient data is loaded
  React.useEffect(() => {
    if (patient) {
      setFirstName(patient.first_name);
      setLastName(patient.last_name);
      setDob(patient.date_of_birth);
      setGender(patient.gender || '');
      setMrn(patient.mrn);
      setAddress(patient.address || '');
      setCity(patient.city || '');
      setState(patient.state || '');
      setZipCode(patient.zip_code || '');
      setPhone(patient.phone || '');
      setEmail(patient.email || '');
      setRoomNumber(patient.room_number || '');
      setStatus(patient.status);
    }
  }, [patient]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patient) return;
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast.success(
        language === 'pt' 
          ? 'Perfil do paciente atualizado com sucesso' 
          : 'Patient profile updated successfully'
      );
      
      // Navigate back to patient detail page
      navigate(`/patients/${id}`);
    } catch (error) {
      console.error('Error updating patient profile:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao atualizar perfil do paciente' 
          : 'Error updating patient profile'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // Error state for patient not found
  if (!patient) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <Button 
                variant="ghost" 
                className="mb-4"
                onClick={() => navigate('/patients')}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {language === 'pt' ? 'Voltar para pacientes' : 'Back to patients'}
              </Button>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-xl font-bold text-red-500">
                    {language === 'pt' ? 'Paciente não encontrado' : 'Patient not found'}
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    {language === 'pt' 
                      ? 'O paciente solicitado não pôde ser encontrado.' 
                      : 'The requested patient could not be found.'}
                  </p>
                </CardContent>
              </Card>
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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(`/patients/${id}`)}
                  className="mr-4"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {language === 'pt' ? 'Voltar ao paciente' : 'Back to patient'}
                </Button>
                <h1 className="text-2xl font-bold">
                  {language === 'pt' ? 'Editar perfil do paciente' : 'Edit Patient Profile'}
                </h1>
              </div>
              
              <Button 
                type="submit" 
                form="patient-form" 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {language === 'pt' ? 'Salvar alterações' : 'Save changes'}
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {`${firstName} ${lastName}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal">
                  <TabsList className="mb-4">
                    <TabsTrigger value="personal">
                      {language === 'pt' ? 'Informações pessoais' : 'Personal Info'}
                    </TabsTrigger>
                    <TabsTrigger value="contact">
                      {language === 'pt' ? 'Contato' : 'Contact Info'}
                    </TabsTrigger>
                    <TabsTrigger value="medical">
                      {language === 'pt' ? 'Informações médicas' : 'Medical Info'}
                    </TabsTrigger>
                  </TabsList>
                  
                  <form id="patient-form" onSubmit={handleSubmit}>
                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">
                            {language === 'pt' ? 'Nome' : 'First Name'}
                          </Label>
                          <Input 
                            id="firstName" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">
                            {language === 'pt' ? 'Sobrenome' : 'Last Name'}
                          </Label>
                          <Input 
                            id="lastName" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dob">
                            {language === 'pt' ? 'Data de nascimento' : 'Date of Birth'}
                          </Label>
                          <Input 
                            id="dob" 
                            type="date" 
                            value={dob} 
                            onChange={(e) => setDob(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="gender">
                            {language === 'pt' ? 'Gênero' : 'Gender'}
                          </Label>
                          <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger id="gender">
                              <SelectValue placeholder={language === 'pt' ? 'Selecione o gênero' : 'Select gender'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">
                                {language === 'pt' ? 'Masculino' : 'Male'}
                              </SelectItem>
                              <SelectItem value="Female">
                                {language === 'pt' ? 'Feminino' : 'Female'}
                              </SelectItem>
                              <SelectItem value="Other">
                                {language === 'pt' ? 'Outro' : 'Other'}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="mrn">
                            {language === 'pt' ? 'MRN' : 'MRN (Medical Record Number)'}
                          </Label>
                          <Input 
                            id="mrn" 
                            value={mrn} 
                            onChange={(e) => setMrn(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contact" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">
                            {language === 'pt' ? 'Endereço' : 'Address'}
                          </Label>
                          <Input 
                            id="address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="city">
                            {language === 'pt' ? 'Cidade' : 'City'}
                          </Label>
                          <Input 
                            id="city" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="state">
                            {language === 'pt' ? 'Estado' : 'State'}
                          </Label>
                          <Input 
                            id="state" 
                            value={state} 
                            onChange={(e) => setState(e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">
                            {language === 'pt' ? 'CEP' : 'Zip Code'}
                          </Label>
                          <Input 
                            id="zipCode" 
                            value={zipCode} 
                            onChange={(e) => setZipCode(e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            {language === 'pt' ? 'Telefone' : 'Phone'}
                          </Label>
                          <Input 
                            id="phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            {language === 'pt' ? 'E-mail' : 'Email'}
                          </Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="medical" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="roomNumber">
                            {language === 'pt' ? 'Número do quarto' : 'Room Number'}
                          </Label>
                          <Input 
                            id="roomNumber" 
                            value={roomNumber} 
                            onChange={(e) => setRoomNumber(e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status">
                            {language === 'pt' ? 'Status' : 'Status'}
                          </Label>
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder={language === 'pt' ? 'Selecione o status' : 'Select status'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stable">
                                {language === 'pt' ? 'Estável' : 'Stable'}
                              </SelectItem>
                              <SelectItem value="improving">
                                {language === 'pt' ? 'Melhorando' : 'Improving'}
                              </SelectItem>
                              <SelectItem value="critical">
                                {language === 'pt' ? 'Crítico' : 'Critical'}
                              </SelectItem>
                              <SelectItem value="hospital">
                                {language === 'pt' ? 'Hospitalizado' : 'Hospitalized'}
                              </SelectItem>
                              <SelectItem value="home">
                                {language === 'pt' ? 'Em Casa' : 'At Home'}
                              </SelectItem>
                              <SelectItem value="discharged">
                                {language === 'pt' ? 'Alta' : 'Discharged'}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </form>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientProfile;
