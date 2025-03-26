import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import PatientDetailHeader from '@/components/patients/PatientDetailHeader';
;
;
import { toast } from 'sonner';
import { usePatientData } from '@/hooks/usePatientData';
import PatientDetailLoader from '@/components/patients/detail/PatientDetailLoader';
import { Patient as PatientType } from '@/types/patientTypes';

interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  mrn: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { patient, isLoading, updatePatient } = usePatientData(id);
  
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    mrn: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.first_name || '',
        lastName: patient.last_name || '',
        dateOfBirth: patient.date_of_birth ? new Date(patient.date_of_birth).toISOString().split('T')[0] : '',
        gender: patient.gender || '',
        mrn: patient.mrn || '',
        address: patient.address || '',
        city: patient.city || '',
        state: patient.state || '',
        zipCode: patient.zip_code || '',
        phone: patient.phone || '',
        email: patient.email || ''
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!id) return;
      
      await updatePatient({
        id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        mrn: formData.mrn,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        phone: formData.phone,
        email: formData.email
      });
      
      toast.success(t('profileUpdated') || 'Patient profile updated successfully');
      navigate(`/patients/${id}`);
    } catch (error) {
      console.error('Error updating patient profile:', error);
      toast.error(t('profileUpdateError') || 'Failed to update patient profile');
    }
  };

  if (isLoading || !patient) {
    return <PatientDetailLoader />;
  }

  const patientForHeader = {
    ...patient,
    gender: patient.gender || ''
  } as PatientType;

  return (
    <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-6xl mx-auto">
            <PatientDetailHeader 
              patient={patientForHeader} 
              hasCriticalInsights={false}
            />
            
            <div className="glass-card p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">{t('editProfile') || 'Edit Patient Profile'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-medium">{t('firstName') || 'First Name'}</span>
                      <Input 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    
                    <label className="block">
                      <span className="text-sm font-medium">{t('lastName') || 'Last Name'}</span>
                      <Input 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    
                    <label className="block">
                      <span className="text-sm font-medium">{t('dateOfBirth') || 'Date of Birth'}</span>
                      <Input 
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    
                    <label className="block">
                      <span className="text-sm font-medium">{t('gender') || 'Gender'}</span>
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">{t('selectGender') || 'Select Gender'}</option>
                        <option value="male">{t('male') || 'Male'}</option>
                        <option value="female">{t('female') || 'Female'}</option>
                        <option value="other">{t('other') || 'Other'}</option>
                        <option value="prefer_not_to_say">{t('preferNotToSay') || 'Prefer not to say'}</option>
                      </select>
                    </label>
                    
                    <label className="block">
                      <span className="text-sm font-medium">{t('mrn') || 'Medical Record Number'}</span>
                      <Input 
                        name="mrn"
                        value={formData.mrn}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-medium">{t('address') || 'Address'}</span>
                      <Textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-sm font-medium">{t('city') || 'City'}</span>
                        <Input 
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </label>
                      
                      <label className="block">
                        <span className="text-sm font-medium">{t('state') || 'State'}</span>
                        <Input 
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    
                    <label className="block">
                      <span className="text-sm font-medium">{t('zipCode') || 'Zip Code'}</span>
                      <Input 
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </label>
                    
                    <label className="block">
                      <span className="text-sm font-medium">{t('phone') || 'Phone'}</span>
                      <Input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </label>
                    
                    <label className="block">
                      <span className="text-sm font-medium">{t('email') || 'Email'}</span>
                      <Input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/patients/${id}`)}
                  >
                    {t('cancel') || 'Cancel'}
                  </Button>
                  
                  <Button type="submit">
                    {t('saveChanges') || 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
  );
};

export default PatientProfile;
